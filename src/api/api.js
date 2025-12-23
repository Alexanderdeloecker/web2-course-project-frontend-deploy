import { token } from "./auth";

const API_BASE_URL = "https://wall-of-fame-api.onrender.com";

export async function getWins() {
	const res = await fetch(`${API_BASE_URL}/api/wins`);
	if (!res.ok) throw new Error("Failed to fetch wins");
	return res.json();
}

export async function addWin(win) {
	const res = await fetch(`${API_BASE_URL}/api/wins`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token.value}`,
		},
		body: JSON.stringify(win),
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Something went wrong");

	return data;
}

export async function login(email, password) {
	const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Login failed");

	return data;
}

export async function register(email, password) {
	const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Registration failed");

	return data;
}
