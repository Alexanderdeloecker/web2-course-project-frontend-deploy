import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/RegisterView.vue";
import { isLoggedIn } from "../api/auth";

const LoginView = () => import("../views/LoginView.vue");
const AddWinView = () => import("../views/AddWinView.vue");

const routes = [
	{ path: "/", name: "home", component: HomeView },
	{ path: "/login", name: "login", component: LoginView },
	{ path: "/register", name: "register", component: RegisterView },
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
		return "/login";
	}
});

export default router;
