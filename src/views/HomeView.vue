<script setup>
import { ref, onMounted, computed, nextTick, onBeforeUnmount } from "vue";
import { getWins } from "../api/api";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import WinCard from "../components/WinCard.vue";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- STATE ---------------- */
const wins = ref([]);
const loading = ref(true);

/* ---------------- DATA ---------------- */
const newestWins = computed(() =>
	[...wins.value].sort(
		(a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
	)
);

const featuredWin = computed(() => newestWins.value[0] || null);

/* ---------------- HELPERS ---------------- */
function safeText(v, fallback = "") {
	if (typeof v === "string" && v.trim()) return v.trim();
	return fallback;
}

/**
 * Cloudinary optimalisatie via URL-transformatie
 */
function cdn(url, preset = "card") {
	if (!url || typeof url !== "string") return "";

	if (!url.includes("res.cloudinary.com") || !url.includes("/upload/"))
		return url;

	const t =
		preset === "featured"
			? "f_auto,q_auto,w_1400,h_900,c_fill,g_auto"
			: "f_auto,q_auto,w_900,h_600,c_fill,g_auto";

	return url.replace("/upload/", `/upload/${t}/`);
}

/* ---------------- FETCH ---------------- */
onMounted(async () => {
	try {
		const data = await getWins();
		wins.value = Array.isArray(data) ? data : [];
	} finally {
		loading.value = false;
	}

	await nextTick();
	initScrollStory();
});

/* ---------------- CLEANUP ---------------- */
onBeforeUnmount(() => {
	ScrollTrigger.getAll().forEach((t) => t.kill());
	gsap.globalTimeline.clear();
});

/* ---------------- GSAP STORY ---------------- */
function initScrollStory() {
	ScrollTrigger.getAll().forEach((t) => t.kill());

	/* ACT 1 — HERO */
	if (document.querySelector(".scene-hero")) {
		gsap
			.timeline({
				scrollTrigger: {
					trigger: ".scene-hero",
					start: "top top",
					end: "bottom top",
					scrub: true,
					pin: true,
				},
			})
			.from(".hero-title", { opacity: 0, y: 80 })
			.from(".hero-subtitle", { opacity: 0, y: 40 }, "-=0.3")
			.to(".hero-inner", { scale: 0.92, opacity: 0.35 });
	}

	/* ACT 2 — MEANING */
	gsap.utils.toArray(".meaning-line").forEach((line) => {
		gsap.fromTo(
			line,
			{ opacity: 0, y: 60 },
			{
				opacity: 1,
				y: 0,
				scrollTrigger: {
					trigger: line,
					start: "top 75%",
					end: "top 40%",
					scrub: true,
				},
			}
		);
	});

	/* ACT 3 — FEATURED */
	if (document.querySelector(".featured-card")) {
		gsap.from(".featured-card", {
			scale: 0.9,
			opacity: 0,
			y: 120,
			scrollTrigger: {
				trigger: ".scene-featured",
				start: "top 70%",
				end: "top 30%",
				scrub: true,
			},
		});
	}

	/* ACT 4 — GRID */
	const cards = gsap.utils.toArray(".win-card");
	if (cards.length) {
		gsap.from(cards, {
			opacity: 0,
			y: 60,
			stagger: 0.08,
			scrollTrigger: {
				trigger: ".scene-grid",
				start: "top 70%",
			},
		});
	}
}
</script>

<template>
	<section class="home">
		<!-- ACT 1: HERO -->
		<section class="scene scene-hero">
			<div class="hero-bg" aria-hidden="true"></div>
			<div class="hero-inner">
				<p class="hero-kicker">WALL OF FAME</p>
				<h1 class="hero-title">Achievements beyond the classroom</h1>
				<p class="hero-subtitle">
					A living archive of real skills, passions and wins.
				</p>
				<span class="scroll-hint">Scroll ↓</span>
			</div>
		</section>

		<!-- ACT 2: MEANING -->
		<section class="scene scene-meaning">
			<p class="meaning-line">Not just grades.</p>
			<p class="meaning-line">Not just school.</p>
			<p class="meaning-line strong">Real skills. Real wins.</p>
		</section>

		<!-- ACT 3: FEATURED -->
		<section class="scene scene-featured" v-if="featuredWin">
			<div class="featured-card">
				<div class="featured-media">
					<img :src="cdn(featuredWin.imageUrl, 'featured')" alt="" />
				</div>

				<div class="featured-body">
					<span class="badge">FEATURED</span>
					<h2 class="featured-title">
						{{ safeText(featuredWin.title, "Untitled win") }}
					</h2>
					<p class="featured-text">
						{{ safeText(featuredWin.description, "No description provided.") }}
					</p>
					<span class="category">{{ featuredWin.category || "general" }}</span>
				</div>
			</div>
		</section>

		<!-- ACT 4: GRID -->
		<section class="scene scene-grid">
			<h2 class="grid-title">Latest wins</h2>

			<div v-if="loading" class="loading">Loading…</div>

			<div v-else class="grid">
				<WinCard
					v-for="win in newestWins"
					:key="win._id"
					:win="{
						...win,
						imageUrl: cdn(win.imageUrl, 'card'),
					}"
					class="win-card"
				/>
			</div>
		</section>

		<!-- ACT 5: CTA -->
		<section class="scene scene-cta">
			<h2>Your story belongs here.</h2>
			<p>Add your achievement to the Wall of Fame.</p>
			<router-link to="/add-win" class="cta-btn"> Add your win → </router-link>
		</section>
	</section>
</template>

<style scoped>
/* BASE */
.home {
	font-family: system-ui, sans-serif;
	color: #111;
}

/* SCENES */
.scene {
	min-height: 100vh;
	padding: 120px 8vw;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}

/* HERO */
.scene-hero {
	position: relative;
	padding: 0;
}

.hero-bg {
	position: absolute;
	inset: 0;
	background: url("/img_Homevieuw.png") center / cover no-repeat;
	filter: brightness(0.75);
}

.hero-inner {
	position: relative;
	z-index: 2;
	max-width: 900px;
	text-align: center;
	color: white;
	padding: 0 24px;
}

.hero-kicker {
	letter-spacing: 0.2em;
	opacity: 0.7;
}

.hero-title {
	font-size: clamp(3rem, 6vw, 5rem);
	margin: 20px 0;
}

.hero-subtitle {
	font-size: 1.2rem;
	opacity: 0.9;
}

.scroll-hint {
	margin-top: 80px;
	opacity: 0.6;
}

/* MEANING */
.scene-meaning {
	background: #fafafa;
	text-align: center;
}

.meaning-line {
	font-size: clamp(2rem, 4vw, 3.2rem);
	margin: 80px 0;
	opacity: 0.2;
}

.meaning-line.strong {
	font-weight: 600;
	opacity: 1;
}

/* FEATURED */
.scene-featured {
	background: #fff;
}

.featured-card {
	width: min(980px, 100%);
	border: 1px solid #ddd;
	box-shadow: 0 40px 120px rgba(0, 0, 0, 0.08);
	border-radius: 18px;
	overflow: hidden;
	background: white;
}

.featured-media {
	height: 420px;
}

.featured-media img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.featured-body {
	padding: 42px;
}

.badge {
	font-size: 0.8rem;
	letter-spacing: 0.1em;
	color: #666;
}

.featured-title {
	margin: 14px 0 10px;
	font-size: 2rem;
}

.featured-text {
	color: #444;
	line-height: 1.6;
}

.category {
	margin-top: 14px;
	color: #888;
}

/* GRID */
.scene-grid {
	background: #f5f5f5;
}

.grid-title {
	font-size: 2.4rem;
	margin-bottom: 60px;
}

.grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 32px;
	width: 100%;
	max-width: 1200px;
}

/* CTA */
.scene-cta {
	background: #111;
	color: white;
	text-align: center;
}

.cta-btn {
	margin-top: 32px;
	display: inline-block;
	padding: 14px 32px;
	border: 1px solid white;
	color: white;
	text-decoration: none;
	border-radius: 999px;
}
</style>
