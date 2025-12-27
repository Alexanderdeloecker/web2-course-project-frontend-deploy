import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AuthView from "../views/AuthView.vue";
import { isLoggedIn } from "../api/auth";

const AddWinView = () => import("../views/AddWinView.vue");
const SearchResultsView = () => import("../views/SearchResultsView.vue");
const WinDetailView = () => import("../views/WinDetailView.vue");
const ProfileView = () => import("../views/ProfileView.vue");

const routes = [
	{ path: "/", name: "home", component: HomeView },

	{ path: "/login", name: "login", component: AuthView },
	{ path: "/register", name: "register", component: AuthView },

	{ path: "/search", name: "search", component: SearchResultsView },

	{
		path: "/wins/:id",
		name: "win-detail",
		component: WinDetailView,
	},

	{
		path: "/profile",
		name: "profile",
		component: ProfileView,
		meta: { requiresAuth: true },
	},

	{
		path: "/add-win",
		name: "add-win",
		component: AddWinView,
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to) => {
	if (to.meta.requiresAuth && !isLoggedIn.value) {
		return { name: "login" };
	}
});

export default router;
