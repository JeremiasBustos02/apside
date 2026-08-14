interface PaletteEntry {
	varName: string;
	alpha: number;
}

const BASE_ALPHA = 0.12;

const PALETTES: Record<"ink", PaletteEntry[]> = {
	ink: [{ varName: "--color-primary", alpha: BASE_ALPHA }],
};

interface TopoState {
	amplitude: number;
	density: number;
	speed: number;
	distortion: number;
	intensity: number;
}

const DEFAULT_STATE: TopoState = {
	amplitude: 1,
	density: 1,
	speed: 1,
	distortion: 1,
	intensity: 1,
};

const STATE_KEYS: (keyof TopoState)[] = [
	"amplitude",
	"density",
	"speed",
	"distortion",
	"intensity",
];

const STATE_LERP = 3;
const STATE_EPSILON = 0.0005;

interface TopoCanvas {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	palette: PaletteEntry[];
	width: number;
	height: number;
	visible: boolean;
	hasCursor: boolean;
	infl: boolean;
	cursorX: number;
	cursorY: number;
	targetX: number;
	targetY: number;
	state: { current: TopoState; target: TopoState };
	lastTime: number;
}

const instances: TopoCanvas[] = [];
const byCanvas = new Map<HTMLCanvasElement, TopoCanvas>();

const SPEED = 0.2;

const reduced = window.matchMedia(
	"(prefers-reduced-motion: reduce)",
).matches;

const rootStyle = getComputedStyle(document.documentElement);
const resolved: Record<string, string> = {};
for (const entry of Object.values(PALETTES).flat()) {
	if (!resolved[entry.varName]) {
		resolved[entry.varName] =
			rootStyle.getPropertyValue(entry.varName).trim() || "#000000";
	}
}

const HIGHLIGHT_COLOR = "--color-ink";
if (!resolved[HIGHLIGHT_COLOR]) {
	resolved[HIGHLIGHT_COLOR] =
		rootStyle.getPropertyValue(HIGHLIGHT_COLOR).trim() || "#091821";
}

let running = false;
let pointer = { x: 0, y: 0, fine: false };

window.addEventListener(
	"pointermove",
	(e) => {
		if (e.pointerType !== "mouse") return;
		pointer.x = e.clientX;
		pointer.y = e.clientY;
		pointer.fine = true;
	},
	{ passive: true },
);

function setup(tc: TopoCanvas) {
	const rect = tc.canvas.getBoundingClientRect();
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const width = Math.max(1, Math.round(rect.width));
	const height = Math.max(1, Math.round(rect.height));

	if (
		tc.canvas.width !== width * dpr ||
		tc.canvas.height !== height * dpr
	) {
		tc.canvas.width = width * dpr;
		tc.canvas.height = height * dpr;
		tc.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	tc.width = width;
	tc.height = height;
}

function hash01(n: number) {
	const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
	return s - Math.floor(s);
}

function smoothstep(edge0: number, edge1: number, x: number) {
	const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
	return t * t * (3 - 2 * t);
}

function contentFade(nx: number) {
	return smoothstep(0.14, 0.34, nx) * (1 - smoothstep(0.66, 0.86, nx));
}

function noise1(x: number) {
	const xi = Math.floor(x);
	const xf = x - xi;
	const a = hash01(xi);
	const b = hash01(xi + 1);
	return a + (b - a) * (xf * xf * (3 - 2 * xf));
}

function rgba(hex: string, alpha: number) {
	const value = hex.replace("#", "");
	const normalized =
		value.length === 3
			? value
					.split("")
					.map((c) => c + c)
					.join("")
			: value;
	const int = parseInt(normalized, 16);
	return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

function updateCursor(tc: TopoCanvas) {
	const rect = tc.canvas.getBoundingClientRect();
	const inside =
		pointer.fine &&
		pointer.x >= rect.left &&
		pointer.x <= rect.right &&
		pointer.y >= rect.top &&
		pointer.y <= rect.bottom;

	tc.hasCursor = inside;
	if (inside) {
		tc.targetX = pointer.x - rect.left;
		tc.targetY = pointer.y - rect.top;
	}

	tc.cursorX += (tc.targetX - tc.cursorX) * 0.12;
	tc.cursorY += (tc.targetY - tc.cursorY) * 0.12;
	tc.infl = tc.hasCursor;
}

function setLineStyle(
	tc: TopoCanvas,
	style: string | CanvasGradient,
	depth: number,
	widthScale = 1,
) {
	const { ctx } = tc;
	ctx.strokeStyle = style;
	ctx.lineWidth = (0.7 + depth * 1.6) * widthScale;
	ctx.lineCap = "round";
}

function linePointY(
	tc: TopoCanvas,
	i: number,
	x: number,
	time: number,
	lineCount: number,
) {
	const { height } = tc;
	const f = (i + 0.5) / lineCount;
	const yBase = height * (0.05 + 0.9 * f);
	const depth = hash01(i * 3.1 + 911);
	const state = tc.state.current;
	const amp =
		height *
		0.03 *
		(0.45 + 0.3 * (1 - Math.abs(f - 0.5) * 2)) *
		(0.8 + depth * 0.4) *
		state.amplitude;

	const rnd = hash01(i);
	const rnd2 = hash01(i + 137);
	const rnd3 = hash01(i * 1.7 + 57);

	const freq1 = (2 * Math.PI * (1.5 + rnd * 3)) / tc.width;
	const freq2 = (2 * Math.PI * (6 + rnd2 * 8)) / tc.width;
	const w1 = (0.8 + rnd3 * 0.8) * SPEED * state.speed;
	const w2 = -(1.2 + rnd2 * 1.2) * SPEED * state.speed;
	const phase1 = i * 0.9 + rnd * Math.PI * 2;
	const phase2 = i * 1.7 + rnd2 * Math.PI * 2;

	return (
		yBase +
		amp *
			(0.7 * Math.sin(x * freq1 + time * w1 + phase1) +
				0.3 * Math.sin(x * freq2 + time * w2 + phase2)) +
		height *
			0.012 *
			(noise1(x * 0.01 + i * 7.3 + time * 0.15) - 0.5) *
			2 *
			state.distortion
	);
}

function traceLine(
	ctx: CanvasRenderingContext2D,
	tc: TopoCanvas,
	i: number,
	time: number,
	lineCount: number,
	step: number,
) {
	const width = tc.width;
	ctx.beginPath();
	let prevX = 0;
	let prevY = 0;
	let started = false;
	for (let x = 0; x <= width; x += step) {
		const y = linePointY(tc, i, x, time, lineCount);
		if (!started) {
			ctx.moveTo(x, y);
			prevX = x;
			prevY = y;
			started = true;
		} else {
			ctx.quadraticCurveTo(prevX, prevY, (prevX + x) / 2, (prevY + y) / 2);
			prevX = x;
			prevY = y;
		}
	}
	if (started) ctx.lineTo(prevX, prevY);
}

function drawHighlight(
	tc: TopoCanvas,
	time: number,
) {
	const { ctx } = tc;
	const width = tc.width;
	const height = tc.height;

	const step = Math.max(8, Math.round(width / 120));
	const lineCount = Math.max(10, Math.round(tc.height / 62));

	const R = width * 0.15;
	const g = ctx.createRadialGradient(
		tc.cursorX,
		tc.cursorY,
		0,
		tc.cursorX,
		tc.cursorY,
		R,
	);
	g.addColorStop(0, rgba(resolved[HIGHLIGHT_COLOR], 0.2));
	g.addColorStop(0.8, rgba(resolved[HIGHLIGHT_COLOR], 0));

	ctx.globalAlpha = 1;
	ctx.globalCompositeOperation = "source-over";

	for (let i = 0; i < lineCount; i++) {
		const yCenter = height * (0.05 + 0.9 * ((i + 0.5) / lineCount));
		if (Math.abs(yCenter - tc.cursorY) > R * 1.2) continue;

		const depth = hash01(i * 3.1 + 911);
		setLineStyle(tc, g, depth, 1.5);
		traceLine(ctx, tc, i, time, lineCount, step);
		ctx.stroke();
	}
}

function drawBaseLines(
	tc: TopoCanvas,
	time: number,
	style: string | CanvasGradient,
	lineAlpha: (depth: number) => number,
) {
	const { ctx } = tc;
	const width = tc.width;

	const step = Math.max(8, Math.round(width / 120));
	const lineCount = Math.max(
		10,
		Math.round((tc.height / 62) * tc.state.current.density),
	);

	for (let i = 0; i < lineCount; i++) {
		const depth = hash01(i * 3.1 + 911);
		setLineStyle(tc, style, depth);
		ctx.globalAlpha = lineAlpha(depth) * tc.state.current.intensity;
		traceLine(ctx, tc, i, time, lineCount, step);
		ctx.stroke();
	}
}

function draw(tc: TopoCanvas, time: number) {
	const { ctx } = tc;
	const width = tc.width;
	const height = tc.height;

	ctx.clearRect(0, 0, width, height);

	const entry = tc.palette[0];
	const base = resolved[entry.varName] || "#000000";

	const fade = ctx.createLinearGradient(0, 0, width, 0);
	const FADE_SAMPLES = 40;
	for (let s = 0; s <= FADE_SAMPLES; s++) {
		const nx = s / FADE_SAMPLES;
		fade.addColorStop(nx, rgba(base, 1 - 0.55 * contentFade(nx)));
	}

	drawBaseLines(
		tc,
		time,
		fade,
		(depth) => entry.alpha * (0.45 + depth * 0.55),
	);

	if (tc.infl) {
		drawHighlight(tc, time);
	}

	ctx.globalAlpha = 1;
	ctx.globalCompositeOperation = "source-over";
}

function frame(now: number) {
	let anyDrawn = false;

	for (const tc of instances) {
		if (!tc.visible || reduced) continue;
		anyDrawn = true;
		updateCursor(tc);
		lerpState(tc, now);
		draw(tc, now / 1000);
	}

	if (anyDrawn) {
		requestAnimationFrame(frame);
	} else {
		running = false;
	}
}

function ensureLoop() {
	if (running || reduced) return;
	running = true;
	requestAnimationFrame(frame);
}

function lerpState(tc: TopoCanvas, now: number) {
	const { current, target } = tc.state;
	if (!tc.lastTime) tc.lastTime = now;
	const dt = Math.min(0.1, (now - tc.lastTime) / 1000);
	tc.lastTime = now;
	const k = 1 - Math.exp(-STATE_LERP * dt);
	for (const key of STATE_KEYS) {
		current[key] += (target[key] - current[key]) * k;
	}
}

const io = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			const tc = byCanvas.get(entry.target as HTMLCanvasElement);
			if (!tc) continue;
			tc.visible = entry.isIntersecting;
			if (entry.isIntersecting) {
				if (reduced) {
					setup(tc);
					draw(tc, 0);
				} else {
					setup(tc);
					ensureLoop();
				}
			}
		}
	},
	{ rootMargin: "120px 0px" },
);

const ro = new ResizeObserver((entries) => {
	for (const entry of entries) {
		const tc = byCanvas.get(entry.target as HTMLCanvasElement);
		if (!tc) continue;
		setup(tc);
		if (reduced) {
			draw(tc, 0);
		} else if (tc.visible) {
			ensureLoop();
		}
	}
});

document
	.querySelectorAll<HTMLCanvasElement>("[data-topo]")
	.forEach((canvas) => {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const mode: "ink" = (canvas.dataset.topoColor as "ink") || "ink";

		const tc: TopoCanvas = {
			canvas,
			ctx,
			palette: PALETTES[mode],
			width: 0,
			height: 0,
visible: false,
			hasCursor: false,
			infl: false,
			cursorX: 0,
			cursorY: 0,
			targetX: 0,
			targetY: 0,
			state: {
				current: { ...DEFAULT_STATE },
				target: { ...DEFAULT_STATE },
			},
			lastTime: 0,
		};

		byCanvas.set(canvas, tc);
		instances.push(tc);

		setup(tc);

		if (reduced) draw(tc, 0);

		io.observe(canvas);
		ro.observe(canvas);
	});

document.addEventListener("topo:state", (event) => {
	const detail = (event as CustomEvent).detail;
	if (!detail || typeof detail !== "object") return;
	const state = detail.state as Partial<TopoState> | undefined;
	if (!state || typeof state !== "object") return;

	const targetSelector = detail.target as string | undefined;
	const canvases = targetSelector
		? Array.from(
				document.querySelectorAll<HTMLCanvasElement>(targetSelector),
			)
		: Array.from(byCanvas.keys());

	let changed = false;
	for (const canvas of canvases) {
		const tc = byCanvas.get(canvas);
		if (!tc) continue;
		for (const key of STATE_KEYS) {
			const value = state[key];
			if (typeof value !== "number" || !Number.isFinite(value)) continue;
			if (Math.abs(value - tc.state.target[key]) > STATE_EPSILON) {
				tc.state.target[key] = value;
				changed = true;
			}
		}
	}
	if (changed) ensureLoop();
});