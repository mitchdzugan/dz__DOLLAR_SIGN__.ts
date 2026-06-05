export * from "./node_core.js";
import { GraphQLClient, gql } from "graphql-request";
import { fs, path } from "./node_core.js";
import * as $ from "./core.js";

type GqlQueryOpts = {
  apiUrl: string;
  queryName: string;
  queryDir: string;
  vars?: Record<string, string | number | boolean | null>;
  authToken?: string;
  log?: (...s: string[]) => void;
  networkControl?: "use-cache" | "cache-only" | "force-fetch";
  cachePath?: string;
};

export async function gqlRequest(opts: GqlQueryOpts) {
  const { queryName, queryDir, apiUrl, cachePath } = opts;
  const log = opts.log || (() => {});
  const vars = opts.vars || {};
  const networkControl = opts.networkControl || "use-cache";
  const queryPath = path.join(queryDir, `${queryName}.gql`);
  const query = await fs.readString(queryPath);
  $.assertNonNil(query);
  const client = new GraphQLClient(
    apiUrl,
    !opts.authToken
      ? {}
      : {
          headers: { authorization: `Bearer ${opts.authToken}` },
        },
  );
  const keys = Object.keys(vars || {});
  keys.sort();
  if (keys.length === 2 && keys[0] === "page" && keys[1] === "phaseGroupId") {
    keys.reverse();
  }
  const qkey = $.simpleHash(
    (() => {
      let qkey_ = `${query}|${queryName}`;
      if (keys.length === 0) {
        return `${qkey_}|`;
      }
      for (const key of keys) {
        qkey_ += `|${vars[key]}`;
      }
      return qkey_;
    })(),
  );

  function getQpathCached(): string {
    $.assertNonNil(cachePath);
    return path.join(cachePath, `${queryName}.${qkey}`);
  }

  const cached = await (async () => {
    try {
      if (!cachePath || networkControl === "force-fetch") {
        return undefined;
      }
      return [await fs.slurp(getQpathCached())];
    } catch (_) {
      return undefined;
    }
  })();
  if (cached) {
    return cached[0];
  }
  if (networkControl === "cache-only") {
    return undefined;
  }
  const q = gql(query.split("\n") as any);
  log("sgg:graphql", `![${queryName}]`, `![${JSON.stringify(vars)}]`);
  await $.timeout(6 * 1000);
  const res = client.request<any, any>({
    document: q,
    ...(vars ? { variables: vars } : {}),
  });
  try {
    await fs.writeFile(getQpathCached(), JSON.stringify(res));
  } catch (_e) {
    // console.log(`FETCH::[ ${qname}.${qkey} ]  ERROR`);
    // console.log(_e);
  }
  return res;
}
