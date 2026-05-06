import { Component, createRef, type ReactNode } from "react";
import cn from "classnames";
import { Resizable } from "re-resizable";
import type { YouTubePlayer } from "youtube-player/dist/types.js";
import YouTubePlayerImport from "youtube-player";
import { onInterrupt, type InterruptUtil } from "./interrupt.js";

export type YoutubeClipProps = {
  start: number;
  length: number;
  id: string;
  ytId: string;
  cnExtra?: string | undefined;
  hideOffscreen?: boolean | undefined;
  loadingIndicator?: ReactNode | undefined;
};

const mkYtPlayer: (...a: any[]) => YouTubePlayer = YouTubePlayerImport as any;

const stateNames: Record<number, string> = {
  [-1]: "unstarted",
  0: "ended",
  1: "playing",
  2: "paused",
  3: "buffering",
  5: "video cued",
};

class YoutubeClipImpl extends Component<YoutubeClipProps> {
  ref = createRef<HTMLDivElement | null>();
  #mruProps: YoutubeClipProps;
  #player: YouTubePlayer | null = null;
  #offFn: () => void;
  state: { isOn: boolean };

  constructor(props: YoutubeClipProps) {
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

  getPlayer(util: InterruptUtil): YouTubePlayer | null {
    const player = this.#player;
    if (player) {
      return player;
    }

    const ytEl = this.ref?.current;
    if (!ytEl) {
      return null;
    }

    const startFrame = (this.#mruProps || this.props).start;
    const start = startFrame / 60;
    this.#player = util.addYt(() =>
      mkYtPlayer(ytEl, {
        videoId: this.#mruProps.ytId,
        playerVars: {
          autoplay: "1",
          mute: "1",
          playsinline: "1",
          start: `${Math.floor(start)}`,
          enablejsapi: "1",
          cc_load_policy: "3",
          loop: "0",
        },
      }),
    );
    if (this.#player) {
      this.setState({ isOn: true });
    }
    return this.#player;
  }

  async onTimeUpdate(util: InterruptUtil) {
    const player = this.getPlayer(util);
    if (!player) {
      return;
    }
    const startFrame = (this.#mruProps || this.props).start;
    const frameLength = (this.#mruProps || this.props).length;
    const start = startFrame / 60;
    const end = (startFrame + frameLength + 180) / 60;
    const currentTime = await player.getCurrentTime();
    if (currentTime < start || currentTime > end) {
      await player.seekTo(start, true);
    }
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

  componentDidMount(): void {
    this.onUpdate();
  }

  componentDidUpdate(): void {
    this.onUpdate();
  }

  componentWillUnmount() {
    this.off();
  }

  render() {
    return (
      <div
        data-dz-component="youtube-clip"
        style={{ height: "100%", aspectRatio: "73/60", position: "relative" }}
      >
        <style>
          {`
[data-dz-component="youtube-clip"] [data-dz-class="maximize-children"] > * {
  height: 100%;
  width: 100%;
}
          `}
        </style>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <div
            data-dz-class="maximize-children"
            style={{
              background: "black",
              position: "absolute",
              zIndex: 1,
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <div ref={this.ref} />
          </div>
          <div
            style={{
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
            }}
          >
            {this.props.loadingIndicator || null}
          </div>
        </div>
      </div>
    );
  }
}

export function Clip(props: YoutubeClipProps) {
  return <YoutubeClipImpl key={`YTC:${props.ytId}`} {...props} />;
}

export type ResizableClipProps = YoutubeClipProps & {
  clipCn?: string | null | undefined;
  children?: undefined | null | ReactNode | ReactNode[];
  handle?: undefined | null | ReactNode | ReactNode[];
};
export function ResizableClip(props: ResizableClipProps) {
  const { children, clipCn, ...youtubeProps } = props;
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        minHeight: 0,
        flexDirection: "column",
        alignItems: "stretch",
        position: "relative",
      }}
    >
      <Resizable
        enable={{
          top: false,
          right: false,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        defaultSize={{ height: 0 }}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
        className={clipCn || ""}
        handleComponent={{
          bottom: <>{props.handle || <span>☶</span>}</>,
        }}
      >
        <div
          className={cn(
            "relative flex-1 flex items-center justify-center mb-[2rem]",
            "mb-[calc(5px+0.5rem)]",
          )}
        >
          <Clip {...youtubeProps} />
        </div>
      </Resizable>
      <div className="relative min-h-0 flex-1 mt-2">{children || null}</div>
    </div>
  );
}
