const API_BASE_URL = "https://wall-of-fame-api.onrender.com";

export async function getWins() {
	const response = await fetch(`${API_BASE_URL}/api/wins`);
	if (!response.ok) {
		throw new Error("Failed to fetch wins");
	}
	return response.json();
}
