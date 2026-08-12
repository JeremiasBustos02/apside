import { gsap } from "./gsap-init";

const mm = gsap.matchMedia();

document.addEventListener("click", (event) => {
	const toggle = (event.target as HTMLElement).closest("[data-flip-toggle]");
	if (!toggle) return;
	const inner = toggle.closest<HTMLElement>(".flip-inner");
	if (!inner) return;

	if (mm.reducedMotion) {
		inner.dataset.flipped = inner.dataset.flipped === "true" ? "false" : "true";
		return;
	}

	const flipped = inner.dataset.flipped === "true";
	gsap.to(inner, {
		rotationY: flipped ? 0 : 180,
		duration: 0.7,
		ease: "power2.inOut",
	});
	inner.dataset.flipped = flipped ? "false" : "true";
});