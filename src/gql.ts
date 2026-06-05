/*
const runGqlQuery =
  (token) =>
  async (qname, vars, opts = {}) => {
    const { logInfo = () => {} } = opts;
    const keys = Object.keys(vars || {});
    keys.sort();
    if (keys.length === 2 && keys[0] === "page" && keys[1] === "phaseGroupId") {
      keys.reverse();
    }
    let forceSkipCache = false;
    for (const k of keys) {
      const v = vars[k];
      if (k === "phaseGroupId" && `${v}` === "3273127") {
        forceSkipCache = true;
      }
      if (k === "slug" && v === "tournament/rpm-86/event/melee-singles") {
        forceSkipCache = true;
      }
    }
    const qpath = paths.gqlQuery(qname);
    const rawq = await fs.readString(qpath);
    const qkey = $.simpleHash(
      (() => {
        let qkey_ = `${rawq}|${qname}`;
        if (keys.length === 0) {
          return `${qkey_}|`;
        }
        for (const key of keys) {
          qkey_ += `|${vars[key]}`;
        }
        return qkey_;
      })(),
    );
    const qpathCached = paths.gqlCache(`${qname}.${qkey}`);
    // console.log(`FETCH::[ ${qname}.${qkey} ]  checking cache`, opts);
    const cached = await (async () => {
      try {
        if (forceSkipCache || opts.skipCache) {
          return undefined;
        }
        return [await _.slurp(qpathCached)];
      } catch (_) {
        return undefined;
      }
    })();
    if (cached) {
      return cached[0];
    }
    if (opts.cacheOnly) {
      return undefined;
    }
    const q = gql(rawq.split("\n"));
    logInfo("sgg:graphql", `![${qname}]`, `![${JSON.stringify(vars)}]`);
    await $.timeout(6 * 1000);
    const res = await mkClient(token).request({
      url: `${API_URL}/v1/graphql`,
      document: q,
      ...(vars ? { variables: vars } : {}),
    });
    try {
      await fs.writeFile(qpathCached, JSON.stringify(res));
    } catch (_e) {
      // console.log(`FETCH::[ ${qname}.${qkey} ]  ERROR`);
      // console.log(_e);
    }
    return res;
  };

const runGqlQueryGGAuth = runGqlQuery(getGGAuth(() => {}));
runGqlQueryGGAuth.for = (token) => runGqlQuery(token);

export default runGqlQueryGGAuth;
    */
