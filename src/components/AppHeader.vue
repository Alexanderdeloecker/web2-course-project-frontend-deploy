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
		<div class="header-inner">
			<!-- LEFT -->
			<nav class="nav-left">
				<router-link to="/">Home</router-link>
				<router-link to="/profile">Profile</router-link>
			</nav>

			<!-- CENTER -->
			<div class="nav-center">
				<SearchBar />
			</div>

			<!-- RIGHT -->
			<div class="nav-right">
				<router-link :to="{ name: 'add-win' }" class="btn">
					+ Add win
				</router-link>

				<button v-if="isLoggedIn" class="btn" type="button" @click="logout">
					Logout
				</button>

				<router-link v-else to="/login" class="btn">
					Login / Register
				</router-link>
			</div>
		</div>
	</header>
</template>
