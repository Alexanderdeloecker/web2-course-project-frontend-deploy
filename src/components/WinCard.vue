<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";

const props = defineProps({
	win: { type: Object, required: true },
});

const router = useRouter();

function openWin() {
	router.push(`/wins/${props.win._id}`);
}

const formattedDate = computed(() =>
	new Date(props.win.createdAt).toLocaleDateString("nl-BE", {
		day: "numeric",
		month: "short",
		year: "numeric",
	})
);
</script>

<template>
	<article class="card" @click="openWin">
		<img class="image" :src="win.imageUrl" alt="" />

		<div class="content">
			<span class="category">{{ win.category }}</span>

			<h3 class="title">{{ win.title }}</h3>

			<p class="meta">
				<span class="author">by {{ win.user?.name || "Unknown" }}</span>
				<span class="dot">•</span>
				<span class="date">{{ formattedDate }}</span>
			</p>

			<p class="description">{{ win.description }}</p>
		</div>
	</article>
</template>

<style scoped>
.card {
	cursor: pointer;
	border-radius: 22px;
	overflow: hidden;
	background: rgba(255, 255, 255, 0.85);
	border: 1px solid rgba(0, 0, 0, 0.08);
	transition: transform 0.25s ease, box-shadow 0.25s ease;
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
	padding: 18px;
}

.category {
	font-size: 12px;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	opacity: 0.55;
}

.title {
	margin: 6px 0 2px;
	font-size: 1.05rem;
}

.meta {
	font-size: 0.8rem;
	color: #777;
	display: flex;
	align-items: center;
	gap: 6px;
	margin-bottom: 8px;
}

.dot {
	opacity: 0.4;
}

.description {
	font-size: 0.9rem;
	color: #555;
	line-height: 1.5;
}
</style>
