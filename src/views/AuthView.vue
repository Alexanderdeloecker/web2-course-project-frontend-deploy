<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { login, register } from "../api/api";
import { setToken } from "../api/auth";

const route = useRoute();
const router = useRouter();

const mode = ref("login");
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref(null);

onMounted(() => {
	mode.value = route.path.includes("register") ? "register" : "login";
});

watch(
	() => route.path,
	(p) => {
		mode.value = p.includes("register") ? "register" : "login";
	}
);

function toggle() {
	mode.value = mode.value === "login" ? "register" : "login";
	router.push(mode.value === "login" ? "/login" : "/register");
}

async function submit() {
	error.value = null;
	loading.value = true;

	try {
		if (mode.value === "login") {
			const data = await login(email.value, password.value);
			setToken(data.token);
			router.push("/");
		} else {
			await register(email.value, password.value);
			router.push("/login");
		}
	} catch (err) {
		error.value = err.message || "Something went wrong";
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<section class="auth">
		<div class="auth-container" :class="mode">
			<!-- SLIDING PANEL -->
			<div class="panel">
				<h1>{{ mode === "login" ? "Welcome back" : "Join the Wall" }}</h1>
				<p>
					{{
						mode === "login"
							? "Log in to manage and showcase your wins."
							: "Create an account and start building your Wall of Fame."
					}}
				</p>

				<button class="ghost" @click="toggle">
					{{ mode === "login" ? "Create account" : "Back to login" }}
				</button>
			</div>

			<!-- FORM -->
			<div class="form">
				<h2>{{ mode === "login" ? "Login" : "Register" }}</h2>

				<input v-model="email" type="email" placeholder="Email" />
				<input v-model="password" type="password" placeholder="Password" />

				<button class="primary" @click="submit" :disabled="loading">
					{{ loading ? "Loading…" : mode === "login" ? "Login" : "Register" }}
				</button>

				<p v-if="error" class="error">{{ error }}</p>
			</div>
		</div>
	</section>
</template>

<style scoped>
/* PAGE BACKGROUND */
.auth {
	min-height: 100vh;
	display: grid;
	place-items: center;
	background: radial-gradient(
			900px 500px at 50% 20%,
			rgba(140, 140, 255, 0.18),
			transparent 60%
		),
		#0a0a0f;
}

/* MAIN CONTAINER */
.auth-container {
	width: min(920px, 94%);
	height: 440px;
	position: relative;
	border-radius: 32px;
	overflow: hidden;
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid rgba(255, 255, 255, 0.14);
	backdrop-filter: blur(20px);
	box-shadow: 0 40px 120px rgba(0, 0, 0, 0.55);
}

/* SLIDING PANEL */
.panel {
	position: absolute;
	top: 0;
	left: 0;
	width: 50%;
	height: 100%;
	padding: 56px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 18px;
	color: white;
	z-index: 2;

	background: linear-gradient(
		135deg,
		rgba(120, 140, 255, 0.85),
		rgba(170, 120, 255, 0.85)
	);

	transition: transform 0.9s cubic-bezier(0.7, 0, 0.3, 1), background 0.6s ease;
}

/* REGISTER = DARKER PANEL */
.auth-container.register .panel {
	transform: translateX(100%);
	background: linear-gradient(
		135deg,
		rgba(40, 40, 60, 0.95),
		rgba(70, 50, 90, 0.95)
	);
}

/* FORM */
.form {
	position: absolute;
	top: 0;
	right: 0;
	width: 50%;
	height: 100%;
	padding: 56px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 16px;
	color: white;
	transition: transform 0.9s cubic-bezier(0.7, 0, 0.3, 1);
}

.auth-container.register .form {
	transform: translateX(-100%);
}

/* INPUTS */
input {
	padding: 14px 16px;
	border-radius: 14px;
	border: 1px solid rgba(255, 255, 255, 0.18);
	background: rgba(0, 0, 0, 0.55);
	color: #fff;
	font-size: 15px;
	outline: none;
}

input::placeholder {
	color: rgba(255, 255, 255, 0.55);
}

/* PRIMARY BUTTON */
.primary {
	margin-top: 10px;
	padding: 14px;
	border-radius: 16px;
	background: linear-gradient(
		90deg,
		rgba(130, 150, 255, 1),
		rgba(180, 120, 255, 1)
	);
	border: none;
	color: #fff;
	font-weight: 500;
	font-size: 15px;
	cursor: pointer;
	box-shadow: 0 12px 40px rgba(120, 120, 255, 0.45);
}

.auth-container.register .primary {
	background: linear-gradient(
		90deg,
		rgba(90, 90, 120, 1),
		rgba(140, 90, 180, 1)
	);
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
}

/* GHOST BUTTON */
.ghost {
	margin-top: 18px;
	background: rgba(255, 255, 255, 0.12);
	border: 1px solid rgba(255, 255, 255, 0.35);
	color: white;
	padding: 10px 16px;
	border-radius: 16px;
	cursor: pointer;
	width: fit-content;
}

/* ERROR */
.error {
	margin-top: 8px;
	color: #ffb4b4;
	font-size: 14px;
}

/* RESPONSIVE */
@media (max-width: 760px) {
	.panel {
		display: none;
	}
	.form {
		width: 100%;
		transform: none !important;
	}
}
</style>
