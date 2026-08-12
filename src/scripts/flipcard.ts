import { gsap } from "./gsap-init";

const flipTo = (inner: HTMLElement, angle: number) => {
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		inner.dataset.flipped = angle === 180 ? "true" : "false";
		return;
	}
	gsap.to(inner, { rotationY: angle, duration: 0.7, ease: "power2.inOut" });
	inner.dataset.flipped = angle === 180 ? "true" : "false";
};

const isFlipped = (inner: HTMLElement) => inner.dataset.flipped === "true";

const fine = window.matchMedia("(pointer: fine)").matches;
const coarse = window.matchMedia("(pointer: coarse)").matches;

document.querySelectorAll<HTMLElement>("[data-flip]").forEach((card) => {
	const inner = card.querySelector<HTMLElement>("[data-flip-inner]");
	if (!inner) return;

	if (fine) {
		card.addEventListener("pointerenter", () => {
			if (!isFlipped(inner)) flipTo(inner, 180);
		});
		card.addEventListener("pointerleave", () => {
			if (isFlipped(inner)) flipTo(inner, 0);
		});
		card.addEventListener("focusin", () => {
			if (!isFlipped(inner)) flipTo(inner, 180);
		});
		card.addEventListener("focusout", () => {
			if (isFlipped(inner)) flipTo(inner, 0);
		});
	}

	if (coarse) {
		card.addEventListener("click", () => {
			flipTo(inner, isFlipped(inner) ? 0 : 180);
		});
	}
});