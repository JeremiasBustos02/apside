import { gsap, ScrollTrigger } from "./gsap-init";

const smoothstep = (edge0: number, edge1: number, x: number) => {
	const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
	return t * t * (3 - 2 * t);
};

const STEP_COUNT = 4;
const GHOST_OPACITY = 0.18;

const mm = gsap.matchMedia();

mm.add(
	"(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
	() => {
		const section = document.getElementById("proceso");
		const fill = section?.querySelector<HTMLElement>(
			"[data-process-fill]",
		);
		const numbers = section
			? Array.from(
					section.querySelectorAll<HTMLElement>(
						"[data-process-number]",
					),
				)
			: [];
		if (!section || !fill || !numbers.length) return;

		const set = (p: number) => {
			fill.style.transform = `scaleX(${p.toFixed(4)})`;
			numbers.forEach((number, i) => {
				const t = smoothstep(
					i / STEP_COUNT,
					(i + 1) / STEP_COUNT,
					p,
				);
				number.style.opacity = String(
					(GHOST_OPACITY + (1 - GHOST_OPACITY) * t).toFixed(3),
				);
			});
		};

		set(0);

		return ScrollTrigger.create({
			trigger: section,
			start: "top 75%",
			end: "bottom 55%",
			scrub: true,
			onUpdate: (self) => set(self.progress),
		});
	},
);

const clearInline = () => {
	const section = document.getElementById("proceso");
	if (!section) return;
	gsap.set(section.querySelectorAll<HTMLElement>("[data-process-number]"), {
		clearProps: "opacity",
	});
	gsap.set(section.querySelectorAll<HTMLElement>("[data-process-fill]"), {
		clearProps: "transform",
	});
};

mm.add("(max-width: 63.99rem)", clearInline);
mm.add("(prefers-reduced-motion: reduce)", clearInline);