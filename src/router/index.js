import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const LoginView = () => import("../views/LoginView.vue");
const AddWinView = () => import("../views/AddWinView.vue");

const routes = [
	{
		path: "/",
		name: "home",
		component: HomeView,
	},
	{
		path: "/login",
		name: "login",
		component: LoginView,
	},
	{
		path: "/add-win",
		name: "add-win",
		component: AddWinView,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
