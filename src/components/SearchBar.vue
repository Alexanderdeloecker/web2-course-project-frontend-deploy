<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { searchQuery } from "../api/search";

const router = useRouter();
const route = useRoute();

const trimmed = computed(() => (searchQuery.value || "").trim());

function goSearch() {
	const q = trimmed.value;

	// leeg? -> naar / (of blijf waar je bent)
	if (!q) {
		searchQuery.value = "";
		if (route.name === "search") router.push({ name: "home" });
		return;
	}

	// altijd naar results pagina
	router.push({ name: "search", query: { q } });
}

function onKeydown(e) {
	if (e.key === "Enter") {
		e.preventDefault();
		goSearch();
	}
}
</script>

<template>
	<div class="search-wrap" role="search">
		<div class="outer-glow"></div>

		<input
			v-model="searchQuery"
			class="search-input"
			type="text"
			placeholder="Search wins…"
			@keydown="onKeydown"
		/>

		<button
			class="search-btn"
			type="button"
			@click="goSearch"
			aria-label="Search"
		>
			⌕
		</button>
	</div>
</template>

<style scoped>
.search-wrap {
	position: relative;
	width: 360px;
}

.search-input {
	width: 100%;
	padding: 14px 48px 14px 18px;
	border-radius: 16px;
	background: rgba(0, 0, 0, 0.55);
	border: 1px solid rgba(255, 255, 255, 0.16);
	color: #fff;
	font-size: 15px;
	outline: none;
	backdrop-filter: blur(14px);
	position: relative;
	z-index: 2;
	box-shadow: 0 14px 60px rgba(0, 0, 0, 0.35);
}

.search-input::placeholder {
	color: rgba(255, 255, 255, 0.55);
}

.search-input:focus {
	border-color: rgba(255, 255, 255, 0.26);
}

.search-btn {
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
	width: 36px;
	height: 36px;
	border-radius: 999px;
	display: grid;
	place-items: center;
	border: 1px solid rgba(255, 255, 255, 0.16);
	background: rgba(255, 255, 255, 0.08);
	color: rgba(255, 255, 255, 0.92);
	cursor: pointer;
	z-index: 3;
	transition: transform 180ms ease, background 180ms ease,
		border-color 180ms ease;
}

.search-btn:hover {
	transform: translateY(-50%) translateY(-1px);
	background: rgba(255, 255, 255, 0.12);
	border-color: rgba(255, 255, 255, 0.22);
}

/* Glow ring */
.outer-glow {
	position: absolute;
	inset: -10px;
	border-radius: 22px;
	filter: blur(28px);
	opacity: 0.55;
	z-index: 1;
	background: conic-gradient(
		from 60deg at 50% 50%,
		transparent 0deg,
		rgba(160, 80, 255, 0.55) 120deg,
		transparent 220deg,
		rgba(80, 160, 255, 0.55) 300deg,
		transparent 360deg
	);
	animation: spin 7s linear infinite;
}

.search-wrap:focus-within .outer-glow {
	opacity: 0.85;
	filter: blur(32px);
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

@media (max-width: 520px) {
	.search-wrap {
		width: 240px;
	}
}
</style>
