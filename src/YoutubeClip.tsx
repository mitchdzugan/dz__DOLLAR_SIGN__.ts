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
      <div className="h-full aspect-[73/60] relative">
        <div
          className={cn(
            "absolute top-0 left-0 w-[100%] h-[100%]",
            "flex flex-col items-stretch",
          )}
        >
          <div
            className={cn(
              "absolute z-1 bg-black top-0 left-0 w-full h-full",
              "*:h-full *:w-full",
            )}
          >
            <div ref={this.ref} />
          </div>
          <div
            className={cn(
              "transition duration-300 transition-opacity",
              "absolute z-2 bg-black top-0 left-0 w-full h-full",
              "flex items-center justify-center",
              this.state.isOn ? "opacity-0" : "opacity-100",
            )}
          >
            <div className="animate-jump animate-infinite">
              <div className="skeleton h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function Clip(props: YoutubeClipProps) {
  return <YoutubeClipImpl key={`YTC:${props.ytId}`} {...props} />;
}

type ResizableClipProps = YoutubeClipProps & {
  clipCn?: string | null | undefined;
  children?: undefined | null | ReactNode | ReactNode[];
};
function ResizableClip(props: ResizableClipProps) {
  const { children, clipCn, ...youtubeProps } = props;
  return (
    <div className="flex-1 min-h-0 flex flex-col items-stretch relative">
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
        className={cn(
          "min-h-56 h-56 sm:h-72 sm:min-h-72 flex flex-row",
          "justify-center bg-gray-800",
          clipCn || "",
        )}
        handleComponent={{
          bottom: (
            <div
              className={cn(
                "bg-base-300 border border-1 border-base-100 rounded-sm",
                "h-5 w-full p-0 flex flex-row items-center justify-center",
                "absolute -top-2 left-0 text-neutral",
              )}
            >
              ☶
            </div>
          ),
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
