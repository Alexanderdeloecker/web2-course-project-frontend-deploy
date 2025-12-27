<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
	win: { type: Object, required: true },
});

const router = useRouter();

function openWin() {
	router.push(`/wins/${props.win._id}`);
}
</script>

<template>
	<article class="card" @click="openWin">
		<img class="image" :src="win.imageUrl" alt="" />

		<div class="content">
			<span class="category">{{ win.category }}</span>
			<h3>{{ win.title }}</h3>
			<p>{{ win.description }}</p>
		</div>
	</article>
</template>

<style scoped>
.card {
	cursor: pointer;
	border-radius: 22px;
	overflow: hidden;
	background: rgba(255, 255, 255, 0.8);
	border: 1px solid rgba(0, 0, 0, 0.08);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
	transform: translateY(-4px);
	box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.image {
	width: 100%;
	height: 220px;
	object-fit: cover;
}

.content {
	padding: 16px;
}

.category {
	font-size: 12px;
	opacity: 0.6;
}

h3 {
	margin: 6px 0;
}

p {
	font-size: 14px;
	color: #555;
}
</style>
