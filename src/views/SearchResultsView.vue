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

<style scoped>
/* PAGE BASE — LICHT */
.search-page {
	min-height: calc(100vh - 64px);
	background: radial-gradient(
			1200px 600px at 50% -10%,
			rgba(120, 140, 255, 0.22),
			transparent 60%
		),
		#f4f5f8;
	color: #111;
}

/* HERO */
.search-hero {
	padding: 64px 0 28px;
}

.container {
	width: min(1100px, calc(100% - 48px));
	margin: 0 auto;
}

.title {
	margin: 0;
	font-size: clamp(42px, 5vw, 64px);
	letter-spacing: -0.04em;
	line-height: 0.95;
	color: #111;
}

.subtitle {
	margin-top: 14px;
	font-size: 16px;
	color: #333;
	display: flex;
	align-items: center;
	gap: 10px;
	flex-wrap: wrap;
}

.subtitle.muted {
	color: #666;
}

/* QUERY PILL */
.query {
	padding: 6px 12px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.7);
	border: 1px solid rgba(0, 0, 0, 0.08);
	backdrop-filter: blur(10px);
	font-weight: 500;
	color: #111;
}

.count {
	font-size: 13px;
	color: #555;
}

/* RESULTS */
.results {
	padding: 32px 0 80px;
}

/* GRID */
.grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 18px;
}

@media (max-width: 980px) {
	.grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 560px) {
	.container {
		width: min(1100px, calc(100% - 28px));
	}
	.grid {
		grid-template-columns: 1fr;
	}
}

/* LOADING */
.loading {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 18px;
}

.skeleton {
	height: 240px;
	border-radius: 22px;
	background: rgba(255, 255, 255, 0.85);
	border: 1px solid rgba(0, 0, 0, 0.08);
}

/* EMPTY STATE */
.empty {
	display: grid;
	place-items: center;
	padding: 48px 0;
}

.empty-card {
	max-width: 420px;
	text-align: center;
	border-radius: 28px;
	padding: 28px;
	background: rgba(255, 255, 255, 0.8);
	border: 1px solid rgba(0, 0, 0, 0.08);
	backdrop-filter: blur(14px);
	box-shadow: 0 30px 120px rgba(0, 0, 0, 0.15);
	color: #111;
}

.empty-card h2 {
	margin: 0;
	font-size: 22px;
	letter-spacing: -0.02em;
}

.empty-card p {
	margin-top: 12px;
	color: #555;
	line-height: 1.6;
}
</style>
