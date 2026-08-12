import { gsap } from "./gsap-init";

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
	const layers = gsap.utils.toArray<HTMLElement>("[data-parallax]");

	layers.forEach((el) => {
		const speed = parseFloat(el.dataset.parallax ?? "0.3");
		gsap.fromTo(
			el,
			{ y: 0 },
			{
				y: () => -speed * 140,
				ease: "none",
				scrollTrigger: {
					trigger: el,
					start: "top bottom",
					end: "bottom top",
					scrub: true,
				},
			},
		);
	});
});