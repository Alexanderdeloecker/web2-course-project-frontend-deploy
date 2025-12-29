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
