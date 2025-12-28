// src/api/api.js
import { getToken } from "./auth";

const API_BASE_URL = "https://wall-of-fame-api.onrender.com";

/* ---------- PUBLIC ---------- */
export async function getWins() {
	const res = await fetch(`${API_BASE_URL}/api/wins`);
	if (!res.ok) throw new Error("Failed to fetch wins");
	return res.json();
}

/* ---------- PRIVATE (PROFILE) ---------- */
export async function getMyWins() {
	const token = getToken();
	if (!token) throw new Error("Not logged in");

	const res = await fetch(`${API_BASE_URL}/api/wins/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) throw new Error("Failed to fetch user wins");
	return res.json();
}

/* ---------- MUTATIONS ---------- */
export async function addWin(formData) {
	const token = getToken();
	if (!token) throw new Error("Not logged in");

	const res = await fetch(`${API_BASE_URL}/api/wins`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData, // ⬅️ FormData, GEEN JSON
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Something went wrong");

	return data;
}

/* ---------- AUTH ---------- */
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

export async function register(email, password, name) {
	const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password, name }),
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Registration failed");

	return data;
}
