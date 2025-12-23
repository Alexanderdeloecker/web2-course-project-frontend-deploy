<script setup>
import { ref, onMounted } from "vue";
import { getWins } from "../api/api";

const wins = ref([]);
const error = ref(null);

onMounted(async () => {
	try {
		wins.value = await getWins();
	} catch (err) {
		error.value = err.message;
	}
});
</script>

<template>
	<div class="hero">
		<div class="hero-orb orb-blue"></div>
		<div class="hero-orb orb-green"></div>

		<div class="container">
			<h1 class="hero-title">Wall of Fame</h1>
			<div
				class="glass-card glow-blue hover-float"
				style="margin-top: 40px; max-width: 400px"
			>
				<h2 class="card-title">Test card</h2>
				<p class="card-text">If this is glassy, CSS is perfect.</p>
			</div>

			<p class="hero-subtitle">Celebrating skills beyond the classroom.</p>

			<div class="grid" style="margin-top: 60px">
				<!-- cards -->
			</div>
		</div>
	</div>
</template>
