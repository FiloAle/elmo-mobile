export const SERVER_URL = "http://172.20.10.6:3001";

export async function fetchServerState() {
	try {
		const response = await fetch(`${SERVER_URL}/health`);
		if (!response.ok) {
			console.warn("Failed to fetch server health:", response.status);
			return null;
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.warn("Error fetching server state:", error);
		return null;
	}
}

export async function sendStopRequest(place: any, carId: string = "car1-rear") {
	try {
		const response = await fetch(`${SERVER_URL}/convoy/send`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				type: "request_add_waypoint",
				deviceRole: carId,
				timestamp: Date.now(),
				data: {
					name: place.name,
					latitude: Number(place.latitude),
					longitude: Number(place.longitude),
					id: place.id,
				},
			}),
		});
		return response.ok;
	} catch (error) {
		console.error("Error sending stop request:", error);
		return false;
	}
}
