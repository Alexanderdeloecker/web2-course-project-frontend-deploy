<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { getWins } from "../api/api";
import WinCard from "../components/WinCard.vue";
import { searchQuery } from "../api/search";

const route = useRoute();

const wins = ref([]);
const loading = ref(true);

const q = computed(() => String(route.query.q || "").trim());

function normalize(s) {
	return String(s || "").toLowerCase();
}

const results = computed(() => {
	const query = normalize(q.value);
	if (!query) return [];

	return wins.value.filter((w) => {
		const hay =
			normalize(w.title) +
			" " +
			normalize(w.description) +
			" " +
			normalize(w.category);
		return hay.includes(query);
	});
});

async function load() {
	loading.value = true;
	try {
		const data = await getWins();
		wins.value = Array.isArray(data) ? data : [];
	} finally {
		loading.value = false;
	}
}

onMounted(async () => {
	searchQuery.value = q.value;
	await load();
});

watch(
	() => route.query.q,
	(n) => {
		searchQuery.value = String(n || "");
	}
);
</script>

<template>
	<main class="search-page">
		<!-- HERO -->
		<section class="search-hero">
			<div class="container">
				<h1 class="title">Search</h1>

				<p class="subtitle" v-if="q">
					Results for
					<span class="query">“{{ q }}”</span>
					<span class="count" v-if="!loading">
						{{ results.length }} result{{ results.length === 1 ? "" : "s" }}
					</span>
				</p>

				<p class="subtitle muted" v-else>
					Type a keyword and press enter to explore the Wall of Fame.
				</p>
			</div>
		</section>

		<!-- RESULTS -->
		<section class="results">
			<div class="container">
				<!-- LOADING -->
				<div v-if="loading" class="loading">
					<div class="skeleton"></div>
					<div class="skeleton"></div>
					<div class="skeleton"></div>
				</div>

				<!-- GRID -->
				<div v-else-if="q && results.length" class="grid">
					<WinCard v-for="w in results" :key="w._id" :win="w" />
				</div>

				<!-- EMPTY -->
				<div v-else class="empty">
					<div class="empty-card">
						<h2>
							{{ q ? "No matching wins" : "Nothing searched yet" }}
						</h2>
						<p>
							{{
								q
									? "Try a different keyword or browse the Wall of Fame."
									: "Use the search bar above to discover achievements."
							}}
						</p>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>
