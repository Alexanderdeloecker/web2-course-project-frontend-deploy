<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getWins } from "../api/api";

const route = useRoute();
const win = ref(null);

onMounted(async () => {
	const wins = await getWins();
	win.value = wins.find((w) => w._id === route.params.id);
});
</script>

<template>
	<main v-if="win" class="page">
		<img class="hero" :src="win.imageUrl" />

		<div class="container">
			<span class="pill">{{ win.category }}</span>
			<h1>{{ win.title }}</h1>
			<p class="desc">{{ win.description }}</p>
		</div>
	</main>
</template>

<style scoped>
.page {
	background: #f4f5f8;
	min-height: 100vh;
}

.hero {
	width: 100%;
	height: 420px;
	object-fit: cover;
}

.container {
	max-width: 900px;
	margin: -80px auto 0;
	background: white;
	border-radius: 28px;
	padding: 32px;
	box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
}

.pill {
	display: inline-block;
	padding: 6px 12px;
	border-radius: 999px;
	background: rgba(0, 0, 0, 0.06);
}

.desc {
	margin-top: 16px;
	font-size: 16px;
	line-height: 1.6;
	color: #444;
}
</style>
