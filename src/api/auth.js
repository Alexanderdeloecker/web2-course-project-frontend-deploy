// src/api/auth.js
import { ref, computed } from "vue";

const TOKEN_KEY = "token";

export const token = ref(localStorage.getItem(TOKEN_KEY) || "");

export const isLoggedIn = computed(() => !!token.value);

export function setToken(newToken) {
	token.value = newToken;
	localStorage.setItem(TOKEN_KEY, newToken);
}

export function clearToken() {
	token.value = "";
	localStorage.removeItem(TOKEN_KEY);
}

// 👉 DIT ONTBRAK
export function getToken() {
	return token.value;
}
