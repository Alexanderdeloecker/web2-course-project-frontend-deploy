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
			<p class="hero-subtitle">Celebrating skills beyond the classroom.</p>

			<p v-if="error">{{ error }}</p>

			<div class="grid" style="margin-top: 40px">
				<div
					v-for="win in wins"
					:key="win._id"
					class="glass-card hover-float col-4"
				>
					<h2 class="card-title">{{ win.title }}</h2>
					<p class="card-text">{{ win.description }}</p>
					<span class="tag">{{ win.category }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
