import { ref, computed } from "vue";

export const token = ref(localStorage.getItem("token") || "");

export const isLoggedIn = computed(() => !!token.value);

export function setToken(newToken) {
	token.value = newToken;
	localStorage.setItem("token", newToken);
}

export function clearToken() {
	token.value = "";
	localStorage.removeItem("token");
}
