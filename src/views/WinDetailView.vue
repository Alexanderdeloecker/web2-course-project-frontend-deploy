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
