<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "../api/api";
import { setToken } from "../api/auth";
import { triggerToast } from "../api/toast";

const email = ref("");
const password = ref("");
const error = ref(null);

const router = useRouter();

async function submit() {
	error.value = null;

	try {
		const data = await register(email.value, password.value);
		setToken(data.token);

		triggerToast("Account created & logged in 🎉");

		setTimeout(() => {
			router.push("/");
		}, 800);
	} catch (err) {
		error.value = err.message;
	}
}
</script>

<template>
	<div class="hero">
		<div class="container">
			<h1 class="hero-title">Register</h1>
			<p class="hero-subtitle">Create an account to add wins</p>

			<div class="glass-card col-6" style="margin-top: 40px">
				<form @submit.prevent="submit">
					<input
						v-model="email"
						type="email"
						placeholder="Email"
						required
						style="width: 100%; padding: 12px; margin-bottom: 16px"
					/>

					<input
						v-model="password"
						type="password"
						placeholder="Password"
						required
						style="width: 100%; padding: 12px; margin-bottom: 16px"
					/>

					<button class="button" type="submit">Register</button>

					<p v-if="error" style="color: red; margin-top: 12px">
						{{ error }}
					</p>

					<p style="margin-top: 16px">
						Already have an account?
						<router-link to="/login">Login</router-link>
					</p>
				</form>
			</div>
		</div>
	</div>
</template>
