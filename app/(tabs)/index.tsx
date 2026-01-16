import React, { useState, useMemo, useRef, useEffect } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	TextInput,
	ImageBackground,
	ScrollView,
	ActivityIndicator,
	useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/theme";
import { searchPlaces, PlaceResult } from "../../lib/places";
import { fetchServerState, sendStopRequest } from "@/lib/sync";
import { convoySync } from "@/lib/convoySync";
import { getDistance, getBearing } from "@/lib/navigation";

const CATEGORIES = [
	{ id: "restaurant", name: "Restaurant", icon: "silverware-fork-knife" },
	{ id: "cafe", name: "Cafe", icon: "coffee" },
	{ id: "supermarket", name: "Supermarket", icon: "cart" },
	{ id: "charging_station", name: "Ev Charging", icon: "ev-station" },
	{ id: "tourism", name: "Tourism", icon: "map" },
];

const CHARGING_STATIONS = [
	{
		id: "1",
		name: "Tesla Supercharger",
		address: "Via Monte Napoleone, 12",
		distance: "1.2 km",
		status: "Available",
		power: "250kW",
		image: require("../../assets/images/tesla.jpg"),
	},
	{
		id: "2",
		name: "Enel X Way",
		address: "Corso Como, 5",
		distance: "2.5 km",
		status: "Busy",
		power: "50kW",
		image: require("../../assets/images/enel.jpg"),
	},
	{
		id: "3",
		name: "Ionity",
		address: "A8 Service Station",
		distance: "8.0 km",
		status: "Available",
		power: "350kW",
		image: require("../../assets/images/ionity.jpg"),
	},
	{
		id: "4",
		name: "Be Charge",
		address: "Piazza Gae Aulenti",
		distance: "3.1 km",
		status: "Available",
		power: "150kW",
		image: require("../../assets/images/becharge.jpg"),
	},
];

const GENERAL_PLACES = [
	{
		id: "1",
		name: "Starbucks Reserve",
		address: "Piazza Cordusio",
		distance: "0.8 km",
		status: "Open",
		power: null,
		image: require("../../assets/images/starbucks.jpg"),
	},
	{
		id: "2",
		name: "Marchesi 1824",
		address: "Galleria Vittorio Emanuele II",
		distance: "1.0 km",
		status: "Busy",
		power: null,
		image: require("../../assets/images/marchesi.jpg"),
	},
	{
		id: "3",
		name: "Camparino in Galleria",
		address: "Piazza del Duomo",
		distance: "0.9 km",
		status: "Open",
		power: null,
		image: require("../../assets/images/camparino.jpg"),
	},
	{
		id: "4",
		name: "Pasticceria Cova",
		address: "Via Montenapoleone",
		distance: "1.2 km",
		status: "Open",
		power: null,
		image: require("../../assets/images/cova.jpg"),
	},
];

const SAVED_LOCATIONS = [
	{ id: "1", name: "Supermarket", address: "Via Dante, 4", icon: "cart" },
	{ id: "2", name: "Gym", address: "Corso Buenos Aires, 10", icon: "dumbbell" },
];

const DARK_MAP_STYLE = [
	{
		elementType: "geometry",
		stylers: [
			{
				color: "#212121",
			},
		],
	},
	{
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#757575",
			},
		],
	},
	{
		elementType: "labels.text.stroke",
		stylers: [
			{
				color: "#212121",
			},
		],
	},
	{
		featureType: "administrative",
		elementType: "geometry",
		stylers: [
			{
				color: "#757575",
			},
		],
	},
	{
		featureType: "administrative.country",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#9e9e9e",
			},
		],
	},
	{
		featureType: "administrative.land_parcel",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "administrative.locality",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#bdbdbd",
			},
		],
	},
	{
		featureType: "poi",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#757575",
			},
		],
	},
	{
		featureType: "poi.park",
		elementType: "geometry",
		stylers: [
			{
				color: "#181818",
			},
		],
	},
	{
		featureType: "poi.park",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#616161",
			},
		],
	},
	{
		featureType: "poi.park",
		elementType: "labels.text.stroke",
		stylers: [
			{
				color: "#1b1b1b",
			},
		],
	},
	{
		featureType: "road",
		elementType: "geometry.fill",
		stylers: [
			{
				color: "#2c2c2c",
			},
		],
	},
	{
		featureType: "road",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#8a8a8a",
			},
		],
	},
	{
		featureType: "road.arterial",
		elementType: "geometry",
		stylers: [
			{
				color: "#373737",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "geometry",
		stylers: [
			{
				color: "#3c3c3c",
			},
		],
	},
	{
		featureType: "road.highway.controlled_access",
		elementType: "geometry",
		stylers: [
			{
				color: "#4e4e4e",
			},
		],
	},
	{
		featureType: "road.local",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#616161",
			},
		],
	},
	{
		featureType: "transit",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#757575",
			},
		],
	},
	{
		featureType: "water",
		elementType: "geometry",
		stylers: [
			{
				color: "#000000",
			},
		],
	},
	{
		featureType: "water",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#3d3d3d",
			},
		],
	},
];

export default function HomeScreen() {
	const colorScheme = useColorScheme();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const [searchText, setSearchText] = useState("");
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const [selectedPlace, setSelectedPlace] = useState<any>(null);

	// Toggle States for Route Preferences
	const [routePreference, setRoutePreference] = useState<"fast" | "economic">(
		"fast"
	);

	const [location, setLocation] = useState({
		latitude: 45.5121490834915,
		longitude: 9.110004203867218,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	});
	const [userHeading, setUserHeading] = useState(0);
	const [speed, setSpeed] = useState(0);

	const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	// Stop Request States
	const [myStopRequests, setMyStopRequests] = useState<string[]>([]);
	const [declinedStopRequests, setDeclinedStopRequests] = useState<string[]>(
		[]
	);
	const [addedStops, setAddedStops] = useState<string[]>([]);

	// Route State
	const [routeCoords, setRouteCoords] = useState<
		{ latitude: number; longitude: number }[]
	>([]);
	const [routeWaypoints, setRouteWaypoints] = useState<any[]>([]);
	const [destination, setDestination] = useState<any>(null);
	const [navigationState, setNavigationState] = useState<
		"idle" | "preview" | "active"
	>("idle");

	// Autopilot Refs (copied from elmo-expo)
	const autopilotSpeed = useRef(0); // m/s
	const autopilotIndex = useRef(0); // current index in routeCoords
	const autopilotProgress = useRef(0); // progress between index and index+1 (0-1)
	const lastAutopilotUpdate = useRef(0);
	const autopilotInterval = useRef<any>(null);
	const autopilotEnabledRef = useRef(true); // Always enabled on mobile

	// WebSocket sync - matching car1-rear EXACTLY
	const mapRef = useRef<MapView>(null);
	const currentLookaheadHeading = useRef<number>(0);
	const userRegionRef = useRef(location);
	const navigationStateRef = useRef<"idle" | "preview" | "active">("idle");

	useEffect(() => {
		userRegionRef.current = location;
	}, [location]);

	useEffect(() => {
		navigationStateRef.current = navigationState;
	}, [navigationState]);

	// Initialize WebSocket connection
	useEffect(() => {
		convoySync.init("http://172.20.10.6:3001", "mobile");

		return () => {
			convoySync.disconnect();
		};
	}, []);

	// Subscribe to convoy sync data - EXACT car1-rear logic
	useEffect(() => {
		const unsubscribe = convoySync.onData((data) => {
			console.log(`[Mobile] Received ${data.type} from ${data.deviceRole}`);

			// Replicate car1-main data (matching car1-rear behavior)
			if (data.deviceRole === "car1-main") {
				switch (data.type) {
					case "location":
						setLocation((prev) => ({
							...prev,
							latitude: data.data.latitude,
							longitude: data.data.longitude,
						}));
						setUserHeading(data.data.heading || 0);
						setSpeed(data.data.speed || 0);

						const isNavigating = navigationStateRef.current === "active";
						const newLoc = {
							latitude: data.data.latitude,
							longitude: data.data.longitude,
						};

						// Calculate distance from current location
						let dist = 0;
						if (userRegionRef.current) {
							dist = getDistance(userRegionRef.current, newLoc);
						}

						if (mapRef.current) {
							const cameraHeading = data.data.heading || 0;
							const pitch = 60;
							const altitude = 100;

							mapRef.current.setCamera({
								center: newLoc,
								heading: cameraHeading,
								pitch: pitch,
								zoom: 18,
								altitude: altitude,
							});
						}
						break;

					case "destination":
						setDestination(data.data);
						break;

					case "waypoints":
						setRouteWaypoints(data.data);
						break;

					case "route":
						setRouteCoords(data.data.coordinates);
						// Fit map to route in preview mode
						if (
							data.data.coordinates.length > 0 &&
							navigationStateRef.current === "preview"
						) {
							mapRef.current?.fitToCoordinates(data.data.coordinates, {
								edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
								animated: true,
							});
						}
						break;

					case "navigation_state":
						setNavigationState(data.data.state);

						if (data.data.state === "idle") {
							setRouteCoords([]);
							setDestination(null);
							setRouteWaypoints([]);
							setAddedStops([]);
							setMyStopRequests([]);
						}
						break;

					case "stop_request_declined":
						const declinedName = data.data.name;
						setDeclinedStopRequests((prev) => [...prev, declinedName]);
						setMyStopRequests((prev) =>
							prev.filter((req) => req !== declinedName)
						);

						// Remove from declined list after 5 seconds
						setTimeout(() => {
							setDeclinedStopRequests((prev) =>
								prev.filter((req) => req !== declinedName)
							);
						}, 5000);
						break;

					case "waypoint_added":
						const wp = data.data;
						setAddedStops((prev) => [...prev, wp.name || wp.id]);
						setMyStopRequests((prev) =>
							prev.filter((req) => req !== (wp.name || wp.id))
						);
						break;
				}
			}
		});

		return () => unsubscribe();
	}, []);

	// Reset autopilot when route changes
	useEffect(() => {
		autopilotIndex.current = 0;
		autopilotProgress.current = 0;
		if (navigationState !== "active") {
			autopilotSpeed.current = 0;
		}
	}, [routeCoords, navigationState]);

	// Autopilot Simulation Loop (copied from elmo-expo)
	useEffect(() => {
		if (navigationState === "active" && routeCoords.length > 1) {
			// Start simulation
			if (!autopilotInterval.current) {
				lastAutopilotUpdate.current = Date.now();

				autopilotInterval.current = setInterval(() => {
					const now = Date.now();
					const dt = (now - lastAutopilotUpdate.current) / 1000; // seconds
					lastAutopilotUpdate.current = now;

					if (dt > 0.5) return; // Skip large jumps

					// 1. Calculate Target Speed
					let targetSpeed = 50 / 3.6; // Default 50 km/h in m/s

					// Simple turn detection: look 3 points ahead
					if (autopilotIndex.current + 3 < routeCoords.length) {
						const p1 = routeCoords[autopilotIndex.current];
						const p2 = routeCoords[autopilotIndex.current + 1];
						const p3 = routeCoords[autopilotIndex.current + 2];

						// Calculate bearings
						const b1 = getBearing(p1, p2);
						const b2 = getBearing(p2, p3);
						const diff = Math.abs(b1 - b2);

						// If turn > 20 degrees, slow down
						if (diff > 20) {
							targetSpeed = 20 / 3.6; // Slow to 20 km/h
						}
					}

					// 2. Update Speed (Physics)
					if (autopilotIndex.current >= routeCoords.length - 1) {
						autopilotSpeed.current = 0;
						setSpeed(0);
					} else {
						const currentSpeed = autopilotSpeed.current;
						if (currentSpeed < targetSpeed) {
							// Accelerate (2 m/s^2)
							autopilotSpeed.current = Math.min(
								targetSpeed,
								currentSpeed + 2 * dt
							);
						} else {
							// Decelerate (4 m/s^2)
							autopilotSpeed.current = Math.max(
								targetSpeed,
								currentSpeed - 4 * dt
							);
						}
					}

					// 3. Move
					const distanceToMove = autopilotSpeed.current * dt; // meters

					// Get current segment distance
					const pStart = routeCoords[autopilotIndex.current];
					const pEnd = routeCoords[autopilotIndex.current + 1];

					if (!pStart || !pEnd) {
						return;
					}

					const segmentDist = getDistance(
						{ latitude: pStart.latitude, longitude: pStart.longitude },
						{ latitude: pEnd.latitude, longitude: pEnd.longitude }
					);

					// Update progress
					const progressIncrement = distanceToMove / segmentDist;
					autopilotProgress.current += progressIncrement;

					// Check if we finished segment
					if (autopilotProgress.current >= 1) {
						autopilotIndex.current++;
						autopilotProgress.current = 0;

						if (autopilotIndex.current >= routeCoords.length - 1) {
							// Arrived
							setSpeed(0);
							autopilotSpeed.current = 0;
							return;
						}
					}

					// 4. Calculate new position
					const currentPStart = routeCoords[autopilotIndex.current];
					const currentPEnd = routeCoords[autopilotIndex.current + 1];

					const newLat =
						currentPStart.latitude +
						(currentPEnd.latitude - currentPStart.latitude) *
							autopilotProgress.current;
					const newLng =
						currentPStart.longitude +
						(currentPEnd.longitude - currentPStart.longitude) *
							autopilotProgress.current;

					if (isNaN(newLat) || isNaN(newLng)) {
						return;
					}

					// 5. Calculate Bearing for Camera
					const bearing = getBearing(
						{
							latitude: currentPStart.latitude,
							longitude: currentPStart.longitude,
						},
						{ latitude: currentPEnd.latitude, longitude: currentPEnd.longitude }
					);

					// 6. Update State
					setLocation({
						latitude: newLat,
						longitude: newLng,
						latitudeDelta: 0.005,
						longitudeDelta: 0.005,
					});
					setUserHeading(bearing);
					setSpeed(autopilotSpeed.current * 3.6); // km/h

					// 7. Update Camera
					if (mapRef.current) {
						// Smooth Heading Logic
						let diff = bearing - currentLookaheadHeading.current;
						// Normalize to -180...180
						if (diff > 180) diff -= 360;
						if (diff < -180) diff += 360;

						// Limit step (e.g. 5 degrees per frame)
						const maxStep = 5;
						const step = Math.max(-maxStep, Math.min(maxStep, diff));
						currentLookaheadHeading.current =
							(currentLookaheadHeading.current + step + 360) % 360;

						mapRef.current.setCamera({
							center: { latitude: newLat, longitude: newLng },
							heading: currentLookaheadHeading.current,
							pitch: 60,
							zoom: 18,
							altitude: 100, // Required for iOS
						});
					}
				}, 16); // 60fps (standard elmo-expo loop)
			}
		} else {
			// Stop simulation
			if (autopilotInterval.current) {
				clearInterval(autopilotInterval.current);
				autopilotInterval.current = null;
			}
			autopilotSpeed.current = 0;
		}

		return () => {
			if (autopilotInterval.current) {
				clearInterval(autopilotInterval.current);
				autopilotInterval.current = null;
			}
		};
	}, [navigationState, routeCoords]);

	// Special Effect for Preview State Camera (debounced/triggered once)
	useEffect(() => {
		if (
			navigationState === "preview" &&
			(destination || routeWaypoints.length > 0) &&
			mapRef.current
		) {
			// Create list of points to fit
			const points = [];
			// Add car pos
			points.push({
				latitude: location.latitude,
				longitude: location.longitude,
			});
			// Add dest
			if (destination)
				points.push({
					latitude: destination.latitude,
					longitude: destination.longitude,
				});
			// Add waypoints
			routeWaypoints.forEach((wp) =>
				points.push({ latitude: wp.latitude, longitude: wp.longitude })
			);

			if (points.length > 1) {
				mapRef.current.fitToCoordinates(points, {
					edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
					animated: true,
				});
			}
		} else if (navigationState === "active" && mapRef.current) {
			// Camera logic removed as requested
		}
	}, [navigationState, destination, routeWaypoints]);

	// Search places when category changes
	useEffect(() => {
		if (activeCategory) {
			setIsLoading(true);
			searchPlaces(activeCategory, location.latitude, location.longitude)
				.then((results) => {
					setSearchResults(results);
				})
				.catch((err) => console.error("Search failed", err))
				.finally(() => setIsLoading(false));
		} else {
			setSearchResults([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeCategory]);

	// Bottom Sheet Ref
	const bottomSheetRef = useRef<BottomSheet>(null);
	const { height } = require("react-native").useWindowDimensions();
	const HEADER_HEIGHT = 220;
	const topSnapPoint = height - HEADER_HEIGHT;
	const snapPoints = useMemo(
		() => ["45%", "70%", topSnapPoint],
		[topSnapPoint]
	);

	// Stable Bottom Sheet Behavior
	useEffect(() => {
		if (activeCategory || selectedPlace) {
			// Fully expand to top snap point (index 2)
			bottomSheetRef.current?.snapToIndex(2);
			// Double validation to ensure it sticks
			setTimeout(() => {
				bottomSheetRef.current?.snapToIndex(2);
			}, 300);
		} else {
			// Return to 45% (Dashboard) otherwise
			bottomSheetRef.current?.snapToIndex(0);
		}
	}, [activeCategory, selectedPlace]);

	const handleCategoryPress = (categoryId: string) => {
		setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
		setSelectedPlace(null);
	};

	const renderGridItem = ({ item }: { item: any }) => {
		// Randomly assign images for demo purposes (matching add-stop.tsx)
		const images = [
			require("../../assets/images/monte_bianco.jpg"),
			require("../../assets/images/Percorso_Arona.jpg"),
			require("../../assets/images/Percorso_lecco.jpg"),
			require("../../assets/images/background_map.jpg"),
		];
		// If item has a specific image, use it. Otherwise, pick randomly.
		const imgIndex = parseInt(item.id) % images.length;
		const imageSource = item.image || images[imgIndex];

		// Deterministic rating based on item ID/Name
		const seed = item.id || item.name || "default";
		const hash = seed
			.split("")
			.reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
		const rating = (4.0 + (hash % 10) / 10).toFixed(1); // 4.0 to 4.9

		return (
			<View style={styles.gridCard}>
				{/* Image Section */}
				<View style={styles.cardImageWrapper}>
					<Image
						source={imageSource}
						style={styles.cardImage}
						contentFit="cover"
					/>

					{/* Rating Badge */}
					<View style={styles.ratingBadge}>
						<Ionicons name="star" size={10} color="#FFD700" />
						<Text style={styles.ratingText}>{rating}</Text>
					</View>
				</View>

				{/* Info Section */}
				<Text style={styles.cardName} numberOfLines={1}>
					{item.name}
				</Text>
				<Text style={styles.cardDetails}>
					{item.distance ? `${(item.distance / 1000).toFixed(1)} km` : "0.0 km"}{" "}
					• 15 min
				</Text>

				{/* Add Button */}
				{/* Add/Request Button */}
				{/* Add/Request Button Logic */}
				{(() => {
					const isRequested = myStopRequests.includes(item.name);
					const isDeclined = declinedStopRequests.includes(item.name);
					const isAdded = addedStops.includes(item.name);

					if (isAdded) {
						return (
							<View
								style={[
									styles.addStopPill,
									{ backgroundColor: "rgba(94, 234, 212, 0.2)" },
								]}
							>
								<Ionicons name="checkmark-circle" size={16} color="#5EEAD4" />
								<Text style={[styles.addStopText, { color: "#5EEAD4" }]}>
									Accepted
								</Text>
							</View>
						);
					}

					if (isDeclined) {
						return (
							<View
								style={[
									styles.addStopPill,
									{ backgroundColor: "rgba(239, 68, 68, 0.2)" },
								]}
							>
								<Ionicons name="close-circle" size={16} color="#EF4444" />
								<Text style={[styles.addStopText, { color: "#EF4444" }]}>
									Declined
								</Text>
							</View>
						);
					}

					if (isRequested) {
						return (
							<View
								style={[
									styles.addStopPill,
									{ backgroundColor: "rgba(255, 255, 255, 0.1)" },
								]}
							>
								<ActivityIndicator size="small" color="#999" />
								<Text style={[styles.addStopText, { color: "#999" }]}>
									Requested
								</Text>
							</View>
						);
					}

					if (destination) {
						return (
							<TouchableOpacity
								style={[
									styles.addStopPill,
									{
										backgroundColor: "#112e33",
										borderColor: "#5EEAD4",
										borderWidth: 1,
									},
								]}
								onPress={async () => {
									const success = await sendStopRequest(item);
									if (success) {
										setMyStopRequests((prev) => [...prev, item.name]);
									}
								}}
							>
								<Ionicons name="add-circle" size={16} color="#5EEAD4" />
								<Text style={[styles.addStopText, { color: "#5EEAD4" }]}>
									Request Stop
								</Text>
							</TouchableOpacity>
						);
					}

					return null;
				})()}
			</View>
		);
	};

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={styles.container}>
				{/* Map View */}
				<MapView
					ref={mapRef}
					style={StyleSheet.absoluteFillObject}
					provider={PROVIDER_DEFAULT}
					showsCompass={false}
					// removing region prop to allow manual control via animateCamera/fitToCoordinates
					// inside effects, but keeping initialRegion if needed?
					// Actually, keeping region controlled might fight with animateCamera?
					// Use initialRegion or controlled region if careful.
					// Existing code used controlled 'region={location}'.
					// Ideally we switch to uncontrolled or carefully managed controlled.
					// Let's keep strict control for now but be aware of conflicts.
					initialRegion={location}
					userInterfaceStyle="dark"
					customMapStyle={DARK_MAP_STYLE}
				>
					{/* Route Polyline (if any) */}
					{routeCoords.length > 0 && (
						<Polyline
							coordinates={routeCoords}
							strokeWidth={8}
							strokeColor="#14b8a6" // Teal
							lineJoin="round"
							lineCap="round"
						/>
					)}

					{/* Destination Marker (Red) */}
					{destination && (
						<Marker
							coordinate={{
								latitude: destination.latitude,
								longitude: destination.longitude,
							}}
							title={destination.name}
							pinColor="red"
						/>
					)}

					{/* Waypoints Markers (Yellow) */}
					{routeWaypoints.map((wp, index) => (
						<Marker
							key={`wp-${index}`}
							coordinate={{ latitude: wp.latitude, longitude: wp.longitude }}
							title={wp.name}
							pinColor="yellow"
						/>
					))}

					{/* User Location Marker */}
					<Marker
						coordinate={location}
						anchor={{ x: 0.5, y: 0.5 }}
						flat
						rotation={userHeading}
					>
						<View style={styles.cursorContainer}>
							<Ionicons
								name="navigate"
								size={28}
								color="#5EEAD4"
								style={{ transform: [{ rotate: `-45deg` }] }}
							/>
						</View>
					</Marker>

					{/* Result Markers */}
					{searchResults.map((place, index) => (
						<Marker
							key={`${place.id}-${index}`}
							coordinate={{
								latitude: place.latitude,
								longitude: place.longitude,
							}}
							onPress={() => setSelectedPlace(place)}
						>
							<Image
								source={
									activeCategory
										? {
												uri: place.image || "https://placeholder", // Fallback?
										  }
										: require("../../assets/images/elmo_search.png")
								}
								style={{
									width: 30,
									height: 30,
									borderRadius: 15,
									borderWidth: 2,
									borderColor: Colors.elmo.accent,
								}}
							/>
						</Marker>
					))}
				</MapView>

				<View style={styles.overlay} pointerEvents="none" />

				{/* Floating Top Section */}
				<View style={[styles.floatingHeader, { top: insets.top }]}>
					{/* Header Row (Logo + Profile) */}
					<View style={styles.headerRow}>
						<Image
							source={require("../../assets/images/Elmo_logo.svg")}
							style={styles.logo}
							contentFit="contain"
						/>
						<View style={styles.profileAvatar}>
							<Image
								source={require("../../assets/images/profile image.jpeg")}
								style={{
									width: "100%",
									height: "100%",
									borderRadius: 20,
									borderWidth: 1,
									borderColor: "#000",
								}}
								contentFit="cover"
							/>
						</View>
					</View>

					{/* Search Row */}
					<View style={styles.searchRow}>
						{/* Removed Back Button for Home Screen */}

						<View style={styles.searchPill}>
							<TextInput
								style={styles.searchInput}
								placeholder="Search here..."
								placeholderTextColor="#888"
								value={searchText}
								onChangeText={setSearchText}
							/>
							<Image
								source={require("../../assets/images/elmo_search.png")}
								style={styles.searchIcon}
								contentFit="contain"
							/>
						</View>
					</View>

					{/* Horizontal Category Tags */}
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.categoriesContent}
						style={styles.categoriesContainer}
					>
						{CATEGORIES.map((cat) => {
							const isActive = activeCategory === cat.id;
							return (
								<TouchableOpacity
									key={cat.id}
									style={[
										styles.categoryChip,
										isActive && styles.categoryChipActive,
									]}
									activeOpacity={0.8}
									onPress={() => handleCategoryPress(cat.id)}
								>
									<MaterialCommunityIcons
										name={cat.icon as any}
										size={20}
										color={isActive ? "#000" : "#FFF"}
										style={{ marginRight: 8 }}
									/>
									<Text
										style={[
											styles.categoryText,
											isActive && styles.categoryTextActive,
										]}
									>
										{cat.name}
									</Text>
								</TouchableOpacity>
							);
						})}
					</ScrollView>
				</View>

				{/* ================= SINGLE BOTTOM SHEET ================= */}
				<BottomSheet
					ref={bottomSheetRef}
					index={0} // Default Open at 45%
					snapPoints={snapPoints}
					handleStyle={
						selectedPlace
							? { position: "absolute", width: "100%", zIndex: 10 }
							: undefined
					}
					handleIndicatorStyle={{
						backgroundColor: selectedPlace ? "rgba(255,255,255,0.8)" : "#333",
						width: 40,
						height: 4,
						borderRadius: 2,
						marginTop: 8,
					}}
					backgroundStyle={{
						backgroundColor: "#051616",
						borderTopLeftRadius: 28,
						borderTopRightRadius: 28,
						overflow: "hidden",
					}}
					style={{ zIndex: 50 }}
					enablePanDownToClose={false}
					enableOverDrag={false}
					topInset={HEADER_HEIGHT}
				>
					{selectedPlace ? (
						// PLACE DETAIL VIEW
						<View
							style={{
								flex: 1,
								backgroundColor: "#051616",
								paddingHorizontal: 0,
								paddingTop: 0,
							}}
						>
							{/* Hero Image */}
							<View style={styles.detailHeader}>
								<Image
									source={
										selectedPlace.image ||
										require("../../assets/images/background_map.jpg")
									}
									style={[
										styles.detailImage,
										{ borderTopLeftRadius: 28, borderTopRightRadius: 28 },
									]}
									contentFit="cover"
								/>
								{/* Overlay Back Button */}
								<TouchableOpacity
									onPress={() => setSelectedPlace(null)}
									style={[styles.backButtonOverlay, { top: 16 }]}
								>
									<Ionicons name="arrow-back" size={24} color="#FFF" />
								</TouchableOpacity>
							</View>

							<View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
								<Text style={styles.detailName}>{selectedPlace.name}</Text>
								<Text style={styles.detailAddress}>
									{selectedPlace.address}
								</Text>

								<View style={styles.badgesWrapper}>
									{/* Fast Toggle */}
									<TouchableOpacity
										style={[
											styles.preferenceBadge,
											routePreference === "fast" &&
												styles.preferenceBadgeActive,
										]}
										activeOpacity={0.8}
										onPress={() => setRoutePreference("fast")}
									>
										<MaterialCommunityIcons
											name="lightning-bolt"
											size={16}
											color={
												routePreference === "fast" ? Colors.elmo.accent : "#FFF"
											}
										/>
										<Text
											style={
												routePreference === "fast"
													? styles.preferenceTextActive
													: styles.preferenceText
											}
										>
											Fast
										</Text>
									</TouchableOpacity>

									{/* Economic Toggle */}
									<TouchableOpacity
										style={[
											styles.preferenceBadge,
											routePreference === "economic" &&
												styles.preferenceBadgeActive,
										]}
										activeOpacity={0.8}
										onPress={() => setRoutePreference("economic")}
									>
										<MaterialCommunityIcons
											name="leaf"
											size={16}
											color={
												routePreference === "economic"
													? Colors.elmo.accent
													: "#FFF"
											}
										/>
										<Text
											style={
												routePreference === "economic"
													? styles.preferenceTextActive
													: styles.preferenceText
											}
										>
											Economic
										</Text>
									</TouchableOpacity>
								</View>

								<TouchableOpacity
									style={styles.startNavButton}
									onPress={() => console.log("Start Nav")}
								>
									<Ionicons
										name="navigate"
										size={20}
										color="#000"
										style={{ marginRight: 8 }}
									/>
									<Text style={styles.startNavText}>Start Navigation</Text>
								</TouchableOpacity>
							</View>
						</View>
					) : (
						<View style={styles.bottomSheetContent}>
							{activeCategory ? (
								<>
									<Text style={styles.sheetTitle}>Nearby {activeCategory}</Text>
									{isLoading ? (
										<View
											style={{
												height: 400,
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<ActivityIndicator size="large" color="#5EEAD4" />
											<Text style={{ color: "#888", marginTop: 10 }}>
												Searching...
											</Text>
										</View>
									) : (
										<BottomSheetFlatList
											data={searchResults}
											keyExtractor={(item: any) =>
												item.id || Math.random().toString()
											}
											renderItem={renderGridItem}
											contentContainerStyle={styles.listContent}
											numColumns={2}
											columnWrapperStyle={styles.columnWrapper}
											showsVerticalScrollIndicator={false}
										/>
									)}
								</>
							) : (
								<ScrollView
									contentContainerStyle={styles.homeSheetContent}
									showsVerticalScrollIndicator={false}
								>
									{/* Traffic Conditions Card */}
									<Text style={styles.sectionHeaderTitle}>
										Traffic conditions
									</Text>
									<View style={styles.lightCard}>
										<View style={styles.trafficRow}>
											<View style={styles.alertIconContainer}>
												<MaterialCommunityIcons
													name="car-multiple"
													size={20}
													color="#FFF"
												/>
											</View>
											<View style={styles.trafficInfo}>
												<Text style={styles.alertTitle}>
													Accident in Via Candiani
												</Text>
												<View
													style={{ flexDirection: "row", alignItems: "center" }}
												>
													<Text style={styles.alertDistance}>1.2 km away</Text>
												</View>
											</View>
											<Text style={styles.alertDelay}>+11 min</Text>
										</View>
									</View>

									{/* Destination Shortcuts (Commuting) */}
									<Text style={styles.sectionHeaderTitle}>Commuting</Text>
									<View style={styles.shortcutsGrid}>
										{/* Home */}
										<TouchableOpacity
											style={styles.shortcutCard}
											activeOpacity={0.8}
											onPress={() =>
												setSelectedPlace({
													name: "Home",
													address: "Via Durando 10, Milano, Italia",
													image: require("../../assets/images/background_map.jpg"),
												})
											}
										>
											<View style={styles.iconContainer}>
												<Ionicons
													name="home"
													size={24}
													color={Colors.elmo.accent}
												/>
											</View>
											<View>
												<Text style={styles.shortcutTitle}>Home</Text>
												<Text style={styles.shortcutAddress}>
													Via Durando, 10
												</Text>
											</View>
											<Text style={styles.shortcutDistance}>20 km</Text>
										</TouchableOpacity>

										{/* Work */}
										<TouchableOpacity
											style={styles.shortcutCard}
											activeOpacity={0.8}
											onPress={() =>
												setSelectedPlace({
													name: "Politecnico di Milano",
													address: "Via Candiani 72, Milano, Italia",
													image: require("../../assets/images/bovisa.avif"),
												})
											}
										>
											<View style={styles.iconContainer}>
												<Ionicons
													name="briefcase"
													size={24}
													color={Colors.elmo.accent}
												/>
											</View>
											<View>
												<Text style={styles.shortcutTitle}>Work Place</Text>
												<Text style={styles.shortcutAddress}>
													Piazza Leonardo, 32
												</Text>
											</View>
											<Text style={styles.shortcutDistance}>5 km</Text>
										</TouchableOpacity>
									</View>

									{/* Saved Locations List */}
									<Text style={[styles.sectionHeaderTitle, { marginTop: 24 }]}>
										Saved Locations
									</Text>
									<View style={styles.savedLocationsList}>
										{SAVED_LOCATIONS.map((item) => (
											<TouchableOpacity
												key={item.id}
												style={styles.savedLocationItem}
												onPress={() => setSelectedPlace(item)}
												activeOpacity={0.6}
											>
												{/* Left Icon */}
												<View style={styles.savedIconContainer}>
													<MaterialCommunityIcons
														name={item.icon as any}
														size={24}
														color={Colors.elmo.accent}
													/>
												</View>

												{/* Center Text */}
												<View style={styles.savedTextStack}>
													<Text style={styles.savedLocationName}>
														{item.name}
													</Text>
													<Text style={styles.savedLocationAddress}>
														{item.address}
													</Text>
												</View>

												{/* Right Icon */}
												<Ionicons
													name="chevron-forward"
													size={20}
													color="#555"
												/>
											</TouchableOpacity>
										))}
									</View>

									{/* Bottom Padding for Navigation Bar */}
									<View style={{ height: 100 }} />
								</ScrollView>
							)}
						</View>
					)}
				</BottomSheet>
			</View>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#051616",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(5, 22, 22, 0.2)",
	},
	floatingHeader: {
		position: "absolute",
		left: 0,
		right: 0,
		zIndex: 20,
	},
	searchRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 12,
	},
	searchPill: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#051616",
		borderRadius: 25,
		height: 45,
		paddingLeft: 16,
		paddingRight: 6,
		shadowColor: "#051616",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 6,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.05)",
	},
	searchInput: {
		flex: 1,
		color: "#FFF",
		fontSize: 16,
		marginRight: 10,
	},
	searchIcon: {
		width: 40,
		height: 40,
	},
	categoriesContainer: {
		paddingVertical: 5,
	},
	categoriesContent: {
		paddingHorizontal: 20,
		gap: 10,
	},
	categoryChip: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#27272A",
		borderRadius: 20,
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: "#27272A",
	},
	categoryChipActive: {
		backgroundColor: Colors.elmo.accent, // Mint Green
		borderColor: Colors.elmo.accent,
	},
	categoryText: {
		color: "#FFF",
		fontSize: 14,
		fontWeight: "300",
	},
	categoryTextActive: {
		color: "#000",
		fontWeight: "600",
	},
	// Bottom Sheet Styles
	bottomSheetContent: {
		flex: 1,
		backgroundColor: "#051616",
		paddingHorizontal: 20,
	},
	sheetTitle: {
		color: "#888",
		fontSize: 16,
		fontWeight: "500",
		marginBottom: 16,
		marginTop: 8,
	},
	sectionHeaderTitle: {
		color: "#888",
		fontSize: 16,
		fontWeight: "500",
		marginBottom: 12,
		marginTop: 8,
	},
	listContent: {
		paddingBottom: 120,
	},
	columnWrapper: {
		justifyContent: "space-between",
		gap: 12,
	},
	// Grid Card Styles (Matched to add-stop.tsx)
	gridCard: {
		width: "48%",
		backgroundColor: "#0F1F1F",
		borderRadius: 16,
		marginBottom: 16,
		padding: 10,
	},
	cardImageWrapper: {
		width: "100%",
		aspectRatio: 1, // Square
		borderRadius: 16,
		backgroundColor: "#1A2A2A",
		marginBottom: 10,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
	},
	cardImage: {
		width: "100%",
		height: "100%",
	},
	ratingBadge: {
		position: "absolute",
		top: 8,
		right: 8,
		backgroundColor: "rgba(0,0,0,0.6)",
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 8,
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
	},
	ratingText: {
		color: "#FFF",
		fontSize: 10,
		fontWeight: "bold",
	},
	cardName: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 4,
	},
	cardDetails: {
		color: "#889999",
		fontSize: 13,
		marginBottom: 12,
	},
	addStopPill: {
		backgroundColor: Colors.elmo.accent,
		borderRadius: 20,
		paddingVertical: 8,
		paddingHorizontal: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
	},
	addStopText: {
		color: "#000",
		fontSize: 13,
		fontWeight: "600",
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
		paddingVertical: 10,
		position: "relative",
		marginBottom: 8,
	},
	logo: {
		width: 100,
		height: 40,
	},
	profileAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.elmo.accent,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		right: 20,
	},
	// Home Sheet Content
	homeSheetContent: {
		paddingBottom: 20,
		paddingTop: 10,
	},
	cursorContainer: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOpacity: 0.5,
		borderRadius: 40,
		backgroundColor: "#042f2e",
		borderWidth: 2,
		borderColor: "#5EEAD4",
		paddingTop: 6,
		shadowRadius: 8,
		elevation: 8,
	},
	lightCard: {
		backgroundColor: "#0F1F1F",
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		borderWidth: 0.5,
		borderColor: Colors.elmo.accent,
	},
	cardHeaderTitle: {
		color: "#FFF",
		fontSize: 18,
		fontWeight: "600",
	},
	trafficRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 8,
	},
	alertIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#EF4444", // Red
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	trafficInfo: {
		flex: 1,
	},
	alertTitle: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "600",
	},
	alertDistance: {
		color: "#AAAAAA",
		fontSize: 14,
	},
	alertDelay: {
		color: "#EF4444",
		fontSize: 15,
		fontWeight: "600",
		marginLeft: 8,
	},
	shortcutsGrid: {
		flexDirection: "row",
		gap: 12,
	},
	shortcutCard: {
		flex: 1,
		backgroundColor: "#0F1F1F",
		borderRadius: 16,
		padding: 16,
		justifyContent: "space-between",
		minHeight: 100,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.2)",
	},
	shortcutTitle: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 4,
	},
	shortcutAddress: {
		color: "#AAAAAA",
		fontSize: 14,
	},
	shortcutDistance: {
		color: "#AAAAAA", // Or maybe accent color if we want to highlight it
		fontSize: 14,
		fontWeight: "500",
		marginTop: 12,
	},
	// Detail View Styles
	detailHeader: {
		height: 200,
		marginBottom: 0,
		position: "relative",
	},
	backButtonOverlay: {
		position: "absolute",
		top: 16,
		left: 16,
		zIndex: 10,
		backgroundColor: "#27272A",
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
		// shadow for consistency
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 5,
	},
	detailImage: {
		width: "100%",
		height: "100%",
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
	},
	detailName: {
		color: "#FFF",
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 4,
	},
	detailAddress: {
		color: "#888",
		fontSize: 14,
		marginBottom: 20,
	},
	badgesWrapper: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 30,
		// justifyContent: 'space-between', // Removed for pills
	},
	preferenceBadge: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		gap: 8,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.2)",
		backgroundColor: "#000",
	},
	preferenceBadgeActive: {
		backgroundColor: "rgba(64, 224, 208, 0.1)", // Subtle mint tint
		borderColor: Colors.elmo.accent,
	},
	preferenceText: {
		color: "#FFF",
		fontSize: 14,
		fontWeight: "500",
	},
	preferenceTextActive: {
		color: Colors.elmo.accent,
		fontSize: 14,
		fontWeight: "600",
	},
	badge: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 20,
		gap: 6,
	},
	badgeFast: {
		backgroundColor: "#000", // Black as requested (dark capsule)
		borderWidth: 0.5,
		borderColor: Colors.elmo.accent, // Mint,
	},
	badgeEconomic: {
		backgroundColor: "#000", // Black as requested (dark capsule)
		borderWidth: 0.5,
	},
	badgeText: {
		fontSize: 13,
		fontWeight: "500",
	},
	startNavButton: {
		backgroundColor: Colors.elmo.accent,
		borderRadius: 30,
		paddingVertical: 16,
		flexDirection: "row", // Align icon and text
		justifyContent: "center",
		alignItems: "center",
		marginTop: "auto",
	},
	startNavText: {
		color: "#000",
		fontSize: 18,
		fontWeight: "bold",
	},
	// Saved Locations Styles
	savedLocationsList: {
		marginTop: 0,
	},
	savedLocationItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255,255,255,0.05)",
	},
	savedIconContainer: {
		marginRight: 16,
		// No background as requested, just icon
	},
	savedTextStack: {
		flex: 1,
	},
	savedLocationName: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "500",
	},
	savedLocationAddress: {
		color: "#A0A0A0", // Grey as requested
		fontSize: 13,
		marginTop: 2,
	},
	iconContainer: {
		marginBottom: 12,
	},
});
