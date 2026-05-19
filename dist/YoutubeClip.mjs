import { Component, createRef } from "react";
import { Resizable } from "re-resizable";
import "youtube-player";
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
		return !this.#lastYtAdd || now - 1500 > this.#lastYtAdd;
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
var YoutubeClipImpl = class extends Component {
	ref = createRef();
	#mruProps;
	#player = null;
	#offFn;
	#didStart = false;
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
		return this.ref.current?.plyr || null;
	}
	async onTimeUpdate(util) {
		if (!this.state.isOn) util.addYt(() => {
			this.setState({ isOn: true });
		});
		const player = this.getPlayer(util);
		if (!player) return;
		const startFrame = (this.#mruProps || this.props).start;
		const frameLength = (this.#mruProps || this.props).length;
		const start = startFrame / 60;
		const end = (startFrame + frameLength + 180) / 60;
		function afterEnd(n) {
			return frameLength > 0 && n > end;
		}
		player.muted = true;
		const currentTime = player.currentTime;
		if (currentTime < start || afterEnd(currentTime)) player.currentTime = start;
		if (!player.playing && !this.#didStart) {
			this.#didStart = true;
			player.play();
		} else if (player.ended) {
			this.#didStart = true;
			player.currentTime = start;
			player.play();
		} else if (!player.playing && Math.abs(player.duration - player.currentTime) < 1) {
			this.#didStart = true;
			player.currentTime = start;
			player.play();
		}
	}
	async onUpdate() {
		this.#mruProps = this.props;
		const interruptOff = onInterrupt((util) => this.onTimeUpdate(util));
		this.#offFn = () => {
			interruptOff();
			(this.#player || { async destroy() {} }).destroy().then(() => console.log("video off"));
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
		return /* @__PURE__ */ jsxs("div", {
			"data-dz-component": "youtube-clip",
			style: {
				height: "100%",
				aspectRatio: "73/60",
				position: "relative"
			},
			children: [/* @__PURE__ */ jsx("style", { children: `
[data-dz-component="youtube-clip"] [data-dz-class="maximize-children"] > * {
  height: 100%;
  width: 100%;
}
          ` }), /* @__PURE__ */ jsxs("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "stretch"
				},
				children: [/* @__PURE__ */ jsx("div", {
					"data-dz-class": "maximize-children",
					style: {
						background: "black",
						position: "absolute",
						zIndex: 1,
						top: 0,
						left: 0,
						width: "100%",
						height: "100%"
					},
					children: !this.state.isOn ? null : /* @__PURE__ */ jsx(Plyr, {
						crossOrigin: "anonymous",
						controls: true,
						ref: this.ref,
						autoPlay: true,
						muted: true,
						className: "plyr-react plyr",
						source: {
							type: "video",
							sources: [{
								src: this.#mruProps.ytId,
								provider: "youtube"
							}]
						},
						options: {
							controls: [],
							hideControls: true,
							youtube: {
								autoplay: true,
								controls: 1,
								enablejsapi: 1,
								modestbranding: 1,
								rel: 0
							}
						}
					})
				}), /* @__PURE__ */ jsx("div", {
					style: {
						transition: "opacity 300 ease-in-out",
						opacity: this.state.isOn ? 0 : 100,
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						zIndex: 2,
						background: "black",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						pointerEvents: "none"
					},
					children: this.props.loadingIndicator || null
				})]
			})]
		});
	}
};
function Clip(props) {
	return /* @__PURE__ */ jsx(YoutubeClipImpl, { ...props }, `YTC:${props.ytId}`);
}
function ResizableClip(props) {
	const { children, clipCn, ...youtubeProps } = props;
	return /* @__PURE__ */ jsxs("div", {
		style: {
			flex: 1,
			display: "flex",
			minHeight: 0,
			flexDirection: "column",
			alignItems: "stretch",
			position: "relative"
		},
		children: [/* @__PURE__ */ jsx(Resizable, {
			enable: {
				top: false,
				right: false,
				bottom: true,
				left: false,
				topRight: false,
				bottomRight: false,
				bottomLeft: false,
				topLeft: false
			},
			defaultSize: { height: props.defaultHeight || 0 },
			style: {
				display: "flex",
				flexDirection: "row",
				justifyContent: "center"
			},
			className: clipCn || "",
			handleComponent: { bottom: /* @__PURE__ */ jsx(Fragment, { children: props.handle || /* @__PURE__ */ jsx("span", { children: "☶" }) }) },
			children: /* @__PURE__ */ jsx("div", {
				style: {
					position: "relative",
					flex: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				},
				children: /* @__PURE__ */ jsx(Clip, { ...youtubeProps })
			})
		}), /* @__PURE__ */ jsx("div", {
			style: {
				position: "relative",
				minHeight: 0,
				flex: 1
			},
			className: props.childrenCn || "",
			children: children || null
		})]
	});
}
//#endregion
export { Clip, ResizableClip };
