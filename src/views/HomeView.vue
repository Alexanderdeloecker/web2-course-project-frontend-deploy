<script setup>
import { ref, onMounted, computed } from "vue";
import { getWins } from "../api/api";
import { searchQuery } from "../api/search";

const wins = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
	try {
		const data = await getWins();
		wins.value = Array.isArray(data) ? data : data?.wins ?? [];
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
});

const filteredWins = computed(() => {
	const q = (searchQuery.value || "").toLowerCase().trim();
	if (!q) return wins.value;

	return wins.value.filter((win) => {
		const title = (win.title || "").toLowerCase();
		const category = (win.category || "").toLowerCase();
		const description = (win.description || "").toLowerCase();

		return title.includes(q) || category.includes(q) || description.includes(q);
	});
});
</script>

<template>
	<div class="hero">
		<div class="container">
			<h1 class="hero-title">Wall of Fame</h1>
			<p class="hero-subtitle">Celebrating skills beyond the classroom.</p>

			<div v-if="loading" class="glass-card" style="margin-top: 40px">
				Loading wins…
			</div>

			<div v-else-if="error" class="glass-card" style="margin-top: 40px">
				Error: {{ error }}
			</div>

			<div v-else class="grid" style="margin-top: 60px">
				<div v-for="win in filteredWins" :key="win._id" class="glass-card">
					<h2>{{ win.title || "Untitled" }}</h2>
					<p>{{ win.description || "No description" }}</p>
					<small>{{ win.category || "No category" }}</small>
				</div>

				<div v-if="filteredWins.length === 0" class="glass-card">
					No results found.
				</div>
			</div>
		</div>
	</div>
</template>
