<script setup>
import { ref } from "vue";
import { addWin } from "../api/api";
import { useRouter } from "vue-router";

const router = useRouter();

const title = ref("");
const description = ref("");
const category = ref("general");
const image = ref(null);
const loading = ref(false);
const error = ref(null);

function onFileChange(e) {
	const file = e?.target?.files?.[0] || null;
	image.value = file;
}

async function submit() {
	if (!title.value || !image.value) {
		error.value = "Title and image are required.";
		return;
	}

	error.value = null;
	loading.value = true;

	try {
		const form = new FormData();
		form.append("title", title.value);
		form.append("description", description.value);
		form.append("category", category.value);
		form.append("image", image.value);

		await addWin(form);
		router.push("/profile");
	} catch (e) {
		// toon backend error indien aanwezig
		error.value = e?.message || "Something went wrong.";
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<main class="add">
		<div class="container">
			<h1>Add a win</h1>
			<p class="sub">One image. One sentence. One category.</p>

			<form @submit.prevent="submit" class="form">
				<input v-model="title" type="text" placeholder="Title" />

				<textarea
					v-model="description"
					placeholder="Short description (optional)"
				/>

				<select v-model="category">
					<option value="general">General</option>
					<option value="sport">Sport</option>
					<option value="music">Music</option>
					<option value="tech">Tech</option>
					<option value="volunteer">Volunteer</option>
				</select>

				<input type="file" accept="image/*" @change="onFileChange" />

				<button :disabled="loading">
					{{ loading ? "Uploading…" : "Add win" }}
				</button>

				<p v-if="error" class="error">{{ error }}</p>
			</form>
		</div>
	</main>
</template>
