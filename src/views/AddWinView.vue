<script setup>
import { ref } from "vue";
import { addWin } from "../api/api";

const title = ref("");
const description = ref("");
const category = ref("general");

const error = ref("");
const success = ref("");

async function submit() {
	error.value = "";
	success.value = "";

	try {
		await addWin({
			title: title.value,
			description: description.value,
			category: category.value,
		});

		success.value = "Win added successfully";
		title.value = "";
		description.value = "";
		category.value = "general";
	} catch (err) {
		error.value = err.message;
	}
}
</script>

<template>
	<div class="hero">
		<div class="container">
			<h1 class="hero-title">Add Win</h1>
			<p class="hero-subtitle">Add a new achievement</p>

			<div class="glass-card col-6" style="margin-top: 40px">
				<form @submit.prevent="submit">
					<div style="margin-bottom: 16px">
						<input
							v-model="title"
							placeholder="Title"
							required
							style="width: 100%; padding: 12px"
						/>
					</div>

					<div style="margin-bottom: 16px">
						<textarea
							v-model="description"
							placeholder="Description"
							rows="4"
							style="width: 100%; padding: 12px"
						/>
					</div>

					<div style="margin-bottom: 16px">
						<select v-model="category" style="width: 100%; padding: 12px">
							<option value="general">General</option>
							<option value="music">Music</option>
							<option value="sports">Sports</option>
							<option value="volunteering">Volunteering</option>
						</select>
					</div>

					<button class="button" type="submit">Add win</button>

					<p v-if="error" style="margin-top: 12px; color: red">
						{{ error }}
					</p>
					<p v-if="success" style="margin-top: 12px; color: green">
						Win added successfully
					</p>
				</form>
			</div>
		</div>
	</div>
</template>
