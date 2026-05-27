import * as Id from "./id.js";
import type { Props } from "./core.js";
import type {
  GameEndType,
  PlayerType,
  GameStartType,
  MetadataType,
  FramesType,
  GameEndMethod,
} from "@slippi/slippi-js";
import { SlippiGame } from "@slippi/slippi-js";

type IntakeGameMark = {
  process: string;
  start: number;
  length: number;
  props: Props;
};
export type IntakeGame = {
  game: { game_id: string; session: string; props: Props };
  ports: { port: number; props: Props }[];
  marks: IntakeGameMark[];
};
export type PlayerTypeLabel = "PLAYER" | "CPU" | "UNKNOWN";

function _S<T>(t: T): T[] {
  return [t];
}

const Props = (props: Props): Props => {
  function CLEAN(v: any): any {
    const typeofStr = typeof v;
    if (Array.isArray(v)) {
      return v.map(CLEAN).filter((v) => v !== undefined);
    }
    if (v === null || v === false) {
      return undefined;
    }
    if (typeofStr === "object") {
      return Props(v);
    }
    return v;
  }
  const ks = Object.keys(props);
  for (const k of ks) {
    props[k] = CLEAN(props[k]);
    if (props[k] === undefined) {
      delete props[k];
    }
  }
  return props;
};

const nil = (v: any) => (v === null ? undefined : v);
const snil = (v: any) => (v === "" ? undefined : nil(v));
function isAny<T>(v: T | undefined | null): v is T {
  return v !== undefined && v !== null;
}

type SlpIdent =
  | { type: "SeedStart"; seed: number; startAt: number }
  | {
      type: "SeedSession";
      seed: number;
      session: string | undefined;
      game: number | undefined;
      tiebreaker: number | undefined;
    };

function slpId(ident: SlpIdent): string {
  if (ident.type === "SeedStart") {
    return ["RT", Id.of(ident.seed), Id.of(ident.startAt)].join(".");
  } else if (ident.type === "SeedSession") {
    return [
      "RS",
      Id.of(ident.seed),
      Id.of(ident.session),
      Id.of(ident.game),
      Id.of(ident.tiebreaker),
    ].join(".");
  }
  return "";
}

type PlayerInd = 0 | 1 | 2 | 3;

type PlayerMap<T> = Partial<{ [0]: T; [1]: T; [2]: T; [3]: T }>;

const PLAYER_IND_LOOKUP: Record<string | number | symbol, PlayerInd> = {
  [0]: 0,
  [1]: 1,
  [2]: 2,
  [3]: 3,
};

function playerMap<T>(
  r: Record<any, T> | T[] | undefined | null,
): PlayerMap<T> {
  const res: PlayerMap<T> = {};
  for (const [_k, _v] of Object.entries(r || {})) {
    const k: PlayerInd | undefined = PLAYER_IND_LOOKUP[_k];
    const v = _v as T;

    if (k === undefined) {
      continue;
    }
    res[k] = v;
  }
  return res;
}

type MetadataPlayer = {
  characters: {
    [internalCharacterId: number]: number;
  };
  names?: {
    netplay?: string | null;
    code?: string | null;
  };
};

type Ref<T> = undefined | [T];

const ALL_PLAYER_INDS: PlayerInd[] = [0, 1, 2, 3];

class SlpGame {
  private game: SlippiGame;
  private settings: GameStartType | undefined;
  private gameEnd: GameEndType | undefined;
  private metadata: MetadataType | undefined;
  private metadataPlayers: PlayerMap<MetadataPlayer>;
  private settingsPlayers: PlayerMap<PlayerType>;
  private playerIndSet: Set<PlayerInd>;
  private _frames: Ref<FramesType>;
  private _lastFrame: Ref<number>;
  constructor(g: SlippiGame) {
    this.game = g;
    this.settings = g.getSettings();
    this.gameEnd = g.getGameEnd();
    this.metadata = g.getMetadata();
    this.metadataPlayers = playerMap(this.metadata?.players);
    this.settingsPlayers = playerMap(this.settings?.players);
    this.playerIndSet = new Set(
      ALL_PLAYER_INDS.filter(
        (ind) =>
          Boolean(this.metadataPlayers[ind]) ||
          Boolean(this.settingsPlayers[ind]),
      ),
    );
  }

  get numPlayers(): number {
    return this.playerIndSet.size;
  }

  get gameEndMethod(): GameEndMethod | undefined {
    return this.gameEnd?.gameEndMethod;
  }

  get frames(): FramesType {
    const framesRef = this._frames || [this.game.getFrames()];
    this._frames = framesRef;
    return framesRef[0];
  }

  private getLastFrameImpl(): number {
    const mLastFrame = this.metadata?.lastFrame;
    return (
      mLastFrame ||
      (() =>
        Math.max(...Object.keys(this.frames).map((s) => parseInt(s, 10))))()
    );
  }

  get lastFrame(): number {
    const lastFrameRef = this._lastFrame || [this.getLastFrameImpl()];
    this._lastFrame = lastFrameRef;
    return lastFrameRef[0];
  }

  get startAt(): undefined | number {
    const startAtStr = this.metadata?.startAt || undefined;
    return !startAtStr ? undefined : new Date(startAtStr).valueOf();
  }

  get ident(): SlpIdent {
    const startAt = this.startAt;
    const randomSeed = this.settings?.randomSeed;
    if (isAny<number>(startAt) && isAny<number>(randomSeed)) {
      return { type: "SeedStart", startAt, seed: randomSeed };
    }
    if (isAny<number>(randomSeed) && this.settings?.matchInfo?.sessionId) {
      const { sessionId, tiebreakerNumber, gameNumber } =
        this.settings?.matchInfo;
      return {
        type: "SeedSession",
        seed: randomSeed,
        session: sessionId,
        game: gameNumber,
        tiebreaker: tiebreakerNumber,
      };
    }
    console.error(this.settings);
    console.error(this.metadata);
    throw "unmade uniqueId";
  }

  get id(): string {
    return slpId(this.ident);
  }
}

export function parseIntakeGame(b: NodeJS.ArrayBufferView): IntakeGame {
  const slpGame = new SlippiGameCons(b);
  const slpGame_ = new SlpGame(slpGame);
  const stats = slpGame.getStats();
  const settings = slpGame.getSettings();
  const gameEnd = slpGame.getGameEnd();
  const metadata = slpGame.getMetadata();
  const metadataPlayers = metadata?.players || {};
  const _sPlayers = settings?.players || [];
  const settingsPlayers: { [n: number]: (typeof _sPlayers)[number] } = {};
  for (const player of _sPlayers) {
    settingsPlayers[player.playerIndex] = player;
  }

  const getPlayerType: (ind: number) => PlayerTypeLabel = (ind: number) => {
    const readType = settingsPlayers[ind]?.type;
    if (readType === 0) {
      return "PLAYER";
    }
    if (readType === 1) {
      return "CPU";
    }
    return "UNKNOWN";
  };

  const getCC: (ind: number) => string | undefined = (ind: number) =>
    nil(settingsPlayers[ind]?.connectCode || metadataPlayers[ind]?.names?.code);

  const getDisplayName: (ind: number) => string | undefined = (ind: number) =>
    nil(
      settingsPlayers[ind]?.displayName || metadataPlayers[ind]?.names?.netplay,
    );
  const getInGameTag: (ind: number) => string | undefined = (ind: number) =>
    snil(settingsPlayers[ind]?.nametag);

  const allPlayerInds = new Set<number>([
    ...Object.keys(metadataPlayers).map((s) => parseInt(s)),
    ...Object.keys(settingsPlayers).map((s) => parseInt(s)),
  ]);
  const mLastFrame = metadata?.lastFrame;
  const lastFrame =
    mLastFrame ||
    (() =>
      Math.max(
        ...Object.keys(slpGame.getFrames()).map((s) => parseInt(s, 10)),
      ))();
  const startAtStr = metadata?.startAt || undefined;
  const randomSeed = settings?.randomSeed;
  const stageId = settings?.stageId;
  const startAt = startAtStr && new Date(startAtStr).valueOf();
  const placementsByIndex: Record<number, number> = {};
  const overallStatsList = stats?.overall || [];
  const overallByIndex: Record<number, (typeof overallStatsList)[number]> = {};
  for (const overallStats of overallStatsList) {
    overallByIndex[overallStats.playerIndex] = overallStats;
  }
  const actionStatsList = stats?.actionCounts || [];
  const actionByIndex: Record<number, (typeof actionStatsList)[number]> = {};
  for (const actionStats of actionStatsList) {
    actionByIndex[actionStats.playerIndex] = actionStats;
  }
  for (const { playerIndex, position } of gameEnd?.placements || []) {
    if (playerIndex === undefined || position === undefined) {
      continue;
    }
    placementsByIndex[playerIndex] = position;
  }
  const winners = slpGame.getWinners() || [];
  const winnerInds = new Set(winners.map((w) => w.playerIndex));
  const matchInfo = settings?.matchInfo;
  const sessionId = snil(matchInfo?.sessionId || matchInfo?.matchId);
  const inGameMode = settings?.inGameMode;
  const isTeams = settings?.isTeams;
  const numPlayers = allPlayerInds.size;
  const allParsedPlayers = [...allPlayerInds].every((ind) =>
    Boolean(settingsPlayers[ind]),
  );
  const conversions = stats?.conversions || [];
  const anyParsedConversions = conversions.length > 0;
  const is1v1ParsedSingles =
    inGameMode === 32 &&
    !isTeams &&
    numPlayers === 2 &&
    allParsedPlayers &&
    anyParsedConversions;
  const session = sessionId ? sessionId : "";
  const game: IntakeGame = {
    game: {
      game_id: slpGame_.id,
      session,
      props: Props({
        slpVersion: snil(settings?.slpVersion),
        gameMode: settings?.gameMode,
        inGameMode,
        isTeams,
        numPlayers,
        allParsedPlayers,
        anyParsedConversions,
        is1v1ParsedSingles,
        stageId,
        lastFrame,
        randomSeed,
        startAt,
        console_name: snil(metadata?.consoleNick),
        platform: snil(metadata?.playedOn),
        gameEndMethod: gameEnd?.gameEndMethod,
        lrasInitiatorIndex: gameEnd?.lrasInitiatorIndex,
        sessionId,
        sessionGameNumber: settings?.matchInfo?.gameNumber,
        sessionTiebreakerNumber: settings?.matchInfo?.tiebreakerNumber,
        isRanked: (sessionId || "").startsWith("mode.ranked"),
      }),
    },
    ports: [...allPlayerInds].flatMap((ind) => {
      const port = settingsPlayers[ind]?.port;
      if (port === undefined) {
        return [];
      }
      return _S({
        port,
        props: Props({
          playerType: getPlayerType(ind),
          entrant: ind,
          cc: getCC(ind),
          displayName: getDisplayName(ind),
          inGameTag: getInGameTag(ind),
          charId: settingsPlayers[ind]?.characterId,
          colorId: settingsPlayers[ind]?.characterColor,
          isLrasInitiator: ind === gameEnd?.lrasInitiatorIndex,
          placement: placementsByIndex[ind],
          isWinner: winnerInds.has(ind),
          isLoser: winnerInds.size > 0 && !winnerInds.has(ind),
          groundTechAway: actionByIndex[ind]?.groundTechCount?.away,
          groundTechIn: actionByIndex[ind]?.groundTechCount?.in,
          groundTechNeutral: actionByIndex[ind]?.groundTechCount?.neutral,
          groundTechFail: actionByIndex[ind]?.groundTechCount?.fail,
          wallTech: actionByIndex[ind]?.wallTechCount?.success,
          wallTechFail: actionByIndex[ind]?.wallTechCount?.fail,
          jab1: actionByIndex[ind]?.attackCount?.jab1,
          jab2: actionByIndex[ind]?.attackCount?.jab2,
          jab3: actionByIndex[ind]?.attackCount?.jab3,
          jabm: actionByIndex[ind]?.attackCount?.jabm,
          dash: actionByIndex[ind]?.attackCount?.dash,
          ftilt: actionByIndex[ind]?.attackCount?.ftilt,
          dtilt: actionByIndex[ind]?.attackCount?.dtilt,
          utilt: actionByIndex[ind]?.attackCount?.utilt,
          fsmash: actionByIndex[ind]?.attackCount?.fsmash,
          dsmash: actionByIndex[ind]?.attackCount?.dsmash,
          usmash: actionByIndex[ind]?.attackCount?.usmash,
          nair: actionByIndex[ind]?.attackCount?.nair,
          fair: actionByIndex[ind]?.attackCount?.fair,
          bair: actionByIndex[ind]?.attackCount?.bair,
          uair: actionByIndex[ind]?.attackCount?.uair,
          dair: actionByIndex[ind]?.attackCount?.dair,
          roll: actionByIndex[ind]?.rollCount,
          ledgeGrab: actionByIndex[ind]?.ledgegrabCount,
          spotDodge: actionByIndex[ind]?.spotDodgeCount,
          dashDance: actionByIndex[ind]?.dashDanceCount,
          airDodge: actionByIndex[ind]?.airDodgeCount,
          wavedash: actionByIndex[ind]?.wavedashCount,
          waveland: actionByIndex[ind]?.wavelandCount,
          lCancel: actionByIndex[ind]?.lCancelCount?.success,
          lCancelFail: actionByIndex[ind]?.lCancelCount?.fail,
          edgeCancel: actionByIndex[ind]?.edgeCancelCount?.success,
          edgeCancelSlow: actionByIndex[ind]?.edgeCancelCount?.slow,
          grab: actionByIndex[ind]?.grabCount?.success,
          grabFail: actionByIndex[ind]?.grabCount?.fail,
          throwUp: actionByIndex[ind]?.throwCount?.up,
          throwBack: actionByIndex[ind]?.throwCount?.back,
          throwDown: actionByIndex[ind]?.throwCount?.down,
          throwForward: actionByIndex[ind]?.throwCount?.forward,
          inputsButtons: overallByIndex[ind]?.inputCounts?.buttons,
          inputsTriggers: overallByIndex[ind]?.inputCounts?.triggers,
          inputsCstick: overallByIndex[ind]?.inputCounts?.cstick,
          inputsJoystick: overallByIndex[ind]?.inputCounts?.joystick,
          inputsTotal: overallByIndex[ind]?.inputCounts?.total,
          totalDamage: overallByIndex[ind]?.totalDamage,
          killCount: overallByIndex[ind]?.killCount,
          ipm: overallByIndex[ind]?.inputsPerMinute?.ratio,
          dipm: overallByIndex[ind]?.digitalInputsPerMinute?.ratio,
          opk: overallByIndex[ind]?.openingsPerKill?.ratio,
          neutralRate: overallByIndex[ind]?.neutralWinRatio?.ratio,
          counterRate: overallByIndex[ind]?.counterHitRatio?.ratio,
          tradeRate: overallByIndex[ind]?.beneficialTradeRatio?.ratio,
        }),
      });
    }),
    marks: !is1v1ParsedSingles
      ? []
      : conversions.flatMap((combo) => {
          const { playerIndex, startFrame, startPercent, endPercent } = combo;
          const { endFrame, didKill, openingType, moves } = combo;
          const port = settingsPlayers[playerIndex]?.port;
          if (port === undefined) {
            return [];
          }
          const frameDelta =
            endFrame === undefined ? NaN : endFrame - startFrame;
          const validFrameDelta = !Number.isNaN(frameDelta) && frameDelta >= 0;

          const percentDelta =
            endPercent === undefined ? NaN : endPercent - startPercent;
          const validPercentDelta =
            !Number.isNaN(percentDelta) && percentDelta >= 0;

          return _S({
            process: "intake",
            start: startFrame,
            length: validFrameDelta ? frameDelta : lastFrame - startFrame,
            props: {
              type: "slp|stats|conversion",
              openingPort: port,
              openingType,
              lastHitBy: combo.lastHitBy,
              didKill: startFrame > (endFrame || 0) ? true : didKill,
              startPercent,
              totalDamage: validPercentDelta
                ? percentDelta
                : moves.reduce((dmg, m) => dmg + m.damage, 0),
              numMoves: moves.length,
              moves: moves.map((m) => m.moveId),
            },
          });
        }),
  };
  return game;
}
