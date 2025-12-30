<script setup>
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from "vue";
import { getMyWins, deleteWin } from "../api/api";
import WinCard from "../components/WinCard.vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const wins = ref([]);
const loading = ref(true);

/* ---------- DATA ---------- */
const total = computed(() => wins.value.length);
const categories = computed(() => [
	...new Set(wins.value.map((w) => w.category)),
]);
const latest = computed(
	() =>
		wins.value
			.slice()
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
);

// we nemen de eerste 9 wins (of minder als je er minder hebt)
const topNine = computed(() => wins.value.slice(0, 9));
const row1 = computed(() => topNine.value.slice(0, 3));
const row2 = computed(() => topNine.value.slice(3, 6));
const row3 = computed(() => topNine.value.slice(6, 9));

/* ---------- MOUNT ---------- */
onMounted(async () => {
	try {
		wins.value = await getMyWins(); // ✅ enkel wins van ingelogde user
	} finally {
		loading.value = false;
	}

	await nextTick();
	initStory();
});

onBeforeUnmount(() => {
	ScrollTrigger.getAll().forEach((t) => t.kill());
	gsap.globalTimeline.clear();
});

/* ---------- GSAP STORY ---------- */
function initStory() {
	ScrollTrigger.getAll().forEach((t) => t.kill());

	const root = document.querySelector(".profile");
	const dark = document.querySelector(".act-dark");
	const stats = document.querySelector(".act-stats");
	const editorial = document.querySelector(".act-editorial");
	const winsAct = document.querySelector(".act-wins");

	// ACT 2 — STATS: quick slide up + zoom
	if (stats) {
		gsap.fromTo(
			".stat",
			{ y: 120, opacity: 0, scale: 0.92 },
			{
				y: 0,
				opacity: 1,
				scale: 1,
				duration: 0.7,
				ease: "power3.out",
				stagger: 0.08,
				scrollTrigger: {
					trigger: stats,
					start: "top 75%",
					toggleActions: "play none none reverse",
				},
			}
		);
	}

	// ACT 3 — DARK BACKGROUND PHASE (pinned)
	if (dark) {
		gsap
			.timeline({
				scrollTrigger: {
					trigger: dark,
					start: "top top",
					end: "+=120%",
					scrub: true,
					pin: true,
					anticipatePin: 1,
				},
			})
			// background shift
			.to(root, { "--bg-dark": 1, duration: 0.2 }, 0)
			.fromTo(
				".dark-inner",
				{ opacity: 0, y: 80 },
				{ opacity: 1, y: 0, ease: "power3.out", duration: 0.4 },
				0.1
			)
			.fromTo(
				".dark-lines > *",
				{ opacity: 0, y: 24 },
				{
					opacity: 1,
					y: 0,
					stagger: 0.12,
					ease: "power2.out",
					duration: 0.5,
				},
				0.25
			)
			// fade out slightly before leaving
			.to(".dark-inner", { opacity: 0.35, y: -20, duration: 0.4 }, 0.9)
			// back to light
			.to(root, { "--bg-dark": 0, duration: 0.2 }, 1.05);
	}

	// ACT 4 — EDITORIAL (light again) reveal
	if (editorial) {
		gsap.fromTo(
			".editorial-card",
			{ opacity: 0, y: 60 },
			{
				opacity: 1,
				y: 0,
				duration: 0.7,
				ease: "power3.out",
				stagger: 0.12,
				scrollTrigger: {
					trigger: editorial,
					start: "top 75%",
					toggleActions: "play none none reverse",
				},
			}
		);
	}

	// ACT 5 — WINS: 3 rows, alternating directions, converge center
	if (winsAct) {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: winsAct,
				start: "top top",
				end: "+=200%",
				scrub: true,
				pin: true,
				anticipatePin: 1,
			},
		});

		// Set initial offsets (off-screen-ish)
		gsap.set(".row-1", { xPercent: 18, opacity: 0.9 });
		gsap.set(".row-2", { xPercent: -18, opacity: 0.9 });
		gsap.set(".row-3", { xPercent: 18, opacity: 0.9 });

		gsap.set(".row-1 .win-shell", { y: 30, opacity: 0 });
		gsap.set(".row-2 .win-shell", { y: 30, opacity: 0 });
		gsap.set(".row-3 .win-shell", { y: 30, opacity: 0 });

		tl.fromTo(
			".wins-title",
			{ opacity: 0, y: 30 },
			{ opacity: 1, y: 0, duration: 0.2 },
			0
		);

		// rows slide toward center
		tl.to(".row-1", { xPercent: 0, duration: 0.8, ease: "power2.out" }, 0.1);
		tl.to(".row-2", { xPercent: 0, duration: 0.8, ease: "power2.out" }, 0.18);
		tl.to(".row-3", { xPercent: 0, duration: 0.8, ease: "power2.out" }, 0.26);

		// cards reveal (stagger per row)
		tl.to(
			".row-1 .win-shell",
			{ opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" },
			0.25
		);
		tl.to(
			".row-2 .win-shell",
			{ opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" },
			0.32
		);
		tl.to(
			".row-3 .win-shell",
			{ opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" },
			0.39
		);

		// slight settle at the end (feels locked in)
		tl.to(".wins-rows", { scale: 1, duration: 0.6, ease: "power1.out" }, 0.75);
	}
}
async function handleDelete(id) {
	try {
		await deleteWin(id);

		// 1️⃣ UI update
		wins.value = wins.value.filter((w) => w._id !== id);

		// 2️⃣ GSAP reset (belangrijk!)
		await nextTick();

		ScrollTrigger.getAll().forEach((t) => t.kill());
		initStory();
	} catch (err) {
		console.error(err);
		alert("Delete failed. Please try again.");
	}
}
</script>

<template>
	<main class="profile">
		<!-- ACT I — INTRO -->
		<section class="scene intro">
			<div class="profile-content">
				<h1>Your Wall of Fame</h1>
				<p class="lead">
					A personal archive of effort, growth and things that matter — beyond
					grades.
				</p>
			</div>
		</section>

		<!-- ACT II — STATS -->
		<section class="scene act-stats">
			<div class="profile-content">
				<div class="stats">
					<div class="stat">
						<strong>{{ total }}</strong>
						<span>wins</span>
					</div>
					<div class="stat">
						<strong>{{ categories.length }}</strong>
						<span>domains</span>
					</div>
					<div class="stat">
						<strong>{{ latest?.category || "—" }}</strong>
						<span>latest focus</span>
					</div>
				</div>
			</div>
		</section>

		<!-- ACT III — DARK PHASE (pinned) -->
		<section class="scene act-dark">
			<div class="profile-content">
				<div class="dark-inner">
					<p class="dark-kicker">YOUR STORY</p>
					<h2 class="dark-title">Niet alleen projecten tellen.</h2>

					<div class="dark-lines">
						<p>
							Dit is geen CV. Dit is een verzameling van dingen waar tijd,
							energie en karakter in zit.
						</p>
						<p>Geen “perfect profiel”. Wel groei, effort en discipline.</p>
						<p>Elke win laat iets zien dat je niet kan faken.</p>
					</div>
				</div>
			</div>
		</section>

		<!-- ACT IV — LIGHT EDITORIAL -->
		<section class="scene act-editorial">
			<div class="profile-content">
				<div class="editorial">
					<div class="editorial-card">
						<h3>Editorial, maar met energie.</h3>
						<p>
							Grote typografie, veel ruimte en motion die je door de pagina
							trekt — zonder drukte.
						</p>
					</div>
					<div class="editorial-card">
						<h3>Elke win = een verhaal.</h3>
						<p>
							Groot of klein. Alleen of samen. Dit is waar groei zichtbaar
							wordt.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- ACT V — WINS (pinned horizontal convergence) -->
		<section class="scene act-wins">
			<h2 class="wins-title">The wins</h2>

			<p v-if="!loading && wins.length === 0" class="empty-state">
				You haven’t added any wins yet.
			</p>

			<div v-if="loading" class="wins-note">Loading…</div>

			<div v-if="wins.length > 0" class="wins-rows">
				<!-- Row 1 (from right) -->
				<div class="wins-row row-1">
					<div v-for="w in row1" :key="w._id" class="win-shell">
						<WinCard :win="w" :showDelete="true" @delete="handleDelete" />
					</div>
				</div>

				<!-- Row 2 (from left) -->
				<div class="wins-row row-2">
					<div v-for="w in row2" :key="w._id" class="win-shell">
						<WinCard :win="w" :showDelete="true" @delete="handleDelete" />
					</div>
				</div>

				<!-- Row 3 (from right) -->
				<div class="wins-row row-3">
					<div v-for="w in row3" :key="w._id" class="win-shell">
						<WinCard :win="w" :showDelete="true" @delete="handleDelete" />
					</div>
				</div>
			</div>
		</section>
	</main>
</template>
