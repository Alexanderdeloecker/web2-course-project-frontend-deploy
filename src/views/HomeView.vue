<script setup>
import { ref, onMounted, computed } from "vue";
import { getWins } from "../api/api";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =====================
   STATE
===================== */
const wins = ref([]);
const loading = ref(true);
const error = ref(null);
const activeCategory = ref("All");

/* =====================
   FETCH
===================== */
onMounted(async () => {
	try {
		const data = await getWins();
		wins.value = Array.isArray(data) ? data : [];
	} catch (err) {
		error.value = err?.message || "Failed to load wins";
	} finally {
		loading.value = false;

		// animations pas starten NA render
		requestAnimationFrame(() => {
			setupGSAP();
		});
	}
});

/* =====================
   HELPERS
===================== */
function toDateValue(win) {
	return win?.createdAt ? new Date(win.createdAt).getTime() : 0;
}

function safeText(v, fallback = "") {
	return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

/* =====================
   COMPUTED
===================== */
const newestWins = computed(() =>
	[...wins.value].sort((a, b) => toDateValue(b) - toDateValue(a))
);

const categories = computed(() => {
	const set = new Set();
	for (const w of wins.value) set.add(w.category || "Other");
	return ["All", ...Array.from(set)];
});

const filteredWins = computed(() => {
	if (activeCategory.value === "All") return newestWins.value;
	return newestWins.value.filter(
		(w) => (w.category || "Other") === activeCategory.value
	);
});

const featuredWin = computed(() => newestWins.value[0] || null);

const gridWins = computed(() => {
	if (!featuredWin.value) return filteredWins.value;
	return filteredWins.value.filter((w) => w._id !== featuredWin.value._id);
});

/* =====================
   GSAP CINEMATIC SCROLL
===================== */
function setupGSAP() {
	/* HERO PARALLAX */
	gsap.to(".hero-media", {
		yPercent: 20,
		ease: "none",
		scrollTrigger: {
			trigger: ".hero",
			start: "top top",
			end: "bottom top",
			scrub: true,
		},
	});

	/* HERO TEXT IN */
	gsap.from(".hero-inner > *", {
		y: 80,
		opacity: 0,
		duration: 1,
		stagger: 0.15,
		ease: "power3.out",
		scrollTrigger: {
			trigger: ".hero",
			start: "top 70%",
		},
	});

	/* FEATURED REVEAL */
	gsap.from(".featured", {
		scale: 0.95,
		opacity: 0,
		duration: 1,
		ease: "power3.out",
		scrollTrigger: {
			trigger: ".featured",
			start: "top 75%",
		},
	});

	/* FILTER BAR SLIDE */
	gsap.from(".filters", {
		x: 60,
		opacity: 0,
		duration: 0.8,
		ease: "power3.out",
		scrollTrigger: {
			trigger: ".filters",
			start: "top 80%",
		},
	});

	/* MASONRY STAGGER */
	gsap.from(".card", {
		y: 60,
		opacity: 0,
		stagger: 0.06,
		duration: 0.9,
		ease: "power3.out",
		scrollTrigger: {
			trigger: ".masonry",
			start: "top 75%",
		},
	});
}
</script>

<template>
	<section class="home">
		<!-- HERO -->
		<header class="hero">
			<div class="hero-media"></div>

			<div class="hero-inner">
				<p class="hero-kicker">WALL OF FAME</p>
				<h1 class="hero-title">Achievements beyond the classroom.</h1>
				<p class="hero-subtitle">
					A curated wall where students showcase real skills, wins and passions.
				</p>
			</div>
		</header>

		<main class="container">
			<!-- LOADING -->
			<section v-if="loading" class="block">
				<div class="notice">
					<p class="notice-title">Loading wins…</p>
				</div>
			</section>

			<!-- ERROR -->
			<section v-else-if="error" class="block">
				<div class="notice notice-error">
					<p class="notice-title">{{ error }}</p>
				</div>
			</section>

			<!-- FEATURED -->
			<section v-else class="block">
				<div class="section-head">
					<h2 class="section-title">Featured win</h2>
				</div>

				<div v-if="featuredWin" class="featured">
					<div class="featured-label">FEATURED</div>

					<h3 class="featured-title">
						{{ safeText(featuredWin.title, "Untitled win") }}
					</h3>

					<p class="featured-text">
						{{ safeText(featuredWin.description, "No description provided.") }}
					</p>
				</div>
			</section>

			<!-- GRID -->
			<section class="block">
				<div class="section-head section-head-row">
					<h2 class="section-title">Newest wins</h2>

					<div class="filters">
						<button
							v-for="cat in categories"
							:key="cat"
							class="filter"
							:class="{ active: activeCategory === cat }"
							@click="activeCategory = cat"
						>
							{{ cat }}
						</button>
					</div>
				</div>

				<div class="masonry">
					<article v-for="win in gridWins" :key="win._id" class="card">
						<h3 class="card-title">
							{{ safeText(win.title, "Untitled win") }}
						</h3>
						<p class="card-text">
							{{ safeText(win.description, "No description provided.") }}
						</p>
					</article>
				</div>
			</section>
		</main>
	</section>
</template>
