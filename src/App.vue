<script setup>
import AppHeader from "./components/AppHeader.vue";
import { showToast, toastMessage, toastType } from "./api/toast";
</script>

<template>
	<AppHeader />
	<router-view />

	<!-- Toast -->
	<div
		v-if="showToast"
		:style="{
			position: 'fixed',
			bottom: '32px',
			left: '50%',
			transform: 'translateX(-50%)',
			padding: '14px 22px',
			borderRadius: '12px',
			color: '#fff',
			background: toastType === 'success' ? '#16a34a' : '#dc2626',
			boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
			zIndex: 9999,
		}"
	>
		{{ toastMessage }}
	</div>
</template>
