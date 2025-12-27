<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import { getWins } from "../api/api";
import WinCard from "../components/WinCard.vue";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/* ---------------- STATE ---------------- */
const wins = ref([]);
const loading = ref(true);

const newestWins = computed(() =>
	[...wins.value].sort(
		(a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
	)
);

const featuredWin = computed(() => newestWins.value[0] || null);
const gridWins = computed(() => newestWins.value.slice(0, 24));

/* ---------------- GSAP CLEANUP ---------------- */
function killScroll() {
	ScrollTrigger.getAll().forEach((t) => t.kill());
	gsap.killTweensOf("*");
}

/* ---------------- GSAP INIT ---------------- */
async function initScrollStory() {
	await nextTick();

	killScroll();

	// Respect "reduced motion"
	const reduce =
		window.matchMedia &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	if (reduce) return;

	/* ========== ACT 1 — HERO (pinned depth) ========== */
	const heroTl = gsap.timeline({
		scrollTrigger: {
			trigger: ".scene-hero",
			start: "top top",
			end: "bottom top",
			scrub: true,
			pin: ".hero-pin",
			pinSpacing: true,
		},
	});

	heroTl
		.fromTo(
			".hero-title",
			{ y: 40, opacity: 0, filter: "blur(10px)" },
			{ y: 0, opacity: 1, filter: "blur(0px)", duration: 0.6 },
			0
		)
		.fromTo(
			".hero-subtitle",
			{ y: 24, opacity: 0, filter: "blur(8px)" },
			{ y: 0, opacity: 1, filter: "blur(0px)", duration: 0.6 },
			0.08
		)
		.fromTo(
			".hero-glass",
			{ y: 30, opacity: 0, filter: "blur(12px)" },
			{ y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7 },
			0.12
		)
		// Depth: orbs drift slower than foreground
		.to(".orb-a", { y: -80, x: 40, scale: 1.12, ease: "none" }, 0)
		.to(".orb-b", { y: -140, x: -30, scale: 1.18, ease: "none" }, 0)
		.to(".orb-c", { y: -110, x: 20, scale: 1.14, ease: "none" }, 0)
		// Foreground subtle push-in
		.to(
			".hero-pin",
			{ scale: 1.02, transformOrigin: "50% 50%", ease: "none" },
			0
		)
		// Fade out hero copy near end
		.to(
			".hero-copy",
			{ opacity: 0, y: -20, filter: "blur(10px)", ease: "none" },
			0.65
		);

	/* ========== ACT 2 — MEANING (progressive reveal) ========== */
	gsap.utils.toArray(".reveal").forEach((el) => {
		gsap.fromTo(
			el,
			{ y: 24, opacity: 0, filter: "blur(10px)" },
			{
				y: 0,
				opacity: 1,
				filter: "blur(0px)",
				duration: 0.7,
				ease: "power2.out",
				scrollTrigger: {
					trigger: el,
					start: "top 80%",
					end: "top 55%",
					toggleActions: "play none none reverse",
				},
			}
		);
	});

	/* ========== ACT 3 — FEATURED (image depth + text stagger) ========== */
	gsap.fromTo(
		".featured-card",
		{ y: 40, opacity: 0, filter: "blur(12px)" },
		{
			y: 0,
			opacity: 1,
			filter: "blur(0px)",
			duration: 0.9,
			ease: "power2.out",
			scrollTrigger: {
				trigger: ".scene-featured",
				start: "top 75%",
				toggleActions: "play none none reverse",
			},
		}
	);

	gsap.fromTo(
		".featured-media",
		{ scale: 1.06 },
		{
			scale: 1,
			ease: "none",
			scrollTrigger: {
				trigger: ".scene-featured",
				start: "top 75%",
				end: "bottom 20%",
				scrub: true,
			},
		}
	);

	/* ========== ACT 4 — GRID (stagger + slight parallax per card) ========== */
	const cards = gsap.utils.toArray(".win-card");
	gsap.fromTo(
		cards,
		{ y: 22, opacity: 0, filter: "blur(10px)" },
		{
			y: 0,
			opacity: 1,
			filter: "blur(0px)",
			duration: 0.7,
			ease: "power2.out",
			stagger: 0.04,
			scrollTrigger: {
				trigger: ".scene-grid",
				start: "top 75%",
				toggleActions: "play none none reverse",
			},
		}
	);

	// Micro depth while scrolling: small y-shift based on each card index
	cards.forEach((card, i) => {
		const amt = (i % 6) * 6 + 6; // deterministic, not random
		gsap.fromTo(
			card,
			{ y: 0 },
			{
				y: -amt,
				ease: "none",
				scrollTrigger: {
					trigger: card,
					start: "top bottom",
					end: "bottom top",
					scrub: true,
				},
			}
		);
	});

	ScrollTrigger.refresh();
}

/* ---------------- FETCH ---------------- */
onMounted(async () => {
	try {
		const data = await getWins();
		wins.value = Array.isArray(data) ? data : [];
	} finally {
		loading.value = false;
		await initScrollStory();
	}
});

onBeforeUnmount(() => {
	killScroll();
});
</script>

<template>
	<main class="home">
		<!-- ACT 1 — HERO -->
		<section class="scene-hero">
			<div class="hero-pin">
				<div class="hero-bg">
					<div class="orb orb-a"></div>
					<div class="orb orb-b"></div>
					<div class="orb orb-c"></div>
					<div class="grain"></div>
				</div>

				<div class="container hero-content">
					<div class="hero-copy">
						<h1 class="hero-title">Wall of Fame</h1>
						<p class="hero-subtitle">
							Achievements buiten het curriculum. Echt, menselijk, en het mag
							gezien worden.
						</p>

						<div class="hero-glass">
							<div class="hero-kpi">
								<div class="kpi">
									<div class="kpi-num">{{ loading ? "—" : wins.length }}</div>
									<div class="kpi-label">wins</div>
								</div>
								<div class="kpi">
									<div class="kpi-num">
										{{ loading ? "—" : featuredWin?.category || "—" }}
									</div>
									<div class="kpi-label">featured</div>
								</div>
								<div class="kpi">
									<div class="kpi-num">MCT</div>
									<div class="kpi-label">community</div>
								</div>
							</div>

							<div class="hero-hint">
								<span class="dot"></span>
								Scroll voor de story
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- ACT 2 — MEANING -->
		<section class="scene-meaning">
			<div class="container">
				<div class="meaning-grid">
					<div class="meaning-block reveal">
						<h2 class="section-title">Niet alleen projecten tellen.</h2>
						<p class="section-text">
							Sport, muziek, vrijwilligerswerk, ondernemen, tech, creatie… dit
							is waar karakter en discipline zichtbaar wordt.
						</p>
					</div>

					<div class="meaning-block reveal">
						<h3 class="section-subtitle">Editorial, maar met energie.</h3>
						<p class="section-text">
							Grote typografie, veel ruimte, en motion die je door de pagina
							“trekt” — zonder carousels, zonder drukte.
						</p>
					</div>

					<div class="meaning-block reveal">
						<h3 class="section-subtitle">Elke win = een verhaal.</h3>
						<p class="section-text">
							Je hoeft geen “perfect profiel” te hebben. Het gaat om groei,
							effort, en dingen die je trots maken.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- ACT 3 — FEATURED -->
		<section class="scene-featured" v-if="featuredWin">
			<div class="container">
				<div class="featured-card">
					<div class="featured-media">
						<img
							class="featured-img"
							:src="featuredWin.imageUrl"
							:alt="featuredWin.title"
							loading="lazy"
						/>
					</div>

					<div class="featured-copy">
						<div class="badge">Featured</div>
						<h2 class="featured-title">{{ featuredWin.title }}</h2>
						<p class="featured-desc">{{ featuredWin.description }}</p>

						<div class="meta">
							<span class="pill">{{ featuredWin.category }}</span>
							<span class="pill" v-if="featuredWin.createdAt">
								{{ new Date(featuredWin.createdAt).toLocaleDateString() }}
							</span>
						</div>

						<router-link class="cta" to="/add">Add a win</router-link>
					</div>
				</div>
			</div>
		</section>

		<!-- ACT 4 — GRID -->
		<section class="scene-grid">
			<div class="container">
				<div class="grid-head reveal">
					<h2 class="section-title">Latest wins</h2>
					<p class="section-text">
						Een selectie van de nieuwste posts. Scroll, ontdek, voel de vibe.
					</p>
				</div>

				<div class="masonry" v-if="!loading">
					<WinCard
						v-for="w in gridWins"
						:key="w._id"
						:win="w"
						class="win-card"
					/>
				</div>

				<div class="loading" v-else>
					<div class="skeleton"></div>
					<div class="skeleton"></div>
					<div class="skeleton"></div>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="scene-cta">
			<div class="container">
				<div class="cta-card reveal">
					<h2 class="section-title">Drop jouw win.</h2>
					<p class="section-text">
						Maak het zichtbaar. Eén foto, één zin, één categorie. Klaar.
					</p>
					<router-link class="cta big" to="/add"
						>Add your achievement</router-link
					>
				</div>
			</div>
		</section>
	</main>
</template>

<style scoped>
.home {
	min-height: 100vh;
}

/* Containers */
.container {
	width: min(1100px, calc(100% - 48px));
	margin: 0 auto;
}

/* HERO */
.scene-hero {
	position: relative;
	height: 120vh;
}

.hero-pin {
	position: relative;
	height: 100vh;
	display: grid;
	place-items: center;
	transform: translateZ(0);
}

.hero-bg {
	position: absolute;
	inset: 0;
	overflow: hidden;
	background: radial-gradient(
		1200px 600px at 50% 30%,
		rgba(255, 255, 255, 0.08),
		transparent 60%
	);
}

.orb {
	position: absolute;
	width: 520px;
	height: 520px;
	border-radius: 999px;
	filter: blur(12px);
	opacity: 0.55;
	transform: translateZ(0);
}

.orb-a {
	top: 10%;
	left: -10%;
	background: rgba(255, 80, 80, 0.2);
}
.orb-b {
	top: 5%;
	right: -12%;
	background: rgba(80, 255, 160, 0.18);
}
.orb-c {
	bottom: -18%;
	left: 25%;
	background: rgba(80, 160, 255, 0.18);
}

.grain {
	position: absolute;
	inset: 0;
	opacity: 0.2;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
	mix-blend-mode: overlay;
	pointer-events: none;
}

.hero-content {
	position: relative;
	z-index: 2;
}

.hero-copy {
	max-width: 760px;
}

.hero-title {
	font-size: clamp(48px, 6vw, 84px);
	line-height: 0.95;
	letter-spacing: -0.04em;
	margin: 0;
}

.hero-subtitle {
	margin-top: 14px;
	font-size: clamp(16px, 1.8vw, 20px);
	opacity: 0.82;
	max-width: 56ch;
}

.hero-glass {
	margin-top: 26px;
	border-radius: 24px;
	padding: 18px 18px 16px 18px;
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.12);
	backdrop-filter: blur(14px);
	box-shadow: 0 12px 50px rgba(0, 0, 0, 0.12);
}

.hero-kpi {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 12px;
}

.kpi-num {
	font-size: 18px;
	letter-spacing: -0.02em;
}

.kpi-label {
	font-size: 12px;
	opacity: 0.72;
	margin-top: 2px;
	text-transform: lowercase;
}

.hero-hint {
	margin-top: 12px;
	display: inline-flex;
	align-items: center;
	gap: 10px;
	opacity: 0.75;
	font-size: 13px;
}

.hero-hint .dot {
	width: 6px;
	height: 6px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.8);
	box-shadow: 0 0 16px rgba(255, 255, 255, 0.35);
}

/* SECTIONS */
.scene-meaning,
.scene-featured,
.scene-grid,
.scene-cta {
	padding: 84px 0;
}

.section-title {
	font-size: clamp(28px, 3.2vw, 44px);
	letter-spacing: -0.03em;
	margin: 0;
}

.section-subtitle {
	font-size: 18px;
	letter-spacing: -0.01em;
	margin: 0 0 8px 0;
}

.section-text {
	margin-top: 14px;
	opacity: 0.8;
	line-height: 1.6;
	max-width: 70ch;
}

/* MEANING GRID */
.meaning-grid {
	display: grid;
	grid-template-columns: 1.2fr 1fr 1fr;
	gap: 28px;
}

.meaning-block {
	border-radius: 24px;
	padding: 22px;
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
}

/* FEATURED */
.featured-card {
	display: grid;
	grid-template-columns: 1.2fr 0.8fr;
	gap: 24px;
	border-radius: 28px;
	padding: 18px;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.12);
	backdrop-filter: blur(12px);
	box-shadow: 0 20px 80px rgba(0, 0, 0, 0.14);
	overflow: hidden;
}

.featured-media {
	border-radius: 22px;
	overflow: hidden;
	position: relative;
	min-height: 320px;
}

.featured-img {
	width: 100%;
	height: 100%;
	display: block;
	object-fit: cover;
	transform: translateZ(0);
}

.featured-copy {
	padding: 10px 6px 6px 6px;
}

.badge {
	display: inline-flex;
	align-items: center;
	padding: 6px 10px;
	border-radius: 999px;
	font-size: 12px;
	opacity: 0.85;
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.12);
}

.featured-title {
	margin: 14px 0 0 0;
	font-size: 34px;
	letter-spacing: -0.03em;
	line-height: 1.05;
}

.featured-desc {
	margin-top: 12px;
	opacity: 0.82;
	line-height: 1.6;
}

.meta {
	margin-top: 14px;
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}

.pill {
	font-size: 12px;
	padding: 7px 10px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.12);
	opacity: 0.9;
}

/* CTA LINKS */
.cta {
	margin-top: 18px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 10px 14px;
	border-radius: 14px;
	text-decoration: none;
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.14);
	backdrop-filter: blur(10px);
	transition: transform 180ms ease, background 180ms ease,
		border-color 180ms ease;
}

.cta:hover {
	transform: translateY(-2px);
	background: rgba(255, 255, 255, 0.14);
	border-color: rgba(255, 255, 255, 0.18);
}

.cta.big {
	padding: 12px 16px;
	border-radius: 16px;
}

/* GRID HEAD */
.grid-head {
	margin-bottom: 22px;
}

/* MASONRY (lightweight) */
.masonry {
	column-count: 3;
	column-gap: 18px;
}

@media (max-width: 980px) {
	.meaning-grid {
		grid-template-columns: 1fr;
	}
	.featured-card {
		grid-template-columns: 1fr;
	}
	.masonry {
		column-count: 2;
	}
}

@media (max-width: 560px) {
	.container {
		width: min(1100px, calc(100% - 28px));
	}
	.masonry {
		column-count: 1;
	}
}

/* LOADING SKELETON */
.loading {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 18px;
}

.skeleton {
	height: 220px;
	border-radius: 22px;
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.1);
}

/* CTA SECTION */
.cta-card {
	border-radius: 28px;
	padding: 26px;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.12);
	backdrop-filter: blur(12px);
}
</style>
