import { ReactNode } from "react";
import * as react_jsx_runtime0 from "react/jsx-runtime";

//#region src/YoutubeClip.d.ts
type YoutubeClipProps = {
  start: number;
  length: number;
  id: string;
  ytId: string;
  cnExtra?: string | undefined;
  hideOffscreen?: boolean | undefined;
  loadingIndicator?: ReactNode | undefined;
};
declare function Clip(props: YoutubeClipProps): react_jsx_runtime0.JSX.Element;
type ResizableClipProps = YoutubeClipProps & {
  clipCn?: string | null | undefined;
  children?: undefined | null | ReactNode | ReactNode[];
  handle?: undefined | null | ReactNode | ReactNode[];
};
declare function ResizableClip(props: ResizableClipProps): react_jsx_runtime0.JSX.Element;
//#endregion
export { Clip, ResizableClip, ResizableClipProps, YoutubeClipProps };