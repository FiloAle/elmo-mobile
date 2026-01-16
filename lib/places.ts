export interface PlaceResult {
	id?: string;
	name: string;
	latitude: number;
	longitude: number;
	address?: string;
	distance?: number; // in meters
	image?: string;
}

const QUERY_MAPPING: Record<string, string> = {
	"gas station": "[amenity=fuel]",
	"petrol station": "[amenity=fuel]",
	"ev charging": "charging_station",
	"charging station": "charging_station",
	"ev charging station": "charging_station",
	"electric vehicle charging": "charging_station",
	restaurant: "[amenity=restaurant]",
	pharmacy: "[amenity=pharmacy]",
	hospital: "[amenity=hospital]",
	parking: "[amenity=parking]",
	supermarket: "[shop=supermarket]",
	cafe: "[amenity=cafe]",
	bakery: "[shop=bakery]",
	atm: "[amenity=atm]",
	bank: "[amenity=bank]",
	hotel: "[tourism=hotel]",
	bar: "[amenity=bar]",
	pub: "[amenity=pub]",
	cinema: "[amenity=cinema]",
	gym: "[leisure=fitness_centre]",
	school: "[amenity=school]",
	university: "[amenity=university]",
	library: "[amenity=library]",
	"post office": "[amenity=post_office]",
	police: "[amenity=police]",
	"tourist attraction": "[tourism=attraction]",
	attraction: "[tourism=attraction]",
	museum: "[tourism=museum]",
};

const AUTOGRILL_PERO_NORD = {
	id: "autogrill-pero-nord",
	name: "Autogrill Pero Nord, Italy",
	latitude: 45.51385067115633,
	longitude: 9.069810203049895,
};

// Helper to fetch from Overpass with timeout
async function fetchOverpass(
	key: string,
	value: string,
	userLat: number,
	userLon: number,
	query: string
): Promise<PlaceResult[] | null> {
	let currentRadius = 1500;
	// Reduced retries and delays for faster failover
	const MAX_RETRIES = 2;
	const BASE_DELAY = 500;
	let lastError;

	for (let i = 0; i < MAX_RETRIES; i++) {
		const overpassQuery = `[out:json][timeout:5];nwr(around:${currentRadius},${userLat},${userLon})["${key}"="${value}"];out center 20;`;
		const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
			overpassQuery
		)}`;

		console.log(
			`Overpass API request (${
				i + 1
			}/${MAX_RETRIES}), radius: ${currentRadius}m`
		);

		try {
			// Strict 3.5s timeout per request
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 3500);

			const response = await fetch(url, { signal: controller.signal });
			clearTimeout(timeoutId);

			if (response.ok) {
				const data = await response.json();
				if (data && data.elements && data.elements.length > 0) {
					return data.elements
						.map((element: any) => {
							const lat = element.lat || element.center?.lat;
							const lon = element.lon || element.center?.lon;
							if (!lat || !lon) return null;

							const name =
								element.tags?.name ||
								element.tags?.brand ||
								element.tags?.operator ||
								`${value.replace("_", " ")} (${element.id})`;

							const distance = getDistance(userLat, userLon, lat, lon);

							return {
								id: String(element.id),
								name,
								latitude: parseFloat(lat),
								longitude: parseFloat(lon),
								distance: Math.round(distance),
								image:
									element.tags?.image ||
									element.tags?.["image:url"] ||
									generatePlaceImage(name, query),
							};
						})
						.filter((item: PlaceResult | null) => item !== null)
						.sort(
							(a: PlaceResult, b: PlaceResult) =>
								(a.distance || 0) - (b.distance || 0)
						);
				}
				return []; // Empty valid result
			}

			// If 504/429, retry
			if (response.status === 504 || response.status === 429) {
				console.log(`Overpass API ${response.status}, retrying...`);
				currentRadius = Math.max(500, currentRadius - 500);
				await new Promise((r) => setTimeout(r, BASE_DELAY * Math.pow(2, i)));
				continue;
			}
		} catch (e) {
			lastError = e;
			// AbortError means timeout
			if ((e as Error).name === "AbortError") {
				console.log("Overpass request timed out (5s limit)");
			} else {
				console.log("Overpass network error");
			}
			await new Promise((r) => setTimeout(r, BASE_DELAY * Math.pow(2, i)));
		}
	}
	return null; // Failed or timed out
}

// Helper to fetch from Nominatim
async function fetchNominatim(
	query: string,
	userLat: number,
	userLon: number
): Promise<PlaceResult[]> {
	const delta = 0.04;
	const viewbox = `${userLon - delta},${userLat + delta},${userLon + delta},${
		userLat - delta
	}`;

	const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
		query
	)}&format=json&limit=10&viewbox=${viewbox}&bounded=1&addressdetails=1&dedupe=1`;

	console.log("Nominatim request: ", query);

	try {
		const response = await fetch(url, {
			headers: { "User-Agent": "ElmoMobileNavigationApp/1.0" },
		});

		if (!response.ok) {
			console.warn("Nominatim API error:", response.status);
			return [];
		}

		const data = await response.json();
		if (data && data.length > 0) {
			return data
				.map((item: any) => {
					const distance = getDistance(
						userLat,
						userLon,
						parseFloat(item.lat),
						parseFloat(item.lon)
					);
					return {
						id: String(item.place_id || item.osm_id),
						name: item.name || item.display_name.split(",")[0],
						latitude: parseFloat(item.lat),
						longitude: parseFloat(item.lon),
						address: item.display_name,
						distance: Math.round(distance),
						image: generatePlaceImage(
							item.name || item.display_name.split(",")[0],
							query
						),
					};
				})
				.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));
		}
	} catch (error) {
		console.error("Nominatim error:", error);
	}
	return [];
}

export async function searchPlaces(
	query: string,
	userLat: number,
	userLon: number
): Promise<PlaceResult[]> {
	try {
		const mappedQuery = QUERY_MAPPING[query.toLowerCase()] || query;
		const lowerQuery = query.toLowerCase();

		// Inject Autogrill Pero Nord
		let injectedResult: PlaceResult | null = null;
		if (
			lowerQuery.includes("coffee") ||
			lowerQuery.includes("cafe") ||
			lowerQuery.includes("restaurant") ||
			lowerQuery.includes("autogrill") ||
			lowerQuery.includes("break") ||
			lowerQuery.includes("stop")
		) {
			const dist = getDistance(
				userLat,
				userLon,
				AUTOGRILL_PERO_NORD.latitude,
				AUTOGRILL_PERO_NORD.longitude
			);
			injectedResult = {
				...AUTOGRILL_PERO_NORD,
				distance: Math.round(dist),
				image: generatePlaceImage(
					AUTOGRILL_PERO_NORD.name,
					"autogrill restaurant"
				),
			};
		}

		// 1. Start Nominatim immediately (always runs as backup/parallel)
		const nominatimPromise = fetchNominatim(query, userLat, userLon);

		let overpassResults: PlaceResult[] | null = null;
		let nominatimResults: PlaceResult[] = [];

		if (mappedQuery.startsWith("[")) {
			// Structured query: Run Overpass
			const match = mappedQuery.match(/\[(.*?)=(.*?)\]/);
			if (match) {
				const key = match[1];
				const value = match[2];

				// 2. Start Overpass
				const overpassPromise = fetchOverpass(
					key,
					value,
					userLat,
					userLon,
					query
				);

				// 3. Race: Wait for Overpass for max 4 seconds.
				// If it returns, use it. If it times out or fails (returns null), fallback to Nominatim.
				const overpassOrTimeout = Promise.race([
					overpassPromise,
					new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000)),
				]);

				overpassResults = await overpassOrTimeout;

				if (overpassResults && overpassResults.length > 0) {
					console.log("Using Overpass results (found fast).");
				} else {
					console.log("Overpass slow or failed, falling back to Nominatim...");
				}
			}
		}

		// 4. Combine/Select results
		let finalResults: PlaceResult[] = [];

		if (overpassResults && overpassResults.length > 0) {
			finalResults = overpassResults;
		} else {
			// Await Nominatim if Overpass failed/timed out
			nominatimResults = await nominatimPromise;
			finalResults = nominatimResults;
		}

		if (injectedResult) {
			finalResults.unshift(injectedResult);
		}

		return finalResults.slice(0, 8);
	} catch (error) {
		console.error("Error finding place:", error);
		return [];
	}
}

export function getDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number {
	const R = 6371e3; // metres
	const φ1 = (lat1 * Math.PI) / 180;
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lon2 - lon1) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
}

export function generatePlaceImage(name: string, query: string): string {
	const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, "");
	const prompt = `${cleanName} ${query} exterior`;
	const encodedPrompt = encodeURIComponent(prompt);

	// Use Bing's thumbnail service to get a real web image
	return `https://tse4.mm.bing.net/th?q=${encodedPrompt}&w=400&h=300&c=7&rs=1`;
}
