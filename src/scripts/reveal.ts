import { gsap, ScrollTrigger } from "./gsap-init";

const mm = gsap.matchMedia();

const ITEM_SELECTOR = "[data-reveal]";
const GROUP_SELECTOR = "[data-reveal-group]";

const revealEntries: { el: Element; play: () => void }[] = [];

mm.add("(prefers-reduced-motion: no-preference)", () => {
	const items = gsap.utils.toArray<HTMLElement>(ITEM_SELECTOR);

	items.forEach((item) => {
		gsap.set(item, { autoAlpha: 0, y: 40 });
		const tween = gsap.to(item, {
			autoAlpha: 1,
			y: 0,
			duration: 0.8,
			ease: "power2.out",
			paused: true,
			scrollTrigger: {
				trigger: item,
				start: "top 85%",
				toggleActions: "play none none none",
				invalidateOnRefresh: true,
			},
		});
		revealEntries.push({ el: item, play: () => tween.play() });
	});

	const groups = gsap.utils.toArray<HTMLElement>(GROUP_SELECTOR);

	groups.forEach((group) => {
		const children = Array.from(group.children) as HTMLElement[];
		gsap.set(children, { autoAlpha: 0, y: 40 });
		const tween = gsap.to(children, {
			autoAlpha: 1,
			y: 0,
			duration: 0.7,
			stagger: 0.12,
			ease: "power2.out",
			paused: true,
			scrollTrigger: {
				trigger: group,
				start: "top 85%",
				toggleActions: "play none none none",
				invalidateOnRefresh: true,
			},
		});
		revealEntries.push({ el: group, play: () => tween.play() });
	});
});

mm.add("(prefers-reduced-motion: reduce)", () => {
	gsap.set(`${ITEM_SELECTOR}, ${GROUP_SELECTOR} > *, ${GROUP_SELECTOR}`, {
		clearProps: "all",
	});
});

const refreshWhenReady = () => {
	gsap.utils.toArray<HTMLImageElement>("img").forEach((img) => {
		if (!img.complete) {
			img.addEventListener("load", () => ScrollTrigger.refresh(), {
				once: true,
			});
		}
	});
	document.fonts.ready.then(() => ScrollTrigger.refresh());
	window.addEventListener("load", () => ScrollTrigger.refresh());
};

const guard = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			const entryInfo = revealEntries.find((r) => r.el === entry.target);
			if (entryInfo) {
				entryInfo.play();
				guard.unobserve(entry.target);
			}
		});
	},
	{ rootMargin: "140px 0px", threshold: 0.01 },
);

revealEntries.forEach((entry) => guard.observe(entry.el));

refreshWhenReady();