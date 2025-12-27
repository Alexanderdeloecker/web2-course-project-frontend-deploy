<script setup>
import { ref, onMounted } from "vue";
import { getWins } from "../api/api";
import WinCard from "../components/WinCard.vue";

const wins = ref([]);

onMounted(async () => {
	wins.value = await getWins();
});
</script>

<template>
	<main class="profile">
		<section class="header">
			<h1>My Portfolio</h1>
			<p>All my achievements, collected in one place.</p>
		</section>

		<section class="grid">
			<WinCard v-for="w in wins" :key="w._id" :win="w" />
		</section>
	</main>
</template>

<style scoped>
.profile {
	background: #f4f5f8;
	min-height: 100vh;
	padding: 64px 0;
}

.header {
	max-width: 1100px;
	margin: 0 auto 32px;
	padding: 0 24px;
}

.header h1 {
	font-size: 48px;
}

.grid {
	max-width: 1100px;
	margin: 0 auto;
	padding: 0 24px;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 24px;
}
</style>
