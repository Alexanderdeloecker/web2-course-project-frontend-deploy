const API_BASE_URL = "https://wall-of-fame-api.onrender.com";

export async function getWins() {
	const response = await fetch(`${API_BASE_URL}/api/wins`);
	if (!response.ok) {
		throw new Error("Failed to fetch wins");
	}
	return response.json();
}

export async function addWin(win, token) {
	const response = await fetch(
		"https://wall-of-fame-api.onrender.com/api/wins",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(win),
		}
	);

	if (!response.ok) {
		const err = await response.json();
		throw new Error(err.error || "Failed to add win");
	}

	return response.json();
}
