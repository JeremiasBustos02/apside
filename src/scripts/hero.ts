import { gsap } from "./gsap-init";

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
	const hero = document.getElementById("hero");
	if (!hero) return;

	const title = hero.querySelector<HTMLElement>("h1");
	const subtitle = hero.querySelector<HTMLElement>("p");
	const ctas = hero.querySelector<HTMLElement>("div.flex.flex-wrap");
	const visual = hero.querySelector<HTMLElement>("div[role='img']");

	const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
	if (title) entrance.from(title, { y: 48, autoAlpha: 0, duration: 0.9 });
	if (subtitle)
		entrance.from(subtitle, { y: 32, autoAlpha: 0, duration: 0.8 }, "-=0.5");
	if (ctas)
		entrance.from(
			ctas,
			{ y: 24, autoAlpha: 0, duration: 0.7 },
			"-=0.45",
		);
	if (visual) entrance.from(visual, { x: 48, autoAlpha: 0, duration: 1 }, "-=0.7");

	if (visual) {
		gsap.to(visual, {
			y: -14,
			duration: 3,
			yoyo: true,
			repeat: -1,
			ease: "sine.inOut",
			delay: 1.2,
		});
	}
});

mm.add("(prefers-reduced-motion: reduce)", () => {
	const hero = document.getElementById("hero");
	if (!hero) return;
	gsap.set(
		hero.querySelectorAll("h1, p, div[role='img'], div.flex.flex-wrap"),
		{ clearProps: "all" },
	);
});