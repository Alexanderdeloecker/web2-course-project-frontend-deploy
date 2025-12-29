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
