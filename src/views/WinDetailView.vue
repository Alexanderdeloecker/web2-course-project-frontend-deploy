<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getWins } from "../api/api";

const route = useRoute();
const router = useRouter();
const win = ref(null);

onMounted(async () => {
	const wins = await getWins();
	win.value = wins.find((w) => w._id === route.params.id);
});
</script>

<template>
	<main v-if="win" class="page">
		<section class="card">
			<header class="header">
				<button class="back" @click="router.back()">← Back</button>
				<span class="pill">{{ win.category }}</span>
			</header>

			<div class="body">
				<div class="image-wrap">
					<img v-if="win.imageUrl" :src="win.imageUrl" :alt="win.title" />
				</div>

				<div class="content">
					<h1>{{ win.title }}</h1>

					<p class="meta">
						<span>
							Created by
							<strong>{{ win.user?.name || "Unknown" }}</strong>
						</span>
						<span v-if="win.createdAt">
							• {{ new Date(win.createdAt).toLocaleDateString("nl-BE") }}
						</span>
					</p>

					<p class="desc">{{ win.description }}</p>
				</div>
			</div>
		</section>
	</main>
</template>

<style scoped>
/* Page */
.page {
	height: 100vh;
	background: linear-gradient(180deg, #f6f7fb, #eef0f5);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	padding: 24px;
}

/* Card */
.card {
	width: 100%;
	max-width: 1000px;
	background: white;
	border-radius: 28px;
	box-shadow: 0 40px 100px rgba(0, 0, 0, 0.18);
	display: flex;
	flex-direction: column;
}

/* Header */
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px 28px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.back {
	background: none;
	border: none;
	font-size: 14px;
	cursor: pointer;
	color: #444;
}

.pill {
	padding: 6px 14px;
	border-radius: 999px;
	background: rgba(0, 0, 0, 0.06);
	font-size: 12px;
}

/* Body */
.body {
	display: grid;
	grid-template-columns: 1fr 1.2fr;
	gap: 32px;
	padding: 28px;
	align-items: center;
}

/* Image */
.image-wrap img {
	width: 100%;
	height: 320px;
	object-fit: cover;
	border-radius: 20px;
}

/* Content */
.content h1 {
	font-size: 34px;
	line-height: 1.2;
	margin-bottom: 12px;
}

.meta {
	font-size: 13px;
	color: #777;
	margin-bottom: 20px;
}

.desc {
	font-size: 16px;
	line-height: 1.7;
	color: #444;
}
</style>
