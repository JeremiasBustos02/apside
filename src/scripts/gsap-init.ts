import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

if (import.meta.env.DEV) {
	(window as { gsap?: typeof gsap }).gsap = gsap;
	(window as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger =
		ScrollTrigger;
}

export { gsap, ScrollTrigger };