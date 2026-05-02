import { Component, createRef } from "react";
import cn from "classnames";
import "re-resizable";
import YouTubePlayerImport from "youtube-player";
import { jsx, jsxs } from "react/jsx-runtime";

//#region src/interrupt.ts
let nextInterruptId = 1;
let intervalId = null;
var UtilClass = class {
	#manager;
	constructor(manager) {
		this.#manager = manager;
	}
	addYt(f) {
		return this.#manager.addYt(f);
	}
};
const handlers = {};
var InterruptManager = class {
	#lastYtAdd = null;
	constructor() {}
	get canAddYt() {
		const now = Date.now();
		return !this.#lastYtAdd || now - 4500 > this.#lastYtAdd;
	}
	addYt(f) {
		if (!this.canAddYt) return null;
		this.#lastYtAdd = Date.now();
		return f();
	}
	reset() {}
};
async function interruptHandler(manager) {
	manager.reset();
	const util = new UtilClass(manager);
	await Promise.all(Object.values(handlers).map((f) => f(util)));
}
function ensureIntervalOn() {
	if (intervalId !== null) return;
	const manager = new InterruptManager();
	intervalId = setInterval(() => interruptHandler(manager), 1e3);
}
function onInterrupt(f) {
	const interruptId = nextInterruptId++;
	handlers[interruptId] = f;
	ensureIntervalOn();
	return () => {
		delete handlers[interruptId];
	};
}

//#endregion
//#region src/YoutubeClip.tsx
const mkYtPlayer = YouTubePlayerImport;
var YoutubeClipImpl = class extends Component {
	ref = createRef();
	#mruProps;
	#player = null;
	#offFn;
	state;
	constructor(props) {
		super(props);
		this.#mruProps = props;
		this.#offFn = () => {};
		this.state = { isOn: false };
	}
	off() {
		const offFn = this.#offFn;
		this.#offFn = () => {};
		offFn();
	}
	getPlayer(util) {
		const player = this.#player;
		if (player) return player;
		const ytEl = this.ref?.current;
		if (!ytEl) return null;
		const startFrame = (this.#mruProps || this.props).start;
		const start = startFrame / 60;
		this.#player = util.addYt(() => mkYtPlayer(ytEl, {
			videoId: this.#mruProps.ytId,
			playerVars: {
				autoplay: "1",
				mute: "1",
				playsinline: "1",
				start: `${Math.floor(start)}`,
				enablejsapi: "1",
				cc_load_policy: "3",
				loop: "0"
			}
		}));
		if (this.#player) this.setState({ isOn: true });
		return this.#player;
	}
	async onTimeUpdate(util) {
		const player = this.getPlayer(util);
		if (!player) return;
		const startFrame = (this.#mruProps || this.props).start;
		const frameLength = (this.#mruProps || this.props).length;
		const start = startFrame / 60;
		const end = (startFrame + frameLength + 180) / 60;
		const currentTime = await player.getCurrentTime();
		if (currentTime < start || currentTime > end) await player.seekTo(start, true);
	}
	async onUpdate() {
		this.#mruProps = this.props;
		const interruptOff = onInterrupt((util) => this.onTimeUpdate(util));
		this.#offFn = () => {
			interruptOff();
			const player = this.#player || { async destroy() {} };
			player.destroy().then(() => console.log("video off"));
		};
	}
	componentDidMount() {
		this.onUpdate();
	}
	componentDidUpdate() {
		this.onUpdate();
	}
	componentWillUnmount() {
		this.off();
	}
	render() {
		return /* @__PURE__ */ jsx("div", {
			className: "h-full aspect-[73/60] relative",
			children: /* @__PURE__ */ jsxs("div", {
				className: cn("absolute top-0 left-0 w-[100%] h-[100%]", "flex flex-col items-stretch"),
				children: [/* @__PURE__ */ jsx("div", {
					className: cn("absolute z-1 bg-black top-0 left-0 w-full h-full", "*:h-full *:w-full"),
					children: /* @__PURE__ */ jsx("div", { ref: this.ref })
				}), /* @__PURE__ */ jsx("div", {
					className: cn("transition duration-300 transition-opacity", "absolute z-2 bg-black top-0 left-0 w-full h-full", "flex items-center justify-center", this.state.isOn ? "opacity-0" : "opacity-100"),
					children: /* @__PURE__ */ jsx("div", {
						className: "animate-jump animate-infinite",
						children: /* @__PURE__ */ jsx("div", { className: "skeleton h-8 w-8 rounded-full" })
					})
				})]
			})
		});
	}
};
function Clip(props) {
	return /* @__PURE__ */ jsx(YoutubeClipImpl, { ...props }, `YTC:${props.ytId}`);
}

//#endregion
export { Clip };