import { gsap } from "./gsap-init";

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
	const hero = document.getElementById("hero");
	if (!hero) return;

	const title = hero.querySelector<HTMLElement>("h1");
	const subtitle = hero.querySelector<HTMLElement>("p");

	const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
	if (title) entrance.from(title, { y: 48, autoAlpha: 0, duration: 0.9 });
	if (subtitle)
		entrance.from(subtitle, { y: 32, autoAlpha: 0, duration: 0.8 }, "-=0.5");

	const content = hero.querySelector<HTMLElement>("[data-hero-fade]");
	if (content) {
		gsap.to(content, {
			autoAlpha: 0,
			scale: 0.95,
			ease: "none",
			scrollTrigger: {
				trigger: hero,
				start: "top top",
				end: "bottom top",
				scrub: true,
			},
		});
	}
});

mm.add("(prefers-reduced-motion: reduce)", () => {
	const hero = document.getElementById("hero");
	if (!hero) return;
	gsap.set(hero.querySelectorAll("h1, p"), { clearProps: "all" });
});