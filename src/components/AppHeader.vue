<script setup>
import { useRouter } from "vue-router";
import { isLoggedIn, clearToken } from "../api/auth";

const router = useRouter();

function logout() {
	clearToken();
	router.push("/login");
}
</script>

<template>
	<header
		style="
			height: 64px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 28px;
			background: rgba(255, 255, 255, 0.7);
			backdrop-filter: blur(12px);
		"
	>
		<!-- LEFT -->
		<div style="display: flex; align-items: center; gap: 16px">
			<router-link to="/" style="text-decoration: none; color: inherit">
				Home
			</router-link>
		</div>

		<!-- CENTER -->
		<input
			type="text"
			placeholder="Search wins..."
			style="
				width: 260px;
				padding: 10px 14px;
				border-radius: 999px;
				border: 1px solid rgba(0, 0, 0, 0.1);
				outline: none;
			"
		/>

		<!-- RIGHT -->
		<div style="display: flex; align-items: center; gap: 16px">
			<!-- PLUS -->
			<router-link
				v-if="isLoggedIn"
				to="/add-win"
				style="
					width: 36px;
					height: 36px;
					border-radius: 999px;
					display: grid;
					place-items: center;
					text-decoration: none;
					color: #111;
					border: 1px solid rgba(0, 0, 0, 0.12);
					background: rgba(255, 255, 255, 0.8);
				"
				title="Add win"
			>
				+
			</router-link>

			<!-- LOGIN -->
			<router-link
				v-if="!isLoggedIn"
				to="/login"
				style="text-decoration: none; color: inherit"
			>
				Login
			</router-link>

			<!-- LOGOUT -->
			<button
				v-if="isLoggedIn"
				@click="logout"
				style="
					border: 1px solid rgba(0, 0, 0, 0.12);
					background: rgba(255, 255, 255, 0.8);
					border-radius: 999px;
					padding: 8px 12px;
					cursor: pointer;
				"
			>
				Logout
			</button>
		</div>
	</header>
</template>
