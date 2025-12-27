<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getToken } from "../api/auth";
import { triggerToast } from "../api/toast";

const router = useRouter();

/* API */
const API_URL = import.meta.env.VITE_API_URL;

/* form state */
const title = ref("");
const description = ref("");
const category = ref("general");
const imageFile = ref(null);
const imagePreview = ref(null);
const loading = ref(false);

/* image select */
function onImageChange(e) {
	const file = e.target.files[0];
	if (!file) return;

	imageFile.value = file;
	imagePreview.value = URL.createObjectURL(file);
}

/* submit */
async function submit() {
	if (title.value.trim().length < 3) {
		triggerToast("Title must be at least 3 characters", "error");
		return;
	}

	const formData = new FormData();
	formData.append("title", title.value);
	formData.append("description", description.value);
	formData.append("category", category.value);

	if (imageFile.value) {
		formData.append("image", imageFile.value); // 👈 moet exact "image" zijn
	}

	loading.value = true;

	try {
		const res = await fetch(`${API_URL}/wins`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${getToken()}`,
			},
			body: formData,
		});

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.error || "Failed to create win");
		}

		triggerToast("Win added 🎉", "success");
		router.push("/");
	} catch (err) {
		triggerToast(err.message || "Something went wrong", "error");
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<section class="container">
		<div class="form-card">
			<h1 class="form-title">Add a win</h1>

			<label class="label">
				Title
				<input
					v-model="title"
					type="text"
					placeholder="Won a piano competition"
				/>
			</label>

			<label class="label">
				Description
				<textarea
					v-model="description"
					placeholder="Tell us more about this achievement"
				/>
			</label>

			<label class="label">
				Category
				<select v-model="category">
					<option value="general">General</option>
					<option value="music">Music</option>
					<option value="sports">Sports</option>
					<option value="volunteering">Volunteering</option>
					<option value="tech">Tech</option>
				</select>
			</label>

			<label class="label">
				Image (optional)
				<input type="file" accept="image/*" @change="onImageChange" />
			</label>

			<!-- IMAGE PREVIEW -->
			<div v-if="imagePreview" class="image-preview">
				<img :src="imagePreview" alt="Preview" />
			</div>

			<button class="btn" :disabled="loading" @click="submit">
				{{ loading ? "Saving…" : "Add win" }}
			</button>
		</div>
	</section>
</template>

<style scoped>
.container {
	max-width: 720px;
	margin: 80px auto;
	padding: 0 20px;
}

.form-card {
	background: #ffffff;
	border-radius: 18px;
	padding: 36px;
	box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);
}

.form-title {
	font-size: 28px;
	margin-bottom: 28px;
}

.label {
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin-bottom: 18px;
	font-weight: 500;
}

input,
textarea,
select {
	padding: 12px 14px;
	border-radius: 10px;
	border: 1px solid #ddd;
	font-size: 15px;
	font-family: inherit;
}

textarea {
	min-height: 110px;
	resize: vertical;
}

.image-preview {
	margin: 18px 0;
	border-radius: 14px;
	overflow: hidden;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.image-preview img {
	width: 100%;
	height: 260px;
	object-fit: cover;
	display: block;
}

.btn {
	margin-top: 24px;
	padding: 14px;
	border-radius: 999px;
	border: none;
	background: #111;
	color: white;
	font-size: 16px;
	cursor: pointer;
}

.btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}
</style>
