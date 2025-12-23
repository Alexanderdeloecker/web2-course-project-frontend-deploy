<template>
	<header style="padding: 24px 0">
		<div class="container" style="display: flex; gap: 24px">
			<router-link to="/">Home</router-link>
			<router-link to="/add-win">Add win</router-link>
			<router-link to="/login">Login</router-link>
		</div>
	</header>
</template>

<style scoped>
a {
	text-decoration: none;
	font-weight: 500;
	color: inherit;
}

a.router-link-active {
	text-decoration: underline;
}
</style>
