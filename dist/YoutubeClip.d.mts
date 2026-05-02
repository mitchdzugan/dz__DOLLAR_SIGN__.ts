import * as react_jsx_runtime0 from "react/jsx-runtime";

//#region src/YoutubeClip.d.ts
type YoutubeClipProps = {
  start: number;
  length: number;
  id: string;
  ytId: string;
  cnExtra?: string | undefined;
  hideOffscreen?: boolean | undefined;
};
declare function Clip(props: YoutubeClipProps): react_jsx_runtime0.JSX.Element;
//#endregion
export { Clip, YoutubeClipProps };