import { gsap } from "./gsap-init";

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
	const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");

	items.forEach((item) => {
		gsap.from(item, {
			y: 40,
			autoAlpha: 0,
			duration: 0.8,
			ease: "power2.out",
			scrollTrigger: {
				trigger: item,
				start: "top 85%",
				toggleActions: "play none none none",
			},
		});
	});

	const groups = gsap.utils.toArray<HTMLElement>("[data-reveal-group]");
	groups.forEach((group) => {
		gsap.from(group.children, {
			y: 40,
			autoAlpha: 0,
			duration: 0.7,
			stagger: 0.12,
			ease: "power2.out",
			scrollTrigger: {
				trigger: group,
				start: "top 85%",
				toggleActions: "play none none none",
			},
		});
	});
});

mm.add("(prefers-reduced-motion: reduce)", () => {
	gsap.set("[data-reveal], [data-reveal-group]", { clearProps: "all" });
});