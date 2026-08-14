import { gsap, ScrollTrigger } from "./gsap-init";

const STEP_COUNT = 4;

const clear = () => {
	const pinned = document.querySelector<HTMLElement>("[data-process-pinned]");
	if (!pinned) return;
	pinned.classList.remove("process-live");
	pinned
		.querySelectorAll<HTMLElement>("[data-process-step], [data-process-copy]")
		.forEach((el) => {
			el.classList.remove("is-active", "is-visible");
			el.setAttribute("aria-hidden", "false");
		});
	pinned.querySelector<HTMLElement>("[data-process-fill]")!.style.transform =
		"";
};

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
	const section = document.getElementById("proceso");
	const stage = section?.querySelector<HTMLElement>("#process-stage");
	const pinned =
		section?.querySelector<HTMLElement>("[data-process-pinned]");
	const fill = section?.querySelector<HTMLElement>("[data-process-fill]");
	const steps = section
		? Array.from(
				section.querySelectorAll<HTMLElement>("[data-process-step]"),
			)
		: [];
	const copies = section
		? Array.from(
				section.querySelectorAll<HTMLElement>("[data-process-copy]"),
			)
		: [];
	if (!section || !stage || !pinned || !fill || !steps.length || !copies.length) {
		return;
	}

	pinned.classList.add("process-live");

	const set = (p: number) => {
		const index = Math.min(
			STEP_COUNT - 1,
			Math.max(0, Math.floor(p * STEP_COUNT)),
		);

		steps.forEach((el, i) => {
			const visible = p >= i / STEP_COUNT;
			el.classList.toggle("is-visible", visible);
			el.classList.toggle("is-active", i === index);
			el.setAttribute("aria-hidden", visible ? "false" : "true");
		});

		copies.forEach((el, i) => {
			const visible = p >= i / STEP_COUNT;
			el.classList.toggle("is-visible", visible);
			el.setAttribute("aria-hidden", visible ? "false" : "true");
		});

		fill.style.transform = `scaleY(${Math.min(
			1,
			Math.max(0, p),
		).toFixed(4)})`;
	};

	set(0);

	const trigger = ScrollTrigger.create({
		trigger: stage,
		start: () =>
			window.matchMedia("(max-width: 63.99rem)").matches
				? "top 90%"
				: "top 72%",
		end: "bottom 45%",
		scrub: true,
		invalidateOnRefresh: true,
		onUpdate: (self) => set(self.progress),
	});

	return () => {
		trigger.kill();
		clear();
	};
});

mm.add("(prefers-reduced-motion: reduce)", clear);