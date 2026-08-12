import { gsap } from "./gsap-init";

const mm = gsap.matchMedia();

function openModal(id: string) {
	const modal = document.querySelector<HTMLElement>(
		`[data-team-modal="${CSS.escape(id)}"]`,
	);
	if (!modal) return;

	const backdrop = modal.querySelector<HTMLElement>("[data-team-backdrop]");
	const panel = modal.querySelector<HTMLElement>("[data-team-panel]");

	modal.classList.remove("hidden");
	document.body.style.overflow = "hidden";

	if (mm.reducedMotion) {
		if (backdrop) backdrop.style.opacity = "1";
		if (panel) panel.style.opacity = "1";
		modal.querySelector<HTMLElement>("[data-team-close]")?.focus();
		return;
	}

	gsap.fromTo(
		backdrop,
		{ autoAlpha: 0 },
		{ autoAlpha: 1, duration: 0.3, ease: "power2.out" },
	);
	gsap.fromTo(
		panel,
		{ autoAlpha: 0, scale: 0.95, y: 16 },
		{
			autoAlpha: 1,
			scale: 1,
			y: 0,
			duration: 0.4,
			ease: "back.out(1.4)",
		},
	);
	modal.querySelector<HTMLElement>("[data-team-close]")?.focus();
}

function closeModal(modal: HTMLElement) {
	const backdrop = modal.querySelector<HTMLElement>("[data-team-backdrop]");
	const panel = modal.querySelector<HTMLElement>("[data-team-panel]");
	const id = modal.dataset.teamModal;

	const finish = () => {
		modal.classList.add("hidden");
		document.body.style.overflow = "";
		if (id) {
			document
				.querySelector<HTMLElement>(`[data-team-open="${CSS.escape(id)}"]`)
				?.focus();
		}
	};

	if (mm.reducedMotion) {
		if (backdrop) backdrop.style.opacity = "";
		if (panel) panel.style.opacity = "";
		finish();
		return;
	}

	gsap.to(backdrop, {
		autoAlpha: 0,
		duration: 0.2,
		ease: "power2.in",
		onComplete: finish,
	});
	gsap.to(panel, {
		autoAlpha: 0,
		scale: 0.95,
		y: 16,
		duration: 0.2,
		ease: "power2.in",
	});
}

document.addEventListener("click", (e) => {
	const target = e.target as HTMLElement;
	const openBtn = target.closest<HTMLElement>("[data-team-open]");
	if (openBtn) {
		openModal(openBtn.dataset.teamOpen ?? "");
		return;
	}
	const closeBtn = target.closest<HTMLElement>("[data-team-close]");
	const backdrop = target.closest<HTMLElement>("[data-team-backdrop]");
	if (closeBtn || backdrop) {
		const modal = target.closest<HTMLElement>("[data-team-modal]");
		if (modal) closeModal(modal);
	}
});

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		const openModalEl = document.querySelector<HTMLElement>(
			"[data-team-modal]:not(.hidden)",
		);
		if (openModalEl) closeModal(openModalEl);
	}
});

mm.add("(prefers-reduced-motion: no-preference)", () => {
	gsap.utils.toArray<HTMLElement>("[data-team-open]").forEach((trigger) => {
		const card = trigger.closest<HTMLElement>("[data-team-card]");
		if (!card) return;

		const hoverTween = gsap.to(card, {
			y: -6,
			scale: 1.02,
			duration: 0.25,
			ease: "power2.out",
			boxShadow: "0 10px 30px -10px rgba(9,24,33,0.25)",
			paused: true,
		});

		card.addEventListener("mouseenter", () => hoverTween.play());
		card.addEventListener("mouseleave", () => hoverTween.reverse());
	});
});