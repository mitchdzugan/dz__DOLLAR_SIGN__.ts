import { createElement, useEffect, type ReactNode } from "react";
import { unified } from "unified";
import type { ObjectType, OrgData } from "uniorg";
import uniorgParse from "uniorg-parse";

export function orgParse(s: string): OrgData {
  return unified().use(uniorgParse).parse(s);
}

function mkScroller(headerId: string) {
  return () => {
    const header = document.getElementById(headerId);
    if (header) {
      header.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };
}

function OrgView(props: { orgString: string; headerId?: string }) {
  function onInsert() {
    if (!props.headerId) {
      return;
    }
    mkScroller(props.headerId)();
  }
  function idLink(id: string) {
    return `#${id}`;
  }
  const orgData = orgParse(props.orgString);
  const gameDefs: Record<string, string> = {};
  let sectionDepth: number = 0;
  let nextHeaderId: number = 0;
  function takeHeaderId(): string {
    const id = nextHeaderId++;
    return `h${id}`;
  }
  let headerId: string = takeHeaderId();
  useEffect(() => onInsert(), []);

  type OrgNode = OrgData["children"][number] | ObjectType;

  function orgNode(props: { node: OrgNode }): ReactNode {
    const { node } = props;
    if (node.type === "text" || node.type === "verbatim") {
      return <span>{node.value}</span>;
    } else if (node.type === "org-data") {
      return (
        <section
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          className="section"
        >
          {node.children.map((node) => orgNode({ node }))}
        </section>
      );
    } else if (node.type === "section") {
      sectionDepth++;
      headerId = takeHeaderId();
      const myIdLink = idLink(headerId);
      const myScroller = mkScroller(headerId);
      const children = (
        <section className="flex flex-col gap-2 [&>.section]:mb-8">
          {node.children.map((node) => orgNode({ node }))}
        </section>
      );
      sectionDepth--;
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
          }}
          className="section"
        >
          {
            null /*
          <Link
            onClick={myScroller}
            href={myIdLink ? myIdLink : ""}
            className={cn(
              "mt-8 -mr-4 -mb-4 w-10 border-l-[0.5rem] rounded-4xl",
              "border-b-[0.5rem] rounded-r-none cursor-pointer",
              c6(sectionDepth).bDim,
              c6(sectionDepth).hbBright,
            )}
          />
            */
          }
          <div style={{ flex: "1" }}>{children}</div>
        </div>
      );
    } else if (node.type === "headline") {
      const level = Math.min(6, Math.max(1, node.level));
      const c = c6(node.level - 1);
      const hCnExtra =
        "rounded-box overflow-hidden px-4 py-2 border-1 shadow-md mt-0";
      return createElement(
        `h${level}`,
        { id: headerId, className: cn(c.bContent, c.bgDim, hCnExtra) },
        ...node.children.map((node) => orgNode({ node })),
      );
    } else if (node.type === "paragraph") {
      return (
        <p>
          {node.children
            .flatMap((node) => [<br />, orgNode({ node })])
            .slice(1)}
        </p>
      );
    } else if (node.type === "link") {
      console.log(node);
      return (
        <a href={node.rawLink}>
          {node.children.map((node) => orgNode({ node }))}
        </a>
      );
    } else if (node.type === "horizontal-rule") {
      return <hr />;
    } else if (node.type === "plain-list") {
      const lis = node.children.map((node, nodeInd) => (
        <li key={`org:li-${nodeInd}`}>{orgNode({ node })}</li>
      ));
      return <ul>{lis}</ul>;
    } else if (node.type === "list-item") {
      const lis = node.children.map((node) => orgNode({ node }));
      return <>{lis}</>;
    } else if (node.type === "src-block" && node.language === "pusdb-cmd") {
      const [cmd = "", ...args] = (
        (node as unknown as { parameters: string }).parameters || ""
      ).split(" ");
      if (cmd === "def-game") {
        const [name = "", gameId = ""] = args;
        gameDefs[name] = gameId;
        return null;
      } else if (cmd === "youtube") {
        const [ytId = ""] = args;
        return (
          <div
            className={cn(
              "flex flex-col items-start *:flex-1 self-stretch min-h-34",
            )}
          >
            <ResizableClip
              start={0}
              length={0}
              id={`${ytId}|${args.join("|")}`}
              ytId={ytId}
              hideOffscreen={true}
            />
          </div>
        );
      } else if (cmd === "clip") {
        const [gameRef = "", startStr = "", endStr = ""] = args;
        const gameId = gameDefs[gameRef];
        const ytId = gameId ? ytIds[gameId] : undefined;
        function frameNumOfCStr(clockStr: string): number {
          const [minStr = "", secStr = ""] = clockStr.split(":");
          const minP = parseInt(minStr);
          const minV = Math.min(8, Math.max(0, Number.isNaN(minP) ? 0 : minP));
          const secP = parseFloat(secStr);
          const secV = Math.min(60, Math.max(0, Number.isNaN(secP) ? 0 : secP));
          return ((7 - minV) * 60 + (60 - secV)) * 60;
        }
        const start = frameNumOfCStr(startStr);
        const length = frameNumOfCStr(endStr) - start;
        return (
          <div
            className={cn(
              "flex flex-col items-start *:flex-1 self-stretch min-h-34",
            )}
          >
            <ResizableClip
              start={start}
              length={length}
              id={`${ytId}|${args.join("|")}`}
              ytId={ytId}
              hideOffscreen={true}
            />
          </div>
        );
      }
    }

    return <div>unhandled [ {node.type} ]</div>;
  }

  return (
    <div className="prose prose-p:my-1 max-w-full p-4">
      {orgNode({ node: orgData })}
    </div>
  );
}

type NoteTreeDoc = {
  segment: string;
  key: string;
  sharer: string;
};

type NoteTreeNode = {
  segment: string;
  isSharedRoot?: boolean;
  subnodes: Record<string, NoteTreeNode>;
  docs: Record<string, NoteTreeDoc>;
  sharer: string;
  key: string;
};

function NoteTreeDocUI(props: { doc: NoteTreeDoc }) {
  const X = useX();
  const { doc } = props;
  const { activeNote } = X.state.urlState;
  const sharer = doc.sharer || undefined;
  return (
    <li>
      <Link
        className={cn({ "menu-active": activeNote?.key === doc.key })}
        to={{ activeNote: { key: doc.key, sharer } }}
      >
        <span className="inline-flex items-center gap-2">
          {icon("align-left", "text-base text-primary font-bold")}
          <span className="font-bold">{doc.segment}</span>
        </span>
      </Link>
    </li>
  );
}

function NoteTreeNodeUI(props: { node: NoteTreeNode }) {
  const X = useX();
  const { node } = props;
  const { isSharedRoot } = node;
  const { activeNote } = X.state.urlState;
  const isActive =
    Boolean(activeNote) &&
    (activeNote?.key || "").startsWith(node.key) &&
    (activeNote?.sharer || "") === node.sharer;

  function swapEl(isOff: boolean) {
    return (
      <div
        style={{
          height: "1rem",
          display: "inline-flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: node.isSharedRoot ? "2.25rem" : "1rem",
        }}
        className={isOff ? "swap-off" : "swap-on"}
      >
        {!node.isSharedRoot ? null : icon("share-2", "text-base text-accent")}
        {icon(isOff ? "folder-plus" : "folder-minus", "text-base text-accent")}
      </div>
    );
  }

  return (
    <li>
      <details
        open={!!activeNote || isSharedRoot || false}
        className={cn(
          "group open:[&>summary>div>div]:swap-active",
          "[&>summary>div>div>.swap-on]:rotate-45",
          "[&>summary>div>div>.swap-off]:rotate-0",
          "open:[&>summary]:bg-transparent",
          "open:[&>summary>div>div>.swap-on]:rotate-0",
          "open:[&>summary>div>div>.swap-off]:rotate-45",
          { "[&>summary]:bg-info/20": isActive },
        )}
      >
        <summary>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <div className={cn("h-4 swap mr-2", isSharedRoot ? "w-9" : "w-4")}>
              {swapEl(true)}
              {swapEl(false)}
            </div>
            {node.segment
              .split("/")
              .flatMap((segment, ind) => [
                <span key={`p:${ind}`}>/</span>,
                <span key={`s:${ind}`} className="font-bold">
                  {segment}
                </span>,
              ])
              .slice(1)}
          </div>
        </summary>
        <ul>
          {Object.values(node.subnodes).map((subnode) => (
            <NoteTreeNodeUI key={subnode.key} node={subnode} />
          ))}
          {Object.values(node.docs).map((doc) => (
            <NoteTreeDocUI key={`${doc.segment}.org`} doc={doc} />
          ))}
        </ul>
      </details>
    </li>
  );
}
