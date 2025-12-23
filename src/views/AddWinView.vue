<script setup>
import { ref } from "vue";
import { addWin } from "../api/api";

const title = ref("");
const description = ref("");
const category = ref("general");
const error = ref(null);
const success = ref(false);

// TEMP: plak hier straks je JWT (tot login klaar is)
const token = ref(
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRiMDhhOTJkYjgxZmFjNWM3ZWI3MjUiLCJlbWFpbCI6IkFkbEBnbWFpbC5jb20iLCJpYXQiOjE3NjY1MjUzNzUsImV4cCI6MTc2NzEzMDE3NX0.qVW5BUW5WdgD-kazNjwnVvpZfev-6mzhsa0vbI-Defc"
);

async function submit() {
	error.value = null;
	success.value = false;

	try {
		await addWin(
			{
				title: title.value,
				description: description.value,
				category: category.value,
			},
			token.value
		);
		success.value = true;
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
