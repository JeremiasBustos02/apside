import { gsap } from "./gsap-init";

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
	const section = document.getElementById("proceso");
	if (!section) return;

	const line = section.querySelector<HTMLElement>("[data-timeline-line]");
	const nodes = section.querySelectorAll<HTMLElement>("[data-timeline-node]");
	const cards = section.querySelectorAll<HTMLElement>(".timeline-card");

	if (line) {
		const lineTween = gsap.fromTo(
			line,
			{ scaleY: 0 },
			{
				scaleY: 1,
				ease: "none",
				transformOrigin: "top center",
				scrollTrigger: {
					trigger: section,
					start: "top 60%",
					end: "bottom 60%",
					scrub: 0.6,
				},
			},
		);
		return lineTween;
	}

	gsap.utils.toArray<HTMLElement>(nodes).forEach((node) => {
		gsap.fromTo(
			node,
			{ scale: 0 },
			{
				scale: 1,
				duration: 0.5,
				ease: "back.out(1.7)",
				scrollTrigger: {
					trigger: node,
					start: "top 85%",
					toggleActions: "play none none none",
				},
			},
		);
	});

	gsap.utils.toArray<HTMLElement>(cards).forEach((card) => {
		gsap.from(card, {
			y: 32,
			autoAlpha: 0,
			duration: 0.7,
			ease: "power2.out",
			scrollTrigger: {
				trigger: card,
				start: "top 88%",
				toggleActions: "play none none none",
			},
		});
	});
});

mm.add("(prefers-reduced-motion: reduce)", () => {
	const section = document.getElementById("proceso");
	if (!section) return;
	const line = section.querySelector<HTMLElement>("[data-timeline-line]");
	if (line) line.style.transform = "scaleY(1)";
	gsap.set(section.querySelectorAll("[data-timeline-node]"), { scale: 1 });
	gsap.set(section.querySelectorAll(".timeline-card"), { clearProps: "all" });
});