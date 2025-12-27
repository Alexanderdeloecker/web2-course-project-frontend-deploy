<script setup>
import { useRouter } from "vue-router";
import { isLoggedIn, clearToken } from "../api/auth";
import { searchQuery } from "../api/search";
import SearchBar from "./SearchBar.vue";

const router = useRouter();

function logout() {
	clearToken();
	searchQuery.value = "";
	router.push("/login");
}
</script>

<template>
	<header class="app-header">
		<!-- LEFT -->
		<nav class="nav-left">
			<router-link to="/">Home</router-link>
		</nav>

		<!-- CENTER -->
		<SearchBar />

		<!-- RIGHT -->
		<nav class="nav-right">
			<router-link v-if="isLoggedIn" to="/profile"> Profile </router-link>

			<router-link v-if="isLoggedIn" to="/add-win" class="add-btn">
				＋
			</router-link>

			<router-link v-if="!isLoggedIn" to="/login"> Login </router-link>

			<button v-if="isLoggedIn" @click="logout">Logout</button>
		</nav>
	</header>
</template>

<style scoped>
.app-header {
	height: 64px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 28px;
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(12px);
	border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.nav-left,
.nav-right {
	display: flex;
	align-items: center;
	gap: 18px;
}

a {
	text-decoration: none;
	color: #111;
	font-weight: 500;
}

.add-btn {
	width: 36px;
	height: 36px;
	border-radius: 999px;
	display: grid;
	place-items: center;
	background: rgba(0, 0, 0, 0.06);
}

button {
	background: none;
	border: none;
	cursor: pointer;
	font-weight: 500;
}
</style>
