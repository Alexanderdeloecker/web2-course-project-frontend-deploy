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
const latestSixWins = computed(() => newestWins.value.slice(0, 6));

const featuredWin = computed(() => newestWins.value[0] || null);

/* rows voor Latest wins (max 9) */
const rows = computed(() => [
	newestWins.value.slice(0, 3),
	newestWins.value.slice(3, 6),
]);

/* ---------------- HELPERS ---------------- */
function safeText(v, fallback = "") {
	if (typeof v === "string" && v.trim()) return v.trim();
	return fallback;
}

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

	/* ACT 4 — LATEST WINS (Profile-style timing) */
	const grid = document.querySelector(".scene-grid");
	if (!grid) return;

	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: grid,
			start: "top top",
			end: "+=160%",
			scrub: true,
			pin: true,
			anticipatePin: 1,
		},
	});

	// initial states
	gsap.set(".scene-grid .row-left", { xPercent: -18, opacity: 0.9 });
	gsap.set(".scene-grid .row-right", { xPercent: 18, opacity: 0.9 });
	gsap.set(".scene-grid .win-card", { y: 30, opacity: 0 });

	// title first
	tl.fromTo(
		".grid-title",
		{ opacity: 0, y: 30 },
		{ opacity: 1, y: 0, duration: 0.25 },
		0
	);

	// rows converge
	tl.to(
		".scene-grid .row-left",
		{
			xPercent: 0,
			duration: 0.8,
			ease: "power2.out",
		},
		0.15
	);

	tl.to(
		".scene-grid .row-right",
		{
			xPercent: 0,
			duration: 0.8,
			ease: "power2.out",
		},
		0.22
	);

	// cards reveal
	tl.to(
		".scene-grid .win-card",
		{
			opacity: 1,
			y: 0,
			duration: 0.45,
			stagger: 0.06,
			ease: "power2.out",
		},
		0.35
	);
}
</script>

<template>
	<section class="home">
		<!-- ACT 1: HERO -->
		<section class="scene scene-hero">
			<div class="hero-bg" aria-hidden="true"></div>

			<div class="scene-inner hero-inner">
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
			<div class="scene-inner">
				<p class="meaning-line">Not just grades.</p>
				<p class="meaning-line">Not just school.</p>
				<p class="meaning-line strong">Real skills. Real wins.</p>
			</div>
		</section>

		<!-- ACT 3: FEATURED -->
		<section class="scene scene-featured" v-if="featuredWin">
			<div class="scene-inner">
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
							{{
								safeText(featuredWin.description, "No description provided.")
							}}
						</p>
						<span class="category">
							{{ featuredWin.category || "general" }}
						</span>
					</div>
				</div>
			</div>
		</section>

		<!-- ACT 4: LATEST WINS -->
		<section class="scene scene-grid">
			<div class="scene-inner">
				<h2 class="grid-title">Latest wins</h2>

				<div v-if="loading">Loading…</div>

				<div v-else class="wins-rows">
					<div
						v-for="(row, i) in rows"
						:key="i"
						class="wins-row"
						:class="i % 2 === 0 ? 'row-right' : 'row-left'"
					>
						<WinCard
							v-for="win in row"
							:key="win._id"
							:win="{ ...win, imageUrl: cdn(win.imageUrl, 'card') }"
							class="win-card"
						/>
					</div>
				</div>
			</div>
		</section>

		<!-- ACT 5: CTA -->
		<section class="scene scene-cta">
			<div class="scene-inner">
				<h2>Your story belongs here.</h2>
				<p>Add your achievement to the Wall of Fame.</p>
				<router-link to="/add-win" class="btn btn--inverse">
					Add your win →
				</router-link>
			</div>
		</section>
	</section>
</template>
