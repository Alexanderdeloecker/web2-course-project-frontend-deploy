import { ref } from "vue";

export const toastMessage = ref("");
export const toastType = ref("success"); // success | error
export const showToast = ref(false);

export function triggerToast(message, type = "success") {
	toastMessage.value = message;
	toastType.value = type;
	showToast.value = true;

	setTimeout(() => {
		showToast.value = false;
	}, 2500);
}
