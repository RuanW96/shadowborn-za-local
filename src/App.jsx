import { useEffect, useMemo, useState } from "react";
import {
  Menu,
  X,
  Home,
  Trophy,
  Users,
  Swords,
  ShieldCheck,
  Flame,
  Medal,
  CalendarDays,
  Crown,
  Target,
  Plus,
  LogOut,
  Lock,
  Trash2,
  CheckCircle2,
  PencilLine,
  Upload,
  MessageCircle,
  Star,
} from "lucide-react";
import { supabase } from "./supabase";
import LoginIntro from "./components/LoginIntro";
import DivisionPlayerCard from "./components/DivisionPlayerCard";
const STORAGE_ROW_ID = 1;
const DISCORD_LINK = "https://discord.gg/DRads9MkB";
const DEFAULT_LOGO = "/shadowborn-za-logo.jpg";
const COD_RANKS = [
  "Bronze I", "Bronze II", "Bronze III",
  "Silver I", "Silver II", "Silver III",
  "Gold I", "Gold II", "Gold III",
  "Platinum I", "Platinum II", "Platinum III",
  "Diamond I", "Diamond II", "Diamond III",
  "Crimson I", "Crimson II", "Crimson III",
  "Iridescent",
  "Top 250",
];
const PLAYER_PINS = {
  1: "4182",
  2: "2809",
  3: "3319",
  4: "8842",
  5: "5206",
  6: "2784",
  7: "6413",
  8: "7095",
  9: "1946",
  10: "8361",
  11: "4728",
  12: "6159",
  13: "9034",
  14: "2871",
  15: "5540",
  16: "7622",
  17: "3185",
  18: "4309",
};
const RANK_BADGES = {
  "Bronze I": "/ranks/bronze1.png",
  "Bronze II": "/ranks/bronze2.png",
  "Bronze III": "/ranks/bronze3.png",

  "Silver I": "/ranks/silver1.png",
  "Silver II": "/ranks/silver2.png",
  "Silver III": "/ranks/silver3.png",

  "Gold I": "/ranks/gold1.png",
  "Gold II": "/ranks/gold2.png",
  "Gold III": "/ranks/gold3.png",

  "Platinum I": "/ranks/platinumone.png",
  "Platinum II": "/ranks/platinumtwo.png",
  "Platinum III": "/ranks/platinumthree.png",

  "Diamond I": "/ranks/diamond1.png",
  "Diamond II": "/ranks/diamond2.png",
  "Diamond III": "/ranks/diamond3.png",

  "Crimson I": "/ranks/crimson1.png",
  "Crimson II": "/ranks/crimson2.png",
  "Crimson III": "/ranks/crimson3.png",

  "Iridescent": "/ranks/iridescent.png",
  "Top 250": "/ranks/top250.png",
};

const defaultPlayers = [
  { id: 1, name: "The Fudgeman", emblem: "TF", points: 165, tournamentWins: 1, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 2, name: "Bulletstorm", emblem: "BS", points: 145, tournamentWins: 1, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "co-leader" },
  { id: 3, name: "Thirdstriker", emblem: "TS", points: 131, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 4, name: "Toxicmuffin", emblem: "TM", points: 115, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "leader" },
  { id: 5, name: "Stifler", emblem: "ST", points: 82, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 6, name: "Dreamzz", emblem: "DZ", points: 81, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 7, name: "Botzzy", emblem: "BZ", points: 50, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 8, name: "Gallie", emblem: "GA", points: 47, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 9, name: "Jeanre", emblem: "JR", points: 40, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 10, name: "STG", emblem: "SG", points: 32, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 11, name: "Dwain", emblem: "DW", points: 20, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 12, name: "DancyRaptor", emblem: "DR", points: 20, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 13, name: "Dennis", emblem: "DE", points: 20, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 14, name: "UncleCyril", emblem: "UC", points: 10, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 15, name: "Nico", emblem: "NI", points: 0, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 16, name: "AJ", emblem: "AJ", points: 0, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
  { id: 17, name: "Jaundre", emblem: "JA", points: 0, tournamentWins: 0, wins: 0, losses: 0, mvpPoints: 0, activityPoints: 0, avatar: "", role: "player" },
];

const emptyTournament = {
  title: "Shadowborn Tournament",
  format: "2v2",
  teams: [],
  teamDraft: { name: "", memberIds: [] },
  activeWinners: [],
  activeRedemption: [],
  completedRounds: [],
  winnersCarry: null,
  redemptionCarry: null,
  grandFinal: null,
  championTeamId: null,
  status: "Setup",
  winnersStage: 1,
  redemptionStage: 1,
};

const defaultState = {
  clanName: "Shadowborn ZA",
  tagline: "Victory awaits in the shadows",
  logoUrl: DEFAULT_LOGO,
  players: defaultPlayers,
  playerPins: PLAYER_PINS,
  tournament: emptyTournament,
  championBanner: null,
  hallOfFame: [],
  callouts: [],
  poll: {
    question: "What should we play next?",
   options: [
  { id: 1, label: "1v1 SND", votes: 0 },
  { id: 2, label: "1v1 Hardpoint", votes: 0 },
  { id: 3, label: "1v1 Overload", votes: 0 },

  { id: 4, label: "2v2 SND", votes: 0 },
  { id: 5, label: "2v2 Hardpoint", votes: 0 },
  { id: 6, label: "2v2 Overload", votes: 0 },

  { id: 7, label: "3v3 SND", votes: 0 },
  { id: 8, label: "3v3 Hardpoint", votes: 0 },
  { id: 9, label: "3v3 Overload", votes: 0 },

  { id: 10, label: "4v4 SND", votes: 0 },
  { id: 11, label: "4v4 Hardpoint", votes: 0 },
  { id: 12, label: "4v4 Overload", votes: 0 },
],
       
  },
  recommendations: [],
  rankRequests: [],
  sundayHistory: [],
  activeSundayTeams: [],
  seasonHistory: [],
};

function getTeamSize(format) {
  if (format === "1v1") return 1;
  if (format === "2v2") return 2;
  if (format === "3v3") return 3;
  if (format === "4v4") return 4;

  return 2;
}

function getRank(points) {
  if (points >= 601) return { name: "Master", color: "#ef4444", glow: "rgba(239,68,68,0.35)" };
  if (points >= 301) return { name: "Elite", color: "#f59e0b", glow: "rgba(245,158,11,0.35)" };
  if (points >= 161) return { name: "Veteran", color: "#a855f7", glow: "rgba(168,85,247,0.35)" };
  if (points >= 101) return { name: "Operator", color: "#38bdf8", glow: "rgba(56,189,248,0.35)" };
  return { name: "Recruit", color: "#94a3b8", glow: "rgba(148,163,184,0.3)" };
}

function cardStyle() {
  return {
    position: "relative",

    background:
      "linear-gradient(145deg, rgba(18,14,27,0.68), rgba(8,6,14,0.58))",

    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",

    border: "1px solid rgba(216,180,254,0.11)",
    borderRadius: 22,
    padding: 16,

    boxShadow:
      "0 18px 45px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.025)",
  };
}

function inputStyle(disabled = false) {
  return {
    width: "100%",
    padding: "11px 13px",
    borderRadius: 12,

    border: disabled
      ? "1px solid rgba(255,255,255,0.06)"
      : "1px solid rgba(192,132,252,0.20)",

    background: disabled
      ? "rgba(12,9,18,0.40)"
      : "rgba(9,6,15,0.62)",

    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",

    color: disabled ? "#8e849e" : "#ffffff",
    boxSizing: "border-box",
    opacity: disabled ? 0.7 : 1,

    outline: "none",
    boxShadow: disabled
      ? "none"
      : "inset 0 0 14px rgba(0,0,0,0.18)",
  };
}

function buttonStyle(active = false, disabled = false) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,

    padding: "10px 14px",
    borderRadius: 12,

    border: active
      ? "1px solid rgba(192,132,252,0.42)"
      : "1px solid rgba(255,255,255,0.09)",

    background: disabled
      ? "rgba(255,255,255,0.035)"
      : active
      ? "linear-gradient(135deg, rgba(124,58,237,0.92), rgba(168,85,247,0.92))"
      : "linear-gradient(145deg, rgba(24,18,34,0.72), rgba(10,7,17,0.62))",

    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",

    color: disabled ? "#8f849e" : "#ffffff",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 800,

    opacity: disabled ? 0.66 : 1,

    boxShadow: active
      ? "0 8px 24px rgba(124,58,237,0.28)"
      : "0 7px 20px rgba(0,0,0,0.20)",

    transition:
      "transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
  };
}

function badgeStyle(bg = "rgba(255,255,255,0.08)", color = "white") {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    background: bg,
    color,
    fontSize: 12,
    fontWeight: 700,
  };
}
function statCardStyle() {
  return {
    background: "#13111b",
    border: "1px solid rgba(168,85,247,0.18)",
    borderRadius: 18,
    padding: "18px 14px",
    textAlign: "center",
    minHeight: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: "0 0 24px rgba(168,85,247,0.08)",
  };
}
function pairTeams(teamIds, bracket, stage) {
  const ids = [...teamIds];
  const matches = [];
  let carry = null;

  if (ids.length % 2 === 1) carry = ids.pop();

  for (let i = 0; i < ids.length; i += 2) {
    matches.push({
      id: `${bracket}-${stage}-${i / 2 + 1}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      bracket,
      stage,
      label: bracket === "W" ? `Winners Round ${stage}` : bracket === "L" ? `Redemption Round ${stage}` : "Grand Final",
      teamAId: ids[i],
      teamBId: ids[i + 1],
      scoreA: "",
      scoreB: "",
      submittedByTeamA: false,
      teamBConfirmed: false,
      locked: false,
      winnerId: null,
      loserId: null,
    });
  }

  return { matches, carry };
}

function allLocked(matches) {
  return matches.length === 0 || matches.every((m) => m.locked);
}

function getOfficialWinners(matches) {
  return matches.filter((m) => m.locked && m.winnerId).map((m) => m.winnerId);
}

function getOfficialLosers(matches) {
  return matches.filter((m) => m.locked && m.loserId).map((m) => m.loserId);
}
function LeaderboardCard({ player, index, competitiveScore }) {
  const rank = getRank(competitiveScore ?? 0);
  const isMainSlayer = index < 4;

  return (
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        marginBottom: 14,
        position: "relative",
        border: isMainSlayer ? `2px solid ${rank.color}` : `1px solid ${rank.color}`,
boxShadow: isMainSlayer
  ? `0 0 18px ${rank.glow}, 0 0 42px ${rank.glow}`
  : `0 0 14px ${rank.glow}`,
animation: "none",
        background: "rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          minHeight: 220,
          backgroundImage: `linear-gradient(90deg, rgba(10,6,18,0.92), rgba(10,6,18,0.62), rgba(10,6,18,0.35)), url(${player.banner || "/shadowborn-za-logo.jpg"})`,
          backgroundSize: "110%",
          backgroundPosition: "center",
          padding: 18,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          
          <img
            src={player.avatar || "/shadowborn-za-logo.jpg"}
            alt={player.name}
            style={{
              width: 82,
              height: 82,
              borderRadius: 18,
              objectFit: "cover",
              border: `2px solid ${rank.color}`,
              boxShadow: `0 0 22px ${rank.glow}`,
              background: "#111",
            }}
          />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
  <span>
    #{index + 1} {player.name}
  </span>

  {player.codRank && RANK_BADGES[player.codRank] ? (
  <img
    src={RANK_BADGES[player.codRank]}
    alt={player.codRank}
    title={player.codRank}
    style={{
  position: "absolute",
  top: 15,
  right: 25,
  width: 135,
  height: 135,
  objectFit: "contain",
  zIndex: 5,

  // glow
  filter: "drop-shadow(0 0 20px rgba(168,85,247,0.95))",

  // background glow bubble
  background: "rgba(10,10,20,0.55)",
  borderRadius: "50%",
  padding: 10,
  backdropFilter: "blur(8px)",

  // outline
  border: "2px solid rgba(168,85,247,0.45)",
}}
  />
) : null}
</div>

            <div style={{ color: rank.color, fontWeight: 800, marginTop: 4 }}>
              {rank.name}
            </div>

            {isMainSlayer && (
  <div style={{ color: "#facc15", fontWeight: 900, marginTop: 4 }}>
    🔥 MAIN SLAYER
  </div>
)}

            <div style={{ marginTop: 6, color: "#e9ddff", fontWeight: 700 }}>
              CR {competitiveScore ?? 0} • W {player.wins} / L {player.losses} • Tournament Wins {player.tournamentWins}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
export default function App() {
  const [state, setState] = useState(defaultState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState(null);
  const [auth, setAuth] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [calloutHistoryFilter, setCalloutHistoryFilter] = useState("all");
  const [openCalloutSections, setOpenCalloutSections] = useState({
  pending: true,
  accepted: true,
  completed: false,
});
  const [menuOpen, setMenuOpen] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState([]);
const [onlinePlayersExpanded, setOnlinePlayersExpanded] =
  useState(false);
  const [pin, setPin] = useState("");
  const [selectedLoginPlayerId, setSelectedLoginPlayerId] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginIntroPlayer, setLoginIntroPlayer] = useState(null);
const [loginIntroVisible, setLoginIntroVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  const [selectedProfilePlayerId, setSelectedProfilePlayerId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    emblem: "",
    points: 0,
    pin: "",
    tournamentWins: 0,
    avatar: "",
    role: "player",
  });

  const [calloutDraft, setCalloutDraft] = useState({
  challengedId: "",
});

  const [sundayEntry, setSundayEntry] = useState({
    mode: "Hardpoint",
    mapName: "",
    scoreText: "",
    winningTeamIds: [],
    losingTeamIds: [],
    winningMvpId: "",
    losingMvpId: "",
    objectiveLeaderId: "",
    bestKdId: "",
    zeroDeathId: "",
    winningSubstituteIds: [],
losingSubstituteIds: [],
    flawless: false,
  });
const [sundayTeams, setSundayTeams] = useState([]);
const [sundayTeamCount, setSundayTeamCount] = useState(3);
const [sundaySelectedPlayers, setSundaySelectedPlayers] = useState([]);
const [sundayRoundDraft, setSundayRoundDraft] = useState({
  roundName: "Round 1",
  teamAIndex: "",
  teamBIndex: "",
  winnerIndex: "",
});
const [sundayRounds, setSundayRounds] = useState([]);
  const [recommendationDraft, setRecommendationDraft] = useState({
    title: "",
    description: "",
    category: "General",
  });
  const [rankRequestDraft, setRankRequestDraft] = useState({
  rank: "",
  proofUrl: "",
});
const [weeklyAwardDraft, setWeeklyAwardDraft] = useState({
  playerId: "",
  amount: 10,
  reason: "",
});
 const players = (state.players || []).map((p) => ({
  codRank: "",
  teamRole: "challenger",
  playStyle: "",
  competitiveRating: 0,
  crAdjustment: 0,
  trainingAttended: 0,
  trainingMissed: 0,

  // Division system
  division: 0,
  isDivisionCaptain: false,

  // Collectible player-card image
  cardPhoto: "",

  // Permanent career statistics
  legacyStats: {
    seasonsPlayed: 0,

    division1Seasons: 0,
    division2Seasons: 0,
    division3Seasons: 0,

    captainSeasons: 0,
    allStarSelections: 0,

    smgChampionFinishes: 0,
    arChampionFinishes: 0,

    careerWins: 0,
    careerLosses: 0,
    careerMvpPoints: 0,
    careerTournamentWins: 0,

    highestCr: 0,
    highestSeasonWins: 0,

    seasonHistory: [],
  },

  ...p,

  // Preserve older legacy values while adding any new fields
  legacyStats: {
    seasonsPlayed: 0,

    division1Seasons: 0,
    division2Seasons: 0,
    division3Seasons: 0,

    captainSeasons: 0,
    allStarSelections: 0,

    smgChampionFinishes: 0,
    arChampionFinishes: 0,

    careerWins: 0,
    careerLosses: 0,
    careerMvpPoints: 0,
    careerTournamentWins: 0,

    highestCr: 0,
    highestSeasonWins: 0,

    seasonHistory: [],

    ...(p.legacyStats || {}),
  },
}));
  const tournament = state.tournament || emptyTournament;

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name)),
    [players]
  );

  const competitivePlayers = useMemo(
    () =>
      [...players].sort((a, b) => {
        const scoreA =
          Number(a.competitiveRating || 0) ||
          Number(a.points || 0) +
            Number(a.wins || 0) * 5 +
            Number(a.mvpPoints || 0) +
            Number(a.tournamentWins || 0) * 25 -
            Number(a.losses || 0) * 2 +
            Number(a.trainingAttended || 0) * 3 -
            Number(a.trainingMissed || 0) * 5;

        const scoreB =
          Number(b.competitiveRating || 0) ||
          Number(b.points || 0) +
            Number(b.wins || 0) * 5 +
            Number(b.mvpPoints || 0) +
            Number(b.tournamentWins || 0) * 25 -
            Number(b.losses || 0) * 2 +
            Number(b.trainingAttended || 0) * 3 -
            Number(b.trainingMissed || 0) * 5;

        return getCompetitiveScore(b) - getCompetitiveScore(a) || a.name.localeCompare(b.name);
      }),
    [players]
  );
const smgPlayers = competitivePlayers.filter(
  (player) => player.playStyle === "SMG"
);

const arPlayers = competitivePlayers.filter(
  (player) => player.playStyle === "AR"
);

const noPreferencePlayers = competitivePlayers.filter(
  (player) =>
    player.playStyle !== "SMG" &&
    player.playStyle !== "AR"
);
  const aTeamPlayers = competitivePlayers.filter((p) => p.teamRole === "a-team").slice(0, 4);
  const promotionTeam = players.filter(
  (p) => p.teamRole === "promotion"
);
const division1Players = players
  .filter((p) => Number(p.division || 0) === 1)
  .sort(
    (a, b) =>
      Number(b.isDivisionCaptain || false) -
        Number(a.isDivisionCaptain || false) ||
      getCompetitiveScore(b) - getCompetitiveScore(a)
  );

const division2Players = players
  .filter((p) => Number(p.division || 0) === 2)
  .sort(
    (a, b) =>
      Number(b.isDivisionCaptain || false) -
        Number(a.isDivisionCaptain || false) ||
      getCompetitiveScore(b) - getCompetitiveScore(a)
  );

const division3Players = players
  .filter((p) => Number(p.division || 0) === 3)
  .sort(
    (a, b) =>
      Number(b.isDivisionCaptain || false) -
        Number(a.isDivisionCaptain || false) ||
      getCompetitiveScore(b) - getCompetitiveScore(a)
  );
const challengers = players.filter(
  (p) => !["ateam", "promotion"].includes(p.teamRole)
);
  const challengerPlayers = competitivePlayers.filter((p) => p.teamRole !== "a-team");
  const weeklyChallengeLeader = [...challengerPlayers].sort(
  (a, b) =>
    (b.weeklyChallenges || 0) - (a.weeklyChallenges || 0)
)[0];
  const promotionZonePlayers = challengerPlayers.slice(0, 4);
  const lowestATeamPlayer = aTeamPlayers.length ? aTeamPlayers[aTeamPlayers.length - 1] : null;


  const sortedRecommendations = useMemo(
    () => [...(state.recommendations || [])].sort(
      (a, b) =>
        Number(b.pinned || false) - Number(a.pinned || false) ||
        (Number(b.votes || 0) - Number(a.votes || 0)) ||
        (Number(b.id || 0) - Number(a.id || 0))
    ),
    [state.recommendations]
  );
const pendingCallouts = (state.callouts || []).filter(
  (c) => c.status === "pending"
);

const acceptedCallouts = (state.callouts || []).filter(
  (c) => c.status === "accepted" && !c.confirmed
);

const completedCallouts = (state.callouts || []).filter(
  (c) => c.status === "confirmed" || c.status === "forfeit"
);
const calloutHistoryMonths = [
  "all",
  ...Array.from(
    new Set(
      completedCallouts
        .map((c) => c.createdAt)
        .filter(Boolean)
        .map((date) => {
          const d = new Date(date);
          return Number.isNaN(d.getTime())
            ? date
            : d.toLocaleDateString("en-ZA", {
                year: "numeric",
                month: "long",
              });
        })
    )
  ),
];

const filteredCompletedCallouts =
  calloutHistoryFilter === "all"
    ? completedCallouts
    : completedCallouts.filter((c) => {
        const d = new Date(c.createdAt);
        const label = Number.isNaN(d.getTime())
          ? c.createdAt
          : d.toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "long",
            });

        return label === calloutHistoryFilter;
      });
  const loggedInPlayer = auth ? players.find((p) => p.id === auth.playerId) : null;
  const canAdmin = loggedInPlayer && (loggedInPlayer.role === "leader" || loggedInPlayer.role === "co-leader");
  const sundayPlayingIds = [
  ...(sundayEntry.winningTeamIds || []),
  ...(sundayEntry.losingTeamIds || []),
  ...(sundayEntry.winningSubstituteIds || []),
  ...(sundayEntry.losingSubstituteIds || []),
].map(Number);

const sundayPlayingPlayers = players.filter((p) =>
  sundayPlayingIds.includes(Number(p.id))
);

const sundayWinningPlayerIds = [
  ...(sundayEntry.winningTeamIds || []),
  ...(sundayEntry.winningSubstituteIds || []),
].map(Number);

const sundayLosingPlayerIds = [
  ...(sundayEntry.losingTeamIds || []),
  ...(sundayEntry.losingSubstituteIds || []),
].map(Number);

const sundayWinningPlayers = players.filter((p) =>
  sundayWinningPlayerIds.includes(Number(p.id))
);

const sundayLosingPlayers = players.filter((p) =>
  sundayLosingPlayerIds.includes(Number(p.id))
);

  function getRawCompetitiveScore(player) {
  return (
    Number(player.points || 0) +
    Number(player.wins || 0) * 5 +
    Number(player.mvpPoints || 0) +
    Number(player.tournamentWins || 0) * 25 -
    Number(player.losses || 0) * 2 +
    Number(player.trainingAttended || 0) * 3 -
    Number(player.trainingMissed || 0) * 5
  );
}

function getWeeklyChallengePoints(player) {
  const history = Array.isArray(player.weeklyChallengeHistory)
    ? player.weeklyChallengeHistory
    : [];

  // New system: total the actual reward selected for each challenge.
  if (history.length > 0) {
    return history.reduce(
      (total, challenge) =>
        total + Number(challenge.amount || 0),
      0
    );
  }

  // Safety fallback for older records that have a challenge count
  // but no saved challenge history.
  return Number(player.weeklyChallenges || 0) * 20;
}

function getCompetitiveScore(player) {
  return (
    getRawCompetitiveScore(player) +
    Number(player.crAdjustment || 0) +
    getWeeklyChallengePoints(player)
  );
}
function awardWeeklyChallenge() {
  if (!canAdmin) return;

  const playerId = Number(weeklyAwardDraft.playerId);
  const amount = Number(weeklyAwardDraft.amount);
  const reason = String(
    weeklyAwardDraft.reason || ""
  ).trim();

  if (!playerId) {
    alert("Please select a player.");
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    alert("Please enter a valid CR reward greater than 0.");
    return;
  }

  if (!reason) {
    alert("Please enter the challenge name or reason.");
    return;
  }

  const selectedPlayer = players.find(
    (player) => Number(player.id) === playerId
  );

  if (!selectedPlayer) {
    alert("The selected player could not be found.");
    return;
  }

  updateState((prev) => ({
    ...prev,

    players: prev.players.map((player) =>
      Number(player.id) === playerId
        ? {
            ...player,

            weeklyChallenges:
              Number(player.weeklyChallenges || 0) + 1,

            weeklyChallengeHistory: [
              ...(player.weeklyChallengeHistory || []),
              {
                id: Date.now(),
                amount,
                reason,
                date: new Date().toLocaleDateString("en-ZA"),
                createdAt: new Date().toISOString(),
                awardedBy:
                  loggedInPlayer?.name || "Admin",
              },
            ],
          }
        : player
    ),
  }));

  alert(
    `🏆 Weekly challenge awarded!\n\n` +
      `Player: ${selectedPlayer.name}\n` +
      `Challenge: ${reason}\n` +
      `CR Reward: +${amount}`
  );

  setWeeklyAwardDraft({
    playerId: "",
    amount: 10,
    reason: "",
  });
}
  function setTeamRole(playerId, teamRole) {
    if (!canAdmin) return;

    if (teamRole === "a-team") {
      const currentATeamCount = players.filter((p) => p.teamRole === "a-team" && p.id !== playerId).length;
      if (currentATeamCount >= 4) {
        alert("A-Team can only have 4 players. Move someone to Challengers first.");
        return;
      }
    }

    updatePlayer(playerId, "teamRole", teamRole);
  }
function setPlayerDivision(playerId, divisionValue) {
  if (!canAdmin) return;

  const division = Number(divisionValue);
  const player = players.find((p) => Number(p.id) === Number(playerId));

  if (!player) return;

  if (![0, 1, 2, 3].includes(division)) {
    alert("Please select a valid division.");
    return;
  }

  if (division > 0) {
    const playersAlreadyInDivision = players.filter(
      (p) =>
        Number(p.division || 0) === division &&
        Number(p.id) !== Number(playerId)
    );

    if (playersAlreadyInDivision.length >= 4) {
      alert(`Division ${division} already has 4 players.`);
      return;
    }
  }

  updateState((prev) => ({
    ...prev,
    players: prev.players.map((p) =>
      Number(p.id) === Number(playerId)
        ? {
            ...p,
            division,
            // Remove captain status when changing division
            isDivisionCaptain:
              Number(p.division || 0) === division
                ? Boolean(p.isDivisionCaptain)
                : false,
          }
        : p
    ),
  }));
}

function setDivisionCaptain(playerId) {
  if (!canAdmin) return;

  const selectedPlayer = players.find(
    (p) => Number(p.id) === Number(playerId)
  );

  if (!selectedPlayer) return;

  const division = Number(selectedPlayer.division || 0);

  if (![1, 2, 3].includes(division)) {
    alert("Assign this player to a division before making them captain.");
    return;
  }

  const alreadyCaptain = Boolean(selectedPlayer.isDivisionCaptain);

  updateState((prev) => ({
    ...prev,
    players: prev.players.map((p) => {
      const playerDivision = Number(p.division || 0);

      // Clicking the current captain again removes captain status
      if (Number(p.id) === Number(playerId) && alreadyCaptain) {
        return {
          ...p,
          isDivisionCaptain: false,
        };
      }

      // Only one captain is allowed in each division
      if (playerDivision === division) {
        return {
          ...p,
          isDivisionCaptain:
            Number(p.id) === Number(playerId),
        };
      }

      return p;
    }),
  }));
}
  function updateTraining(playerId, type, amount) {
    if (!canAdmin) return;

    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    const field = type === "attended" ? "trainingAttended" : "trainingMissed";
    const current = Number(player[field] || 0);
    updatePlayer(playerId, field, Math.max(0, current + amount));
  }

  useEffect(() => {
  loadCloudState();
}, []);

useEffect(() => {
  if (!loggedInPlayer) return;

  const interval = setInterval(async () => {
    const { data, error } = await supabase
      .from("shadowborn_state")
      .select("data")
      .eq("id", STORAGE_ROW_ID)
      .single();

    if (!error && data?.data) {
  if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA" || document.activeElement?.tagName === "SELECT") {
    return;
  }

  setState((prev) => {
        return {
          ...prev,
          ...data.data,
          players: data.data.players || prev.players,
          playerPins: data.data.playerPins || prev.playerPins || PLAYER_PINS,
          tournament: data.data.tournament || prev.tournament,
          hallOfFame: data.data.hallOfFame || prev.hallOfFame,
          callouts: data.data.callouts || prev.callouts,
          recommendations: data.data.recommendations || prev.recommendations || [],
          rankRequests: data.data.rankRequests || prev.rankRequests || [],
          seasonHistory: data.data.seasonHistory || prev.seasonHistory || [],
          championBanner: data.data.championBanner || prev.championBanner,
          poll: data.data.poll?.options?.length === 9 ? data.data.poll : defaultState.poll,
        };
      });
    }
  }, 2000);

  return () => clearInterval(interval);
}, [loggedInPlayer]);
    useEffect(() => {
  if (!loggedInPlayer) {
    setOnlinePlayers([]);
    return;
  }

  updateMyPresence();
  loadOnlinePlayers();

  const presenceInterval = setInterval(() => {
    updateMyPresence();
  }, 25000);

  const onlinePlayersInterval = setInterval(() => {
    loadOnlinePlayers();
  }, 10000);

  return () => {
    clearInterval(presenceInterval);
    clearInterval(onlinePlayersInterval);
  };
}, [
  loggedInPlayer?.id,
  loggedInPlayer?.name,
  loggedInPlayer?.avatar,
  loggedInPlayer?.cardPhoto,
  tab,
]);
  

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function loadCloudState() {
    setLoading(true);

    const { data, error } = await supabase
      .from("shadowborn_state")
      .select("data")
      .eq("id", STORAGE_ROW_ID)
      .single();

    if (!error && data?.data && Object.keys(data.data).length > 0) {
      setState({
        ...defaultState,
        ...data.data,
        players: data.data.players || defaultPlayers,
        playerPins: data.data.playerPins || PLAYER_PINS,
        tournament: { ...emptyTournament, ...(data.data.tournament || {}) },
        hallOfFame: data.data.hallOfFame || [],
        callouts: data.data.callouts || [],
        recommendations: data.data.recommendations || [],
        rankRequests: data.data.rankRequests || [],
        seasonHistory: data.data.seasonHistory || [],
        poll: data.data.poll?.options?.length === 9 ? data.data.poll : defaultState.poll,
        sundayTeams: data.data.sundayTeams || [],
        sundayRounds: data.data.sundayRounds || [],
      });
      setSundayTeams(data.data.sundayTeams || []);
      setSundayRounds(data.data.sundayRounds || []);
    } else {
      await supabase
        .from("shadowborn_state")
        .upsert({ id: STORAGE_ROW_ID, data: defaultState, updated_at: new Date().toISOString() });
      setState(defaultState);
      setSundayTeams([]);
      setSundayRounds([]);
    }
    setLoading(false);
  }

  function saveCloudState(nextState) {
    if (saveTimer) clearTimeout(saveTimer);

    const timer = setTimeout(async () => {
      setSaving(true);
      await supabase
        .from("shadowborn_state")
        .upsert({ id: STORAGE_ROW_ID, data: nextState, updated_at: new Date().toISOString() });
      setSaving(false);
    }, 500);

    setSaveTimer(timer);
  }

  function updateState(updater) {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveCloudState(next);
      return next;
    });
  }
  function isPinAlreadyUsed(pinToCheck, excludedPlayerId = null) {
  const cleanPin = String(pinToCheck || "").trim();

  if (!cleanPin) return false;

  return Object.entries(state.playerPins || {}).some(
    ([playerId, savedPin]) =>
      String(savedPin || "").trim() === cleanPin &&
      Number(playerId) !== Number(excludedPlayerId)
  );
}
function auditPlayerPins() {
  if (!canAdmin) return;

  const pinsByValue = {};
  const missingPins = [];
  const invalidPins = [];

  players.forEach((player) => {
    const savedPin =
      state.playerPins?.[player.id] ||
      PLAYER_PINS?.[player.id] ||
      "";

    const cleanPin = String(savedPin).trim();

    if (!cleanPin) {
      missingPins.push(player.name);
      return;
    }

    if (!/^\d{4}$/.test(cleanPin)) {
      invalidPins.push(
        `${player.name}: ${cleanPin}`
      );
    }

    if (!pinsByValue[cleanPin]) {
      pinsByValue[cleanPin] = [];
    }

    pinsByValue[cleanPin].push(player.name);
  });

  const duplicatePins = Object.entries(pinsByValue)
    .filter(([, playerNames]) => playerNames.length > 1)
    .map(
      ([pinValue, playerNames]) =>
        `PIN ${pinValue}: ${playerNames.join(", ")}`
    );

  let report = "PLAYER PIN AUDIT\n\n";

  if (duplicatePins.length === 0) {
    report += "✅ No duplicate PINs found.\n\n";
  } else {
    report += "⚠️ DUPLICATE PINS:\n";
    report += duplicatePins.join("\n");
    report += "\n\n";
  }

  if (missingPins.length === 0) {
    report += "✅ Every player has a PIN.\n\n";
  } else {
    report += "⚠️ PLAYERS WITHOUT PINS:\n";
    report += missingPins.join("\n");
    report += "\n\n";
  }

  if (invalidPins.length === 0) {
    report += "✅ All PINs contain exactly 4 numbers.";
  } else {
    report += "⚠️ INVALID PINS:\n";
    report += invalidPins.join("\n");
  }

  alert(report);
}
function loginWithPin() {
  const cleanPin = String(pin || "").trim();

  if (!/^\d{4}$/.test(cleanPin)) {
    setLoginError("Enter your 4-digit player PIN.");
    return;
  }

  const matchingPinEntry = Object.entries(
    state.playerPins || {}
  ).find(
    ([, savedPin]) =>
      String(savedPin || "").trim() === cleanPin
  );

  if (!matchingPinEntry) {
    setLoginError("Incorrect PIN.");
    return;
  }

  const [matchingPlayerId] = matchingPinEntry;

  const chosen = players.find(
    (player) =>
      Number(player.id) === Number(matchingPlayerId)
  );

  if (!chosen) {
    setLoginError(
      "No player profile is linked to this PIN."
    );
    return;
  }

  setPin("");
setLoginError("");

setLoginIntroPlayer(chosen);
setLoginIntroVisible(true);

setTimeout(() => {
  setAuth({
    playerId: chosen.id,
    playerName: chosen.name,
    role: chosen.role,
  });

  setTab("dashboard");
}, 3600);

setTimeout(() => {
  setLoginIntroVisible(false);
  setLoginIntroPlayer(null);
}, 4200);
}

function getPresencePageName(currentTab) {
  const pageNames = {
    dashboard: "Dashboard",
    players: "Players",
    leaderboard: "Leaderboard",
    tournament: "Tournament",
    callouts: "Call-outs",
    sunday: "Sunday Games",
    recommendations: "Recommendations",
    divisions: "Divisions",
    hallOfFame: "Hall of Fame",
    challenges: "Challenges",
  };

  return pageNames[currentTab] || "Shadowborn ZA";
}
async function updateMyPresence() {
  if (!loggedInPlayer) return;

  const presenceData = {
    player_id: Number(loggedInPlayer.id),
    player_name: loggedInPlayer.name,
    avatar_url:
      loggedInPlayer.avatar ||
      loggedInPlayer.cardPhoto ||
      "",
    current_page: getPresencePageName(tab),
    last_seen: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("shadowborn_presence")
    .upsert(presenceData, {
      onConflict: "player_id",
    });

  if (error) {
    console.error("Presence update failed:", error);
  }
}

async function loadOnlinePlayers() {
  const onlineCutoff = new Date(
    Date.now() - 75 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("shadowborn_presence")
    .select("*")
    .gte("last_seen", onlineCutoff)
    .order("last_seen", {
      ascending: false,
    });

  if (error) {
    console.error("Online players load failed:", error);
    return;
  }

  setOnlinePlayers(data || []);
}

async function removeMyPresence() {
  if (!loggedInPlayer) return;

  await supabase
    .from("shadowborn_presence")
    .delete()
    .eq("player_id", Number(loggedInPlayer.id));
}
  async function logout() {
    await removeMyPresence();
    setAuth(null);
    setPin("");
    setSelectedLoginPlayerId("");
    setLoginError("");
    setLoginIntroVisible(false);
setLoginIntroPlayer(null);
    setTab("dashboard");
  }

  function findTeam(teamId) {
    return tournament.teams.find((t) => t.id === teamId);
  }

  function getTeamName(team) {
    if (!team) return "TBD";

    if (tournament.format === "1v1") {
      const single = players.find((p) => p.id === team.members[0]);
      return single?.name || team.name;
    }

    return `${team.name} • ${team.members
      .map((id) => players.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(" / ")}`;
  }

  function teamHasLoggedInPlayer(team) {
    if (!team || !loggedInPlayer) return false;
    return team.members.includes(loggedInPlayer.id);
  }

  function canTeamAEdit(match) {
    return teamHasLoggedInPlayer(findTeam(match.teamAId)) && !match.locked;
  }

  function canTeamBConfirm(match) {
    return teamHasLoggedInPlayer(findTeam(match.teamBId)) && !match.locked && match.submittedByTeamA;
  }

  function updatePlayer(id, field, value) {
    updateState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]: ["points", "tournamentWins", "wins", "losses", "mvpPoints", "activityPoints", "competitiveRating", "crAdjustment", "trainingAttended", "trainingMissed"].includes(field)
                ? Number(value) || 0
                : value,
            }
          : p
      ),
    }));
  }
    async function uploadAvatar(playerId, file) {
    if (!file) return;

    const extension = file.name.split(".").pop();
    const fileName = `player-${playerId}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      alert("Avatar upload failed.");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    updatePlayer(playerId, "avatar", publicUrl);
  }
   async function uploadBanner(playerId, file) {
  alert("Banner button worked");

  if (!file) {
    alert("No file selected");
    return;
  }

  alert("File selected: " + file.name);

  const extension = file.name.split(".").pop();
  const fileName = `banner-${playerId}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("banners")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    alert("Banner upload failed: " + error.message);
    console.error(error);
    return;
  }

  const { data } = supabase.storage.from("banners").getPublicUrl(fileName);

  updatePlayer(playerId, "banner", data.publicUrl);

  alert("Banner uploaded successfully");
}
async function uploadCardPhoto(playerId, file) {
  if (!file) return;

  const player = players.find((p) => Number(p.id) === Number(playerId));

  if (!player) {
    alert("Player could not be found.");
    return;
  }

  const canChangeCardPhoto =
    canAdmin ||
    Number(loggedInPlayer?.id) === Number(playerId);

  if (!canChangeCardPhoto) {
    alert("You can only change your own player-card photo.");
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    alert("Please select a JPG, PNG or WEBP image.");
    return;
  }

  const maximumFileSize = 8 * 1024 * 1024;

  if (file.size > maximumFileSize) {
    alert("The image is too large. Please use an image smaller than 8 MB.");
    return;
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName =
    `card-photo-${playerId}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Card photo upload error:", error);
    alert("Card photo upload failed: " + error.message);
    return;
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  updatePlayer(playerId, "cardPhoto", data.publicUrl);

  alert("Player-card photo uploaded successfully.");
}
function chooseAvatar(playerId) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async () => {
    const file = input.files?.[0];
    await uploadAvatar(playerId, file);
  };

  input.click();
}

function chooseBanner(playerId) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async () => {
    const file = input.files?.[0];
    await uploadBanner(playerId, file);
  };

  input.click();
}
function chooseCardPhoto(playerId) {
  const player = players.find(
    (p) => Number(p.id) === Number(playerId)
  );

  if (!player) {
    alert("Player could not be found.");
    return;
  }

  const canChangeCardPhoto =
    canAdmin ||
    Number(loggedInPlayer?.id) === Number(playerId);

  if (!canChangeCardPhoto) {
    alert("You can only change your own player-card photo.");
    return;
  }

  const input = document.createElement("input");

  input.type = "file";
  input.accept = "image/jpeg,image/png,image/webp";

  input.onchange = async () => {
    const file = input.files?.[0];

    if (!file) return;

    await uploadCardPhoto(playerId, file);
  };

  input.click();
}
async function uploadRankProof(file) {
  if (!file || !loggedInPlayer) return;

  const extension = file.name.split(".").pop();
  const fileName = `rank-proof-${loggedInPlayer.id}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("rank-proofs")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    alert("Rank proof upload failed: " + error.message);
    return;
  }

  const { data } = supabase.storage.from("rank-proofs").getPublicUrl(fileName);

  setRankRequestDraft((prev) => ({
    ...prev,
    proofUrl: data.publicUrl,
  }));

  alert("Screenshot uploaded successfully.");
}

function chooseRankProof() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async () => {
    const file = input.files?.[0];
    await uploadRankProof(file);
  };

  input.click();
}
  function addPlayer() {
    if (!canAdmin) return;
if (!newPlayer.name.trim()) {
  alert("Please enter the player's name.");
  return;
}

const cleanPin = String(newPlayer.pin || "").trim();

if (!/^\d{4}$/.test(cleanPin)) {
  alert("The login PIN must contain exactly 4 numbers.");
  return;
}

if (isPinAlreadyUsed(cleanPin)) {
  alert(
    "That PIN is already assigned to another player. Please choose a different PIN."
  );
  return;
}

const nextId = Math.max(...players.map((p) => p.id), 0) + 1;
    updateState((prev) => ({
  ...prev,

  playerPins: {
    ...(prev.playerPins || {}),
    [nextId]: cleanPin,
  },

  players: [
    
        ...prev.players,
        {
          id: nextId,
          name: newPlayer.name.trim(),
          emblem: (newPlayer.emblem || newPlayer.name.slice(0, 2)).toUpperCase(),
          points: Number(newPlayer.points) || 0,
          tournamentWins: Number(newPlayer.tournamentWins) || 0,
          wins: 0,
          losses: 0,
          mvpPoints: 0,
          activityPoints: 0,
          avatar: "",
banner: "",
cardPhoto: "",

role: newPlayer.role,
teamRole: "challenger",

division: 0,
isDivisionCaptain: false,

competitiveRating: 0,
playStyle: "",

trainingAttended: 0,
trainingMissed: 0,
codRank: "",

legacyStats: {
  seasonsPlayed: 0,

  division1Seasons: 0,
  division2Seasons: 0,
  division3Seasons: 0,

  captainSeasons: 0,
  allStarSelections: 0,

  smgChampionFinishes: 0,
  arChampionFinishes: 0,

  careerWins: 0,
  careerLosses: 0,
  careerMvpPoints: 0,
  careerTournamentWins: 0,

  highestCr: 0,
  highestSeasonWins: 0,

  seasonHistory: [],
},
        },
      ],
    }));

    setNewPlayer({
      name: "",
      emblem: "",
      points: 0,
      tournamentWins: 0,
      pin: "",
      avatar: "",
      role: "player",
    });
  }
  function removePlayer(playerId) {
    if (!canAdmin) return;

     updateState((prev) => ({
      ...prev,
    players: prev.players.filter((p) => p.id !== playerId),
  }));
}
function archiveSeasonAndReset() {
  if (!canAdmin) return;

  const seasonName = window.prompt(
    "Season name?",
    `BO7 Season ${new Date().toLocaleDateString()}`
  );

  if (!seasonName) return;
if (
  !window.confirm(
    "Archive the Top 2 SMG and Top 2 AR players and start a new Competitive Season?"
  )
)
  return;
  

  const smgTop2 = smgPlayers.slice(0, 2).map((p, index) => ({
  position: index + 1,
  weaponType: "SMG",
  playerId: p.id,
  playerName: p.name,
  points: getCompetitiveScore(p),
  rank: getRank(getCompetitiveScore(p)).name,
  tournamentWins: p.tournamentWins,
  wins: p.wins,
  losses: p.losses,
}));

const arTop2 = arPlayers.slice(0, 2).map((p, index) => ({
  position: index + 1,
  weaponType: "AR",
  playerId: p.id,
  playerName: p.name,
  points: getCompetitiveScore(p),
  rank: getRank(getCompetitiveScore(p)).name,
  tournamentWins: p.tournamentWins,
  wins: p.wins,
  losses: p.losses,
}));

const top4 = [
  ...smgTop2,
  ...arTop2,
];

  updateState((prev) => ({
    ...prev,
    seasonHistory: [
      {
        id: Date.now(),
        seasonName,
        endedAt: new Date().toLocaleString(),
        top4,
      },
      ...(prev.seasonHistory || []),
    ],
    players: prev.players.map((p) => ({
  ...p,

  // Leaderboard
  points: 0,
  wins: 0,
  losses: 0,
  mvpPoints: 0,
  activityPoints: 0,
  tournamentWins: 0,

  // CR System
  weeklyChallenges: 0,
  trainingAttended: 0,
  trainingMissed: 0,
  crAdjustment: 0,

  // Call-outs (if you use these)
  calloutWins: 0,
  calloutLosses: 0,
})),
  }));

  alert(
  "🏆 Season archived successfully!\n\n" +
  "Archived:\n" +
  "• Top 2 SMG Champions\n" +
  "• Top 2 AR Champions\n\n" +
  "All Competitive Rating (CR) stats have been reset for the new season."
);
}
function resetPlayerStats(playerId) {
  if (!canAdmin) return;

  updateState((prev) => ({
    ...prev,
    players: prev.players.map((p) =>
      p.id === playerId
        ? {
            ...p,
            points: 0,
            wins: 0,
            losses: 0,
            tournamentWins: 0,
            mvpPoints: 0,
            activityPoints: 0,
          }
        : p
    ),
  }));
}

function clearPlayerAvatar(playerId) {
  if (!canAdmin) return;
  updatePlayer(playerId, "avatar", "");
}
function clearPlayerCardPhoto(playerId) {
  const canChangeCardPhoto =
    canAdmin ||
    Number(loggedInPlayer?.id) === Number(playerId);

  if (!canChangeCardPhoto) return;

  if (
    !window.confirm(
      "Remove this player-card photo?"
    )
  ) {
    return;
  }

  updatePlayer(playerId, "cardPhoto", "");
}
function clearPlayerBanner(playerId) {
  if (!canAdmin) return;
  updatePlayer(playerId, "banner", "");
}

  function createManualTeam() {
    if (!canAdmin) return;

    const draft = tournament.teamDraft;
    const size = getTeamSize(tournament.format);

    if (!draft.name.trim()) return;
    if (draft.memberIds.length !== size) return;

    const nextId = Date.now();

    updateState((prev) => ({
      ...prev,
      tournament: {
        ...prev.tournament,
        teams: [
          ...prev.tournament.teams,
          {
            id: nextId,
            name: draft.name,
            members: draft.memberIds,
          },
        ],
        teamDraft: {
          name: "",
          memberIds: [],
        },
      },
    }));
  }

  function toggleDraftMember(playerId) {
    if (!canAdmin) return;

    const maxSize = getTeamSize(tournament.format);

    updateState((prev) => {
      const draft = prev.tournament.teamDraft;

      let nextMembers = [...draft.memberIds];

      if (nextMembers.includes(playerId)) {
        nextMembers = nextMembers.filter((id) => id !== playerId);
      } else {
        if (nextMembers.length >= maxSize) return prev;
        nextMembers.push(playerId);
      }

      return {
        ...prev,
        tournament: {
          ...prev.tournament,
          teamDraft: {
            ...draft,
            memberIds: nextMembers,
          },
        },
      };
    });
  }

  function deleteTeam(teamId) {
    if (!canAdmin) return;

    updateState((prev) => ({
      ...prev,
      tournament: {
        ...prev.tournament,
        teams: prev.tournament.teams.filter((t) => t.id !== teamId),
      },
    }));
  }

  function generateTournament() {
    if (!canAdmin || tournament.teams.length < 2) return;

    updateState((prev) => {
      const teamIds = [...prev.tournament.teams.map((t) => t.id)];

      for (let i = teamIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [teamIds[i], teamIds[j]] = [teamIds[j], teamIds[i]];
      }

      const firstRound = pairTeams(teamIds, "W", 1);

      return {
        ...prev,
        championBanner: null,
        tournament: {
          ...prev.tournament,
          activeWinners: firstRound.matches,
          activeRedemption: [],
          completedRounds: [],
          winnersCarry: firstRound.carry,
          redemptionCarry: null,
          grandFinal: null,
          championTeamId: null,
          placementPointsAwarded: false,
          thirdPlaceAwarded: false,
          thirdPlaceTeamId: null,
          status: "Live",
          winnersStage: 1,
          redemptionStage: 1,
        },
      };
    });

    setTab("bracket");
  }

  function awardTeamPoints(playersList, teamsList, teamId, pointsToAdd, statType = null) {
    const team = teamsList.find((t) => t.id === teamId);
    if (!team) return playersList;

    return playersList.map((p) => {
      if (!team.members.includes(p.id)) return p;

      return {
        ...p,
        points: (Number(p.points) || 0) + pointsToAdd,
        wins: statType === "win" ? (Number(p.wins) || 0) + 1 : p.wins,
        losses: statType === "loss" ? (Number(p.losses) || 0) + 1 : p.losses,
        tournamentWins:
          statType === "champion" ? (Number(p.tournamentWins) || 0) + 1 : p.tournamentWins,
      };
    });
  }

  function applyMatchPoints(playersList, teamsList, match) {
    if (!match.locked || !match.winnerId || !match.loserId || match.pointsAwarded) {
      return playersList;
    }

    let updated = awardTeamPoints(playersList, teamsList, match.winnerId, 10, "win");
    updated = awardTeamPoints(updated, teamsList, match.loserId, 5, "loss");

    return updated;
  }

  function updateMatchField(matchId, field, value) {
    updateState((prev) => {
      const apply = (arr) =>
        arr.map((m) => {
          if (m.id !== matchId || m.locked) return m;

          const teamA = prev.tournament.teams.find((t) => t.id === m.teamAId);
          const isTeamAPlayer = teamA?.members.includes(loggedInPlayer?.id);

          if (!canAdmin && !isTeamAPlayer) return m;

          return {
            ...m,
            [field]: value,
            submittedByTeamA: false,
            teamBConfirmed: false,
            winnerId: null,
            loserId: null,
            pointsAwarded: false,
          };
        });

      return {
        ...prev,
        tournament: {
          ...prev.tournament,
          activeWinners: apply(prev.tournament.activeWinners),
          activeRedemption: apply(prev.tournament.activeRedemption),
          grandFinal:
            prev.tournament.grandFinal?.id === matchId
              ? apply([prev.tournament.grandFinal])[0]
              : prev.tournament.grandFinal,
        },
      };
    });
  }

  function submitByTeamA(matchId) {
    updateState((prev) => {
      const apply = (arr) =>
        arr.map((m) => {
          if (m.id !== matchId || m.locked) return m;

          const teamA = prev.tournament.teams.find((t) => t.id === m.teamAId);
          const isTeamAPlayer = teamA?.members.includes(loggedInPlayer?.id);

          if (!canAdmin && !isTeamAPlayer) return m;

          const scoreA = Number(m.scoreA);
          const scoreB = Number(m.scoreB);

          if (Number.isNaN(scoreA) || Number.isNaN(scoreB) || scoreA === scoreB) {
            alert("Please enter a valid winning score. Draws are not allowed.");
            return m;
          }

          return {
            ...m,
            submittedByTeamA: true,
            teamBConfirmed: false,
          };
        });

      return {
        ...prev,
        tournament: {
          ...prev.tournament,
          activeWinners: apply(prev.tournament.activeWinners),
          activeRedemption: apply(prev.tournament.activeRedemption),
          grandFinal:
            prev.tournament.grandFinal?.id === matchId
              ? apply([prev.tournament.grandFinal])[0]
              : prev.tournament.grandFinal,
        },
      };
    });
  }

  function confirmByTeamB(matchId) {
    updateState((prev) => {
      const finalize = (match) => {
        if (match.id !== matchId || match.locked) return match;

        const teamB = prev.tournament.teams.find((t) => t.id === match.teamBId);
        const isTeamBPlayer = teamB?.members.includes(loggedInPlayer?.id);

        if (!canAdmin && !isTeamBPlayer) return match;
        if (!match.submittedByTeamA && !canAdmin) return match;

        const scoreA = Number(match.scoreA);
        const scoreB = Number(match.scoreB);

        if (Number.isNaN(scoreA) || Number.isNaN(scoreB) || scoreA === scoreB) {
          alert("Please enter a valid winning score. Draws are not allowed.");
          return match;
        }

        return {
          ...match,
          submittedByTeamA: true,
          teamBConfirmed: true,
          locked: true,
          winnerId: scoreA > scoreB ? match.teamAId : match.teamBId,
          loserId: scoreA > scoreB ? match.teamBId : match.teamAId,
        };
      };

      const activeWinners = prev.tournament.activeWinners.map(finalize);
      const activeRedemption = prev.tournament.activeRedemption.map(finalize);
      const grandFinal =
        prev.tournament.grandFinal?.id === matchId
          ? finalize(prev.tournament.grandFinal)
          : prev.tournament.grandFinal;

      let nextPlayers = prev.players;

      [...activeWinners, ...activeRedemption, ...(grandFinal ? [grandFinal] : [])].forEach((match) => {
        if (match.id === matchId && match.locked && !match.pointsAwarded) {
          nextPlayers = applyMatchPoints(nextPlayers, prev.tournament.teams, match);
        }
      });

      const markPointsAwarded = (arr) =>
        arr.map((m) =>
          m.id === matchId && m.locked ? { ...m, pointsAwarded: true } : m
        );

      let nextTournament = {
        ...prev.tournament,
        activeWinners: markPointsAwarded(activeWinners),
        activeRedemption: markPointsAwarded(activeRedemption),
        grandFinal:
          grandFinal?.id === matchId && grandFinal.locked
            ? { ...grandFinal, pointsAwarded: true }
            : grandFinal,
      };
if (
  grandFinal?.id === matchId &&
  grandFinal.locked &&
  grandFinal.winnerId &&
  !prev.tournament.placementPointsAwarded
) {
  nextPlayers = awardTeamPoints(nextPlayers, prev.tournament.teams, grandFinal.winnerId, 80, "champion");
  nextPlayers = awardTeamPoints(nextPlayers, prev.tournament.teams, grandFinal.loserId, 60, null);

  if (prev.tournament.thirdPlaceTeamId) {
    nextPlayers = awardTeamPoints(nextPlayers, prev.tournament.teams, prev.tournament.thirdPlaceTeamId, 40, null);
  }

  nextTournament = {
    ...nextTournament,
    placementPointsAwarded: true,
  };
}
      const advanced = autoAdvanceTournament(nextTournament, nextPlayers);

      return {
        ...prev,
        players: advanced.players,
        tournament: advanced.tournament,
        championBanner: advanced.championBanner ?? prev.championBanner,
        hallOfFame: advanced.hallOfFame ?? prev.hallOfFame,
      };
    });
  }

  function autoAdvanceTournament(tournamentData, playersData) {
    let t = { ...tournamentData };
    let p = [...playersData];
    let newChampionBanner = null;
    let newHallOfFame = null;

    if (t.championTeamId) {
      return { tournament: t, players: p };
    }

    if (t.grandFinal && t.grandFinal.locked && t.grandFinal.winnerId) {
      const championTeam = t.teams.find((team) => team.id === t.grandFinal.winnerId);
      const secondTeam = t.teams.find((team) => team.id === t.grandFinal.loserId);

    if (!t.placementPointsAwarded) {
  const firstPlaceTeamId = t.grandFinal.winnerId;
  const secondPlaceTeamId = t.grandFinal.loserId;
  const thirdPlaceTeamId = t.thirdPlaceTeamId;

  p = awardTeamPoints(p, t.teams, firstPlaceTeamId, 80, "champion");
  p = awardTeamPoints(p, t.teams, secondPlaceTeamId, 60, null);

  if (thirdPlaceTeamId) {
    p = awardTeamPoints(p, t.teams, thirdPlaceTeamId, 40, null);
  }

  t = {
    ...t,
    placementPointsAwarded: true,
  };
}

      newChampionBanner = {
        teamId: championTeam?.id,
        teamName: championTeam ? getTeamName(championTeam) : "Champion",
        createdAt: new Date().toLocaleDateString(),
      };

      newHallOfFame = [
        {
          id: Date.now(),
          championTeamId: championTeam?.id,
          championName: championTeam ? getTeamName(championTeam) : "Champion",
          secondPlaceTeamId: secondTeam?.id,
          secondPlaceName: secondTeam ? getTeamName(secondTeam) : "Second Place",
          tournamentTitle: t.title,
          createdAt: new Date().toLocaleDateString(),
        },
        ...(state.hallOfFame || []),
      ];

      return {
        tournament: {
          ...t,
          completedRounds: [...t.completedRounds, t.grandFinal],
          grandFinal: null,
          championTeamId: t.grandFinal.winnerId,
          status: "Finished",
          placementPointsAwarded: true,
        },
        players: p,
        championBanner: newChampionBanner,
        hallOfFame: newHallOfFame,
      };
    }

    while (
      allLocked(t.activeWinners) &&
      allLocked(t.activeRedemption) &&
      (t.activeWinners.length > 0 || t.activeRedemption.length > 0)
    ) {
      const winnersAdvancing = [
        ...(t.winnersCarry ? [t.winnersCarry] : []),
        ...getOfficialWinners(t.activeWinners),
      ];

      const droppedToRedemption = getOfficialLosers(t.activeWinners);

      const redemptionSurvivors = [
        ...(t.redemptionCarry ? [t.redemptionCarry] : []),
        ...getOfficialWinners(t.activeRedemption),
      ];

      const redemptionEliminated = getOfficialLosers(t.activeRedemption);

      let nextRedemptionPool = [...redemptionSurvivors, ...droppedToRedemption];

      let completed = [
        ...t.completedRounds,
        ...t.activeWinners,
        ...t.activeRedemption,
      ];

      if (
        winnersAdvancing.length === 1 &&
        nextRedemptionPool.length === 1
      ) {
        const thirdPlaceTeamId = redemptionEliminated[0] || null;

        const finalMatch = pairTeams(
          [winnersAdvancing[0], nextRedemptionPool[0]],
          "GF",
          1
        ).matches[0];

        t = {
          ...t,
          thirdPlaceTeamId,
          activeWinners: [],
          activeRedemption: [],
          winnersCarry: null,
          redemptionCarry: null,
          grandFinal: finalMatch,
          completedRounds: completed,
          status: "Grand Final",
          thirdPlaceAwarded: true,
        };

        break;
      }

      if (
        winnersAdvancing.length === 1 &&
        nextRedemptionPool.length === 0
      ) {
        p = awardTeamPoints(p, t.teams, winnersAdvancing[0], 80, "champion");

        const championTeam = t.teams.find((team) => team.id === winnersAdvancing[0]);

        newChampionBanner = {
          teamId: championTeam?.id,
          teamName: championTeam ? getTeamName(championTeam) : "Champion",
          createdAt: new Date().toLocaleDateString(),
        };

        newHallOfFame = [
          {
            id: Date.now(),
            championTeamId: championTeam?.id,
            championName: championTeam ? getTeamName(championTeam) : "Champion",
            tournamentTitle: t.title,
            createdAt: new Date().toLocaleDateString(),
          },
          ...(state.hallOfFame || []),
        ];

        t = {
          ...t,
          activeWinners: [],
          activeRedemption: [],
          winnersCarry: null,
          redemptionCarry: null,
          completedRounds: completed,
          championTeamId: winnersAdvancing[0],
          status: "Finished",
          placementPointsAwarded: true,
        };

        break;
      }

      const nextWStage = t.winnersStage + 1;
      const nextLStage = t.redemptionStage + 1;

      const nextWinners =
        winnersAdvancing.length > 1
          ? pairTeams(winnersAdvancing, "W", nextWStage)
          : { matches: [], carry: winnersAdvancing[0] || null };

      const nextRedemption =
        nextRedemptionPool.length > 1
          ? pairTeams(nextRedemptionPool, "L", nextLStage)
          : { matches: [], carry: nextRedemptionPool[0] || null };

      t = {
        ...t,
        activeWinners: nextWinners.matches,
        activeRedemption: nextRedemption.matches,
        winnersCarry: nextWinners.carry,
        redemptionCarry: nextRedemption.carry,
        completedRounds: completed,
        winnersStage: nextWStage,
        redemptionStage: nextLStage,
        status: "Live",
      };
    }

    return {
      tournament: t,
      players: p,
      championBanner: newChampionBanner,
      hallOfFame: newHallOfFame,
    };
  }

  function advanceBracket() {
    if (!canAdmin) return;

    updateState((prev) => {
      const advanced = autoAdvanceTournament(prev.tournament, prev.players);

      return {
        ...prev,
        players: advanced.players,
        tournament: advanced.tournament,
        championBanner: advanced.championBanner ?? prev.championBanner,
        hallOfFame: advanced.hallOfFame ?? prev.hallOfFame,
      };
    });
  }

  function finalizeChampion() {
    if (!canAdmin) return;

    updateState((prev) => {
      const advanced = autoAdvanceTournament(prev.tournament, prev.players);

      return {
        ...prev,
        players: advanced.players,
        tournament: advanced.tournament,
        championBanner: advanced.championBanner ?? prev.championBanner,
        hallOfFame: advanced.hallOfFame ?? prev.hallOfFame,
      };
    });
  }
  function submitCallout() {
  if (!loggedInPlayer) return;
  if (!calloutDraft.challengedId) return;

  const challengedPlayer = players.find((p) => p.id === Number(calloutDraft.challengedId));
  const challengerIndex = sortedPlayers.findIndex((p) => p.id === loggedInPlayer.id);
  const challengedIndex = sortedPlayers.findIndex((p) => p.id === Number(calloutDraft.challengedId));
  const distance = Math.abs(challengerIndex - challengedIndex);

  if (distance > 2 || distance === 0) {
    alert("You may only call out players within 2 positions above or below.");
    return;
  }

  updateState((prev) => ({
    ...prev,
    callouts: [
      {
        id: Date.now(),
        challengerId: loggedInPlayer.id,
        challengedId: Number(calloutDraft.challengedId),
        scoreA: "",
        scoreB: "",
        status: "pending",
        accepted: false,
        confirmed: false,
        winnerId: null,
        loserId: null,
        createdAt: new Date().toLocaleDateString(),
      },
      ...prev.callouts,
    ],
  }));

  fetch("/api/post-discord-callout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    challengerName: loggedInPlayer.name,
    challengedName: challengedPlayer?.name || "Unknown",
  }),
})
  .then(async (res) => {
    const data = await res.json();

    if (!res.ok) {
      alert("Discord callout failed: " + (data.error || "Unknown error"));
    } else {
      alert("Discord callout sent!");
    }
  })
  .catch((error) => {
    alert("Discord callout error: " + error.message);
  });

  setCalloutDraft({ challengedId: "" });
}

function acceptCallout(calloutId) {
  updateState((prev) => ({
    ...prev,
    callouts: prev.callouts.map((c) =>
      c.id === calloutId ? { ...c, status: "accepted", accepted: true } : c
    ),
  }));

  setTab("callouts");
}

function forfeitCallout(calloutId) {
  updateState((prev) => {
    const callout = prev.callouts.find((c) => c.id === calloutId);
    if (!callout || callout.status !== "pending") return prev;

    return {
      ...prev,
      players: prev.players.map((p) => {
  if (p.id === callout.challengerId) {
    return { ...p, points: Number(p.points || 0) + 10 };
  }
  if (p.id === callout.challengedId) {
    return { ...p, points: Number(p.points || 0) - 10 };
  }
  return p;
}),
      callouts: prev.callouts.map((c) =>
        c.id === calloutId
          ? { ...c, status: "forfeit", confirmed: true }
          : c
      ),
    };
  });

  setTab("callouts");
}
function deleteCallout(calloutId) {
  if (!canAdmin) return;

  updateState((prev) => ({
    ...prev,
    callouts: prev.callouts.filter((c) => c.id !== calloutId),
  }));
}
function confirmCallout(calloutId) {
  updateState((prev) => {
    const callout = prev.callouts.find((c) => c.id === calloutId);

    if (!callout || callout.confirmed || callout.status !== "accepted") return prev;

    const scoreA = Number(callout.scoreA);
    const scoreB = Number(callout.scoreB);

    if (Number.isNaN(scoreA) || Number.isNaN(scoreB) || scoreA === scoreB) {
      alert("Please enter a valid winning score. Draws are not allowed.");
      return prev;
    }

    const winnerId = scoreA > scoreB ? callout.challengerId : callout.challengedId;
    const loserId = scoreA > scoreB ? callout.challengedId : callout.challengerId;

    return {
      ...prev,
      callouts: prev.callouts.map((c) =>
        c.id === calloutId
          ? { ...c, confirmed: true, status: "confirmed", winnerId, loserId }
          : c
      ),
      players: prev.players.map((p) => {
        if (p.id === winnerId) return { ...p, points: Number(p.points || 0) + 10 };
        if (p.id === loserId) return { ...p, points: Number(p.points || 0) - 10 };
        return p;
      }),
    };
  });
}
function toggleSundayPlayer(playerId) {
  setSundaySelectedPlayers((prev) =>
    prev.includes(playerId)
      ? prev.filter((id) => id !== playerId)
      : [...prev, playerId]
  );
}
function toggleSundaySubstitute(teamType, playerId) {
  if (!canAdmin) return;

  const field =
    teamType === "winning"
      ? "winningSubstituteIds"
      : "losingSubstituteIds";

  const otherField =
    teamType === "winning"
      ? "losingSubstituteIds"
      : "winningSubstituteIds";

  setSundayEntry((prev) => {
    const currentIds = (prev[field] || []).map(Number);
    const otherIds = (prev[otherField] || []).map(Number);
    const id = Number(playerId);

    if (
      (prev.winningTeamIds || []).map(Number).includes(id) ||
      (prev.losingTeamIds || []).map(Number).includes(id)
    ) {
      alert("This player is already selected in a main team.");
      return prev;
    }

    if (otherIds.includes(id)) {
      alert("This player is already selected for the other team.");
      return prev;
    }

    return {
      ...prev,
      [field]: currentIds.includes(id)
        ? currentIds.filter((selectedId) => selectedId !== id)
        : [...currentIds, id],
    };
  });
}
function generateSundayTeams() {
  if (!canAdmin) return;

  const selectedPlayers = players
    .filter((p) => sundaySelectedPlayers.includes(p.id))
    .sort((a, b) => getCompetitiveScore(b) - getCompetitiveScore(a));

  if (selectedPlayers.length < 2) {
    alert("Select at least 2 players.");
    return;
  }

  const teamCount = Number(sundayTeamCount) || 2;

  if (selectedPlayers.length < teamCount) {
    alert("Not enough players for selected team count.");
    return;
  }

  const maxTeamSize = Math.ceil(selectedPlayers.length / teamCount);

  const teams = Array.from({ length: teamCount }, (_, index) => ({
    name: `Team ${index + 1}`,
    players: [],
    totalCR: 0,
  }));

  selectedPlayers.forEach((player) => {
    const availableTeams = teams.filter((team) => team.players.length < maxTeamSize);

    availableTeams.sort((a, b) => {
      if (a.players.length !== b.players.length) {
        return a.players.length - b.players.length;
      }
      return a.totalCR - b.totalCR;
    });

    const targetTeam = availableTeams[0];

    targetTeam.players.push(player);
    targetTeam.totalCR += getCompetitiveScore(player);
  });

  setSundayTeams(teams);
}
function applyGeneratedSundayTeam(teamType, teamIndex) {
  const team = sundayTeams[teamIndex];
  if (!team) return;

  const allPlayerIds = team.players.map((p) => Number(p.id));

  // First 4 are the main players.
  const mainPlayerIds = allPlayerIds.slice(0, 4);

  // Anyone after the first 4 becomes a rotation/substitute.
  const substituteIds = allPlayerIds.slice(4);

  setSundayEntry((prev) => {
    if (teamType === "winning") {
      return {
        ...prev,
        winningTeamIds: mainPlayerIds,
        winningSubstituteIds: substituteIds,
      };
    }

    return {
      ...prev,
      losingTeamIds: mainPlayerIds,
      losingSubstituteIds: substituteIds,
    };
  });
}
function createSundayRound() {
  if (!canAdmin) return;

  if (!sundayTeams.length) {
    alert("Lock or generate Sunday teams first.");
    return;
  }

  if (
    sundayRoundDraft.teamAIndex === "" ||
    sundayRoundDraft.teamBIndex === ""
  ) {
    alert("Select Team A and Team B.");
    return;
  }

  if (sundayRoundDraft.teamAIndex === sundayRoundDraft.teamBIndex) {
    alert("Team A and Team B cannot be the same team.");
    return;
  }

  const round = {
    id: Date.now(),
    roundName: sundayRoundDraft.roundName || `Round ${sundayRounds.length + 1}`,
    teamAIndex: Number(sundayRoundDraft.teamAIndex),
    teamBIndex: Number(sundayRoundDraft.teamBIndex),
    winnerIndex:
      sundayRoundDraft.winnerIndex === ""
        ? ""
        : Number(sundayRoundDraft.winnerIndex),
    createdAt: new Date().toLocaleString(),
  };

  const nextRounds = [...sundayRounds, round];

  setSundayRounds(nextRounds);

  updateState((prev) => ({
    ...prev,
    sundayRounds: nextRounds,
  }));

  setSundayRoundDraft({
    roundName: `Round ${nextRounds.length + 1}`,
    teamAIndex: "",
    teamBIndex: "",
    winnerIndex: "",
  });
}
function lockSundayTeams() {
  if (!canAdmin) return;

  if (!sundayTeams.length) {
    alert("Generate teams first.");
    return;
  }

  updateState((prev) => ({
    ...prev,
    sundayTeams,
  }));

  alert("Sunday teams locked for today.");
}

function clearLockedSundayTeams() {
  if (!canAdmin) return;

  if (!window.confirm("Clear locked Sunday teams?")) return;

  updateState((prev) => ({
    ...prev,
    sundayTeams: [],
  }));

  setSundayTeams([]);
}
    function applySundayPoints() {
  if (!canAdmin) return;

  const winnerSet = new Set(sundayEntry.winningTeamIds.map(Number).filter(Boolean));
  const loserSet = new Set(sundayEntry.losingTeamIds.map(Number).filter(Boolean));

  if (!winnerSet.size || !loserSet.size) {
    alert("Please select winning and losing team players.");
    return;
  }

  updateState((prev) => {
    const winningSubs = new Set(
  (sundayEntry.winningSubstituteIds || []).map(Number)
);

const losingSubs = new Set(
  (sundayEntry.losingSubstituteIds || []).map(Number)
);

    const updatedPlayers = prev.players.map((p) => {
      let points = Number(p.points) || 0;
      let wins = Number(p.wins) || 0;
      let losses = Number(p.losses) || 0;
      let mvpPoints = Number(p.mvpPoints) || 0;
      let activityPoints = Number(p.activityPoints) || 0;

      const playerId = Number(p.id);

      if (winnerSet.has(playerId)) {
        points += 10;
        wins += 1;
        activityPoints += 1;
      }

      if (loserSet.has(playerId)) {
        points -= 5;
        losses += 1;
        activityPoints += 1;
      }
      if (winningSubs.has(playerId)) {
      points += 10;
      wins += 1;
      activityPoints += 1;
      }
       if (losingSubs.has(playerId)) {
      points -= 5;
      losses += 1;
      activityPoints += 1;
       }
      if (Number(sundayEntry.winningMvpId) === playerId) {
        points += 10;
        mvpPoints += 10;
      }

      if (Number(sundayEntry.losingMvpId) === playerId) {
        points += 5;
        mvpPoints += 5;
      }

      if (Number(sundayEntry.objectiveLeaderId) === playerId) {
        points += 2;
        activityPoints += 2;
      }

      if (Number(sundayEntry.bestKdId) === playerId) {
        points += 2;
      }

      if (Number(sundayEntry.zeroDeathId) === playerId) {
        points += 5;
      }

      if (sundayEntry.flawless && winnerSet.has(playerId)) {
        points += 15;
      }

      return {
        ...p,
        points,
        wins,
        losses,
        mvpPoints,
        activityPoints,
      };
    });

    return {
      ...prev,
      players: updatedPlayers,
      sundayHistory: [
        {
          id: Date.now(),
          ...sundayEntry,
          createdAt: new Date().toLocaleString(),
        },
        ...prev.sundayHistory,
      ],
    };
  });

  setSundayEntry({
    mode: "Hardpoint",
    mapName: "",
    scoreText: "",
    winningTeamIds: [],
    losingTeamIds: [],
    winningMvpId: "",
    losingMvpId: "",
    objectiveLeaderId: "",
    bestKdId: "",
    zeroDeathId: "",
    winningSubstituteIds: [],
losingSubstituteIds: [],
    flawless: false,
  });
}
function submitRecommendation() {
  if (!loggedInPlayer) return;

  const title = recommendationDraft.title.trim();
  const description = recommendationDraft.description.trim();

  if (!title) {
    alert("Please enter a recommendation title.");
    return;
  }

  updateState((prev) => ({
    ...prev,
    recommendations: [
      {
        id: Date.now(),
        title,
        description,
        category: recommendationDraft.category || "General",
        status: "New",
        votes: 0,
        votedBy: [],
        pinned: false,
        createdById: loggedInPlayer.id,
        createdByName: loggedInPlayer.name,
        createdAt: new Date().toLocaleDateString(),
      },
      ...(prev.recommendations || []),
    ],
  }));

  setRecommendationDraft({
    title: "",
    description: "",
    category: "General",
  });
}

function toggleRecommendationVote(recommendationId) {
  if (!loggedInPlayer) return;

  updateState((prev) => ({
    ...prev,
    recommendations: (prev.recommendations || []).map((item) => {
      if (item.id !== recommendationId) return item;

      const votedBy = item.votedBy || [];
      const hasVoted = votedBy.includes(loggedInPlayer.id);
      const nextVotedBy = hasVoted
        ? votedBy.filter((id) => id !== loggedInPlayer.id)
        : [...votedBy, loggedInPlayer.id];

      return {
        ...item,
        votedBy: nextVotedBy,
        votes: nextVotedBy.length,
      };
    }),
  }));
}

function updateRecommendationStatus(recommendationId, status) {
  if (!canAdmin) return;

  updateState((prev) => ({
    ...prev,
    recommendations: (prev.recommendations || []).map((item) =>
      item.id === recommendationId ? { ...item, status } : item
    ),
  }));
}

function toggleRecommendationPinned(recommendationId) {
  if (!canAdmin) return;

  updateState((prev) => ({
    ...prev,
    recommendations: (prev.recommendations || []).map((item) =>
      item.id === recommendationId ? { ...item, pinned: !item.pinned } : item
    ),
  }));
}

function deleteRecommendation(recommendationId) {
  if (!canAdmin) return;

  updateState((prev) => ({
    ...prev,
    recommendations: (prev.recommendations || []).filter((item) => item.id !== recommendationId),
  }));
}
function submitRankRequest() {
  if (!loggedInPlayer) return;

  if (!rankRequestDraft.rank) {
    alert("Please select your BO7 rank.");
    return;
  }

  if (!rankRequestDraft.proofUrl.trim()) {
    alert("Please add proof link or screenshot URL.");
    return;
  }

  updateState((prev) => ({
    ...prev,
    rankRequests: [
      {
        id: Date.now(),
        playerId: loggedInPlayer.id,
        playerName: loggedInPlayer.name,
        requestedRank: rankRequestDraft.rank,
        proofUrl: rankRequestDraft.proofUrl.trim(),
        status: "pending",
        createdAt: new Date().toLocaleDateString(),
      },
      ...(prev.rankRequests || []),
    ],
  }));

  setRankRequestDraft({
    rank: "",
    proofUrl: "",
  });

  alert("Rank request submitted for admin approval.");
}

function approveRankRequest(requestId) {
  if (!canAdmin) return;

  updateState((prev) => {
    const request = (prev.rankRequests || []).find((r) => r.id === requestId);
    if (!request) return prev;

    return {
      ...prev,
      players: prev.players.map((p) =>
        p.id === request.playerId ? { ...p, codRank: request.requestedRank } : p
      ),
      rankRequests: (prev.rankRequests || []).map((r) =>
        r.id === requestId ? { ...r, status: "approved" } : r
      ),
    };
  });
}

function rejectRankRequest(requestId) {
  if (!canAdmin) return;

  updateState((prev) => ({
    ...prev,
    rankRequests: (prev.rankRequests || []).map((r) =>
      r.id === requestId ? { ...r, status: "rejected" } : r
    ),
  }));
}
async function postLeaderboardToDiscord() {
  if (!canAdmin) return;

  const preparePlayers = (playerList) =>
    playerList.slice(0, 10).map((player, index) => ({
      position: index + 1,
      id: player.id,
      name: player.name,
      cr: getCompetitiveScore(player),
      wins: Number(player.wins || 0),
      losses: Number(player.losses || 0),
      tournamentWins: Number(player.tournamentWins || 0),
      playStyle: player.playStyle || "",
    }));

  const unassignedPlayers = noPreferencePlayers.map((player) => ({
    id: player.id,
    name: player.name,
    cr: getCompetitiveScore(player),
  }));

  try {
    const response = await fetch("/api/post-discord-leaderboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Shadowborn ZA Competitive Rankings",
        smgLeaderboard: preparePlayers(smgPlayers),
        arLeaderboard: preparePlayers(arPlayers),
        noPreferencePlayers: unassignedPlayers,
      }),
    });

    const responseText = await response.text();

let result = {};

try {
  result = responseText ? JSON.parse(responseText) : {};
} catch {
  result = {
    error: responseText || "The API returned an empty response.",
  };
}

    if (!response.ok) {
      alert(
        "Discord post failed: " +
          (result.error || "Unknown error")
      );
      return;
    }

    alert("CR leaderboards posted to Discord successfully!");
  } catch (error) {
    alert("Discord post failed: " + error.message);
  }
}
  function vote(optionId) {
    updateState((prev) => ({
      ...prev,
      poll: {
        ...prev.poll,
        options: prev.poll.options.map((o) =>
          o.id === optionId ? { ...o, votes: o.votes + 1 } : o
        ),
      },
    }));
  }
const glowStyles = `
@keyframes slayerGlow {
  0% {
    box-shadow:
      0 0 12px rgba(250,204,21,0.35),
      0 0 24px rgba(249,115,22,0.25);
  }

  50% {
    box-shadow:
      0 0 24px rgba(250,204,21,0.65),
      0 0 48px rgba(249,115,22,0.45);
  }

  100% {
    box-shadow:
      0 0 16px rgba(250,204,21,0.45),
      0 0 36px rgba(249,115,22,0.35);
  }
}
`;
function markTraining(playerId, type) {
  if (!canAdmin) return;

  updateState((prev) => ({
    ...prev,
    players: prev.players.map((p) =>
      p.id === playerId
        ? {
            ...p,
            trainingAttended:
              type === "attended"
                ? Number(p.trainingAttended || 0) + 1
                : Number(p.trainingAttended || 0),
            trainingMissed:
              type === "missed"
                ? Number(p.trainingMissed || 0) + 1
                : Number(p.trainingMissed || 0),
          }
        : p
    ),
  }));
}

function resetTraining(playerId) {
  if (!canAdmin) return;

  updateState((prev) => ({
    ...prev,
    players: prev.players.map((p) =>
      p.id === playerId
        ? { ...p, trainingAttended: 0, trainingMissed: 0 }
        : p
    ),
  }));
}
function resetPlayerCR(playerId) {
  if (!canAdmin) return;

  const player = players.find((p) => p.id === playerId);
  if (!player) return;

  const rawCR = getRawCompetitiveScore(player);

  updatePlayer(playerId, "crAdjustment", -rawCR);
}

function resetAllCR() {
  if (!canAdmin) return;

  if (!window.confirm("Reset CR for all players? Leaderboard points will stay the same.")) return;

  updateState((prev) => ({
    ...prev,
    players: prev.players.map((p) => {
      const rawCR =
        Number(p.points || 0) +
        Number(p.wins || 0) * 5 +
        Number(p.mvpPoints || 0) +
        Number(p.tournamentWins || 0) * 25 -
        Number(p.losses || 0) * 2 +
        Number(p.trainingAttended || 0) * 3 -
        Number(p.trainingMissed || 0) * 5;

      return {
        ...p,
        crAdjustment: -rawCR,
      };
    }),
  }));
}
  const appBg = {
  minHeight: "100vh",
  position: "relative",
  isolation: "isolate",
  overflowX: "hidden",

  backgroundColor: "#05030a",

  backgroundImage: `
    radial-gradient(
      circle at 15% 5%,
      rgba(126,34,206,0.28),
      transparent 34%
    ),
    radial-gradient(
      circle at 88% 18%,
      rgba(88,28,135,0.20),
      transparent 32%
    ),
    radial-gradient(
      circle at 50% 95%,
      rgba(76,29,149,0.18),
      transparent 42%
    ),
    linear-gradient(
      180deg,
      rgba(3,2,8,0.92) 0%,
      rgba(7,3,13,0.88) 44%,
      rgba(4,2,8,0.96) 100%
    )
  `,

  backgroundAttachment: "fixed",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",

  color: "#ffffff",
  fontFamily: "Arial, sans-serif",
};

  function PlayerCard({ player }) {
    const rank = getRank(player.points);
    const canUpload = loggedInPlayer?.id === player.id || canAdmin;

    return (
  <div
  onClick={() => setSelectedProfilePlayerId(player.id)}
    style={{
      ...cardStyle(),
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      background: player.banner
        ? `linear-gradient(135deg, rgba(10,6,18,0.74), rgba(10,6,18,0.88)), url(${player.banner}) center/cover`
        : `linear-gradient(135deg, rgba(255,255,255,0.05), ${rank.glow})`,
    }}
  >
      
        <div style={{ display: "grid", gridTemplateColumns: "74px 1fr", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 18,
                background: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                overflow: "hidden",
                border: `1px solid ${rank.color}`,
              }}
            >
              {player.avatar ? (
                <img
                  src={player.avatar}
                  alt={player.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                player.emblem
              )}
            </div>
            <div
              style={{
                position: "absolute",
                right: -6,
                bottom: -6,
                ...badgeStyle(rank.glow, rank.color),
                border: `1px solid ${rank.color}`,
              }}
            >
              <Flame size={12} />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  <span style={{ fontWeight: 800, fontSize: 18 }}>{player.name}</span>

  {player.codRank && RANK_BADGES[player.codRank] ? (
    <img
      src={RANK_BADGES[player.codRank]}
      alt={player.codRank}
      title={player.codRank}
      style={{
        width: 26,
        height: 26,
        objectFit: "contain",
        filter: "drop-shadow(0 0 8px rgba(168,85,247,0.45))",
      }}
    />
  ) : null}
</div>
              <span style={badgeStyle(rank.glow, rank.color)}>{rank.name}</span>
              <span style={badgeStyle()}>{player.role}</span>
              {Number(player.division || 0) > 0 ? (
  <span
    style={badgeStyle(
      Number(player.division) === 1
        ? "rgba(250,204,21,0.18)"
        : Number(player.division) === 2
        ? "rgba(148,163,184,0.18)"
        : "rgba(180,83,9,0.18)",
      Number(player.division) === 1
        ? "#fde047"
        : Number(player.division) === 2
        ? "#cbd5e1"
        : "#fdba74"
    )}
  >
    Division {player.division}
  </span>
) : (
  <span style={badgeStyle()}>
    Unassigned
  </span>
)}

{player.isDivisionCaptain ? (
  <span
    style={badgeStyle(
      "rgba(250,204,21,0.2)",
      "#fde047"
    )}
  >
    👑 Division Captain
  </span>
) : null}
            </div>

            <div style={{ color: "#d6caef", fontSize: 13, marginTop: 4 }}>
              {player.points} pts • {player.tournamentWins} tournament wins • W {player.wins} / L {player.losses}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <span style={badgeStyle()}><Medal size={12} /> MVP {player.mvpPoints}</span>
              <span style={badgeStyle()}><CalendarDays size={12} /> Activity {player.activityPoints}</span>
            </div>

            {canUpload ? (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
    <button
      type="button"
      onClick={(e) => {
  e.stopPropagation();
  chooseAvatar(player.id);
}}
      style={{
        ...buttonStyle(false, false),
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
      }}
    >
      <Upload size={14} />
      Upload Avatar
    </button>

    <button
      type="button"
      onClick={(e) => {
  e.stopPropagation();
  chooseBanner(player.id);
}}
      style={{
        ...buttonStyle(false, false),
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
      }}
    >
      <Upload size={14} />
      Upload Banner
    </button>
    <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    chooseCardPhoto(player.id);
  }}
  style={{
    ...buttonStyle(false, false),
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
  }}
>
  <Upload size={14} />
  Upload Card Photo
</button>
  </div>
) : null}

{canAdmin ? (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
  <div
  onClick={(e) => e.stopPropagation()}
  style={{
    width: "100%",
    padding: 12,
    borderRadius: 14,
    background: "rgba(0,0,0,0.22)",
    border: "1px solid rgba(168,85,247,0.22)",
  }}
>
  <div
    style={{
      fontWeight: 900,
      marginBottom: 8,
    }}
  >
    Division Management
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "minmax(160px, 1fr) auto",
      gap: 8,
    }}
  >
    <select
      value={Number(player.division || 0)}
      onChange={(e) =>
        setPlayerDivision(player.id, e.target.value)
      }
      style={inputStyle(false)}
    >
      <option value={0}>Not Assigned</option>
      <option value={1}>Division 1</option>
      <option value={2}>Division 2</option>
      <option value={3}>Division 3</option>
    </select>

    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setDivisionCaptain(player.id);
      }}
      disabled={Number(player.division || 0) === 0}
      style={buttonStyle(
        Boolean(player.isDivisionCaptain),
        Number(player.division || 0) === 0
      )}
    >
      {player.isDivisionCaptain
        ? "Remove Captain"
        : "Make Captain"}
    </button>
  </div>

  <div
    style={{
      marginTop: 8,
      color: "#b9accf",
      fontSize: 12,
    }}
  >
    Captains manage their division but receive no application admin access.
  </div>
</div>
    <button
      type="button"
      onClick={() => {
        const newName = prompt("New player name:", player.name);
        if (newName) updatePlayer(player.id, "name", newName);
      }}
      style={buttonStyle(false, false)}
    >
      Edit Name
    </button>

    <button
      type="button"
      onClick={() => {
        const newRole = prompt("Role (leader/co-leader/player/scout):", player.role);
        if (newRole) updatePlayer(player.id, "role", newRole);
      }}
      style={buttonStyle(false, false)}
    >
      Change Role
    </button>

    <button type="button" onClick={() => resetPlayerStats(player.id)} style={buttonStyle(false, false)}>
      Reset Stats
    </button>
    <button
  type="button"
  onClick={() => resetPlayerCR(player.id)}
  style={buttonStyle(false, false)}
>
  📉 Reset CR
</button>

    <button type="button" onClick={() => clearPlayerAvatar(player.id)} style={buttonStyle(false, false)}>
      Remove Avatar
    </button>

    <button type="button" onClick={() => clearPlayerBanner(player.id)} style={buttonStyle(false, false)}>
      Remove Banner
    </button>
    {player.cardPhoto ? (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      clearPlayerCardPhoto(player.id);
    }}
    style={buttonStyle(false, false)}
  >
    Remove Card Photo
  </button>
) : null}
<button
onClick={() => {
  const newPin = prompt(
    `Enter a new 4-digit PIN for ${player.name}:`
  );

  if (!newPin) return;

  const cleanPin = String(newPin).trim();

  if (!/^\d{4}$/.test(cleanPin)) {
    alert("The PIN must contain exactly 4 numbers.");
    return;
  }

  if (isPinAlreadyUsed(cleanPin, player.id)) {
    alert(
      "That PIN is already assigned to another player. Please choose a different PIN."
    );
    return;
  }

  updateState((prev) => ({
    ...prev,
    playerPins: {
      ...(prev.playerPins || {}),
      [player.id]: cleanPin,
    },
  }));

  alert(`PIN updated for ${player.name}`);
}}
  style={buttonStyle(false, false)}
>
  Change PIN
</button>
    <button
      type="button"
      onClick={() => {
        if (window.confirm(`Remove ${player.name}?`)) {
          removePlayer(player.id);
        }
      }}
      style={{
        ...buttonStyle(false, false),
        background: "rgba(239,68,68,0.2)",
      }}
    >
      Remove Player
    </button>
  </div>
) : null}
          </div>
        </div>
      </div>
    );
  }
  function divisionCardStatStyle() {
  return {
    padding: "9px 10px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.055)",
    display: "flex",
    flexDirection: "column",
    gap: 3,
    minWidth: 0,
    overflow: "hidden",
  };
}

function divisionCardLabelStyle() {
  return {
    color: "#a99cbe",
    fontSize: 9,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    lineHeight: 1.25,
    wordBreak: "break-word",
  };
}
  function CompetitiveDivisionCard({ player }) {
  const division = Number(player.division || 0);

  const divisionTheme =
    division === 1
      ? {
          border: "#facc15",
          glow: "rgba(250,204,21,0.35)",
          label: "DIVISION 1",
          accent: "#fde047",
        }
      : division === 2
      ? {
          border: "#cbd5e1",
          glow: "rgba(203,213,225,0.28)",
          label: "DIVISION 2",
          accent: "#e2e8f0",
        }
      : {
          border: "#fb923c",
          glow: "rgba(251,146,60,0.3)",
          label: "DIVISION 3",
          accent: "#fdba74",
        };

  const competitiveScore = getCompetitiveScore(player);

  const totalMatches =
    Number(player.wins || 0) +
    Number(player.losses || 0);

  const winPercentage =
    totalMatches > 0
      ? Math.round(
          (Number(player.wins || 0) / totalMatches) * 100
        )
      : 0;

  const rankBadgeUrl =
    player.codRank && RANK_BADGES[player.codRank]
      ? RANK_BADGES[player.codRank]
      : null;

  return (
    <DivisionPlayerCard
      player={player}
      divisionTheme={divisionTheme}
      competitiveScore={competitiveScore}
      winPercentage={winPercentage}
      rankBadgeUrl={rankBadgeUrl}
      isMobile={isMobile}
      onOpenProfile={setSelectedProfilePlayerId}
    />
  );
}
  function MatchCard({ match }) {
    const teamA = findTeam(match.teamAId);
    const teamB = findTeam(match.teamBId);
    const canA = canAdmin || canTeamAEdit(match);
    const canB = canAdmin || canTeamBConfirm(match);

    return (
      <div style={{ ...cardStyle(), background: "rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 900 }}>{match.label}</div>
            <div style={{ color: "#d6caef", marginTop: 4 }}>
              {getTeamName(teamA)} vs {getTeamName(teamB)}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={badgeStyle(
                match.locked ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.08)",
                match.locked ? "#86efac" : "white"
              )}
            >
              {match.locked ? "Official" : "Pending"}
            </span>

            {match.submittedByTeamA ? (
              <span style={badgeStyle("rgba(59,130,246,0.18)", "#93c5fd")}>Submitted</span>
            ) : null}

            {match.teamBConfirmed ? (
              <span style={badgeStyle("rgba(34,197,94,0.18)", "#86efac")}>Confirmed</span>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <input
            type="number"
            value={match.scoreA}
            onChange={(e) => updateMatchField(match.id, "scoreA", e.target.value)}
            style={inputStyle(!canA)}
            disabled={!canA}
            placeholder="Team 1 score"
          />

          <input
            type="number"
            value={match.scoreB}
            onChange={(e) => updateMatchField(match.id, "scoreB", e.target.value)}
            style={inputStyle(!canA)}
            disabled={!canA}
            placeholder="Team 2 score"
          />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => submitByTeamA(match.id)}
            style={buttonStyle(match.submittedByTeamA, !canA)}
            disabled={!canA}
          >
            <PencilLine size={14} /> Team 1 Submit Result
          </button>

          <button
            onClick={() => confirmByTeamB(match.id)}
            style={buttonStyle(match.teamBConfirmed, !canB)}
            disabled={!canB}
          >
            <CheckCircle2 size={14} /> Team 2 Confirm Result
          </button>
        </div>

        {!match.locked && match.scoreA !== "" && match.scoreB !== "" && Number(match.scoreA) === Number(match.scoreB) ? (
          <div style={{ marginTop: 10, color: "#fca5a5", fontSize: 13 }}>
            Draws are not allowed. Enter a winning score.
          </div>
        ) : null}
      </div>
    );
  }

  function BracketColumn({ title, matches, emptyText }) {
    return (
      <div style={{ ...cardStyle(), background: "rgba(0,0,0,0.18)", minHeight: 220 }}>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 14 }}>{title}</div>

        {!matches || matches.length === 0 ? (
          <div style={{ color: "#cfc4e8" }}>{emptyText}</div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {matches.map((match) => {
              const teamA = findTeam(match.teamAId);
              const teamB = findTeam(match.teamBId);
              const winner = findTeam(match.winnerId);

              return (
                <div
                  key={match.id}
                  style={{
                    background: "#1a1624",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: "#070707",
                      color: "white",
                      padding: "8px 12px",
                      fontWeight: 900,
                      fontSize: 13,
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {match.label.toUpperCase()}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 64px" }}>
                    <div style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ padding: 12, minHeight: 62, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>
                          {getTeamName(teamA)}
                        </div>
                      </div>
                      <div style={{ padding: 12, minHeight: 62 }}>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>
                          {getTeamName(teamB)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          padding: 12,
                          minHeight: 62,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                          fontWeight: 900,
                          fontSize: 20,
                        }}
                      >
                        {match.scoreA === "" ? "-" : match.scoreA}
                      </div>
                      <div
                        style={{
                          padding: 12,
                          minHeight: 62,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 900,
                          fontSize: 20,
                        }}
                      >
                        {match.scoreB === "" ? "-" : match.scoreB}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: 10, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span
                      style={badgeStyle(
                        match.locked ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.08)",
                        match.locked ? "#86efac" : "white"
                      )}
                    >
                      {match.locked ? "Official" : "Pending"}
                    </span>

                    {winner ? (
                      <span style={badgeStyle("rgba(168,85,247,0.18)", "#d8b4fe")}>
                        Winner: {getTeamName(winner)}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
function getMatchesByStage(matches = []) {
  return matches.reduce((acc, match) => {
    const stage = match.stage || 1;
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(match);
    return acc;
  }, {});
}
function VisualMatchCard({ match, bracketType }) {
  const teamA = match?.teamAId ? findTeam(match.teamAId) : null;
  const teamB = match?.teamBId ? findTeam(match.teamBId) : null;

  const isLocked = match?.locked;
  const isFuture = match?.futureOnly || !match;

  const borderColor =
    bracketType === "final"
      ? "rgba(250,204,21,0.75)"
      : isLocked
      ? "rgba(34,197,94,0.75)"
      : isFuture
      ? "rgba(148,163,184,0.35)"
      : bracketType === "redemption"
      ? "rgba(239,68,68,0.65)"
      : "rgba(168,85,247,0.65)";

  const glow =
    bracketType === "final"
      ? "0 0 18px rgba(250,204,21,0.18)"
      : isLocked
      ? "0 0 14px rgba(34,197,94,0.16)"
      : !isFuture
      ? "0 0 14px rgba(168,85,247,0.18)"
      : "none";

  return (
    <div
      style={{
        padding: isMobile ? 9 : 10,
        borderRadius: 14,
        background: "rgba(0,0,0,0.28)",
        border: `1px solid ${borderColor}`,
        minWidth: isMobile ? 210 : 220,
        boxShadow: glow,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 18, fontWeight: 900 }}>
  <span>{teamA ? getTeamName(teamA) : match?.teamALabel || "TBD"}</span>
  <span>{match?.scoreA || "-"}</span>
</div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 18, marginTop: 8, fontWeight: 900 }}>
  <span>{teamB ? getTeamName(teamB) : match?.teamBLabel || "TBD"}</span>
  <span>{match?.scoreB || "-"}</span>
</div>

      <div
        style={{
          marginTop: 10,
          color: isLocked ? "#4ade80" : isFuture ? "#94a3b8" : "#c084fc",
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        {isLocked ? "✅ Completed" : isFuture ? "⏳ Future Match" : "🟣 Upcoming / Active"}
      </div>
    </div>
  );
}
function VisualBracketBoard() {
  const winnersByStage = getMatchesByStage([
    ...(tournament.completedRounds || []).filter((m) => m.bracket === "W"),
    ...(tournament.activeWinners || []),
  ]);

  const winnersRoundOneLosers = (tournament.completedRounds || [])
  .filter((m) => m.bracket === "W" && Number(m.stage || 1) === 1 && m.loserId)
  .map((m) => m.loserId);

const visualRedemptionRoundOne = [];

for (let i = 0; i < winnersRoundOneLosers.length; i += 2) {
  visualRedemptionRoundOne.push({
    id: `visual-redemption-r1-${i}`,
    bracket: "L",
    stage: 1,
    teamAId: winnersRoundOneLosers[i],
    teamBId: winnersRoundOneLosers[i + 1] || null,
    scoreA: "",
    scoreB: "",
    locked: false,
    visualOnly: true,
  });
}

const realRedemptionMatches = [
  ...(tournament.completedRounds || []).filter((m) => m.bracket === "L"),
  ...(tournament.activeRedemption || []),
];

const realRedemptionIds = new Set(
  realRedemptionMatches.flatMap((m) => [m.teamAId, m.teamBId]).filter(Boolean)
);

const filteredVisualRedemptionRoundOne = visualRedemptionRoundOne.filter(
  (m) => !realRedemptionIds.has(m.teamAId) && !realRedemptionIds.has(m.teamBId)
);

const redemptionByStage = getMatchesByStage([
  ...filteredVisualRedemptionRoundOne,
  ...realRedemptionMatches,
]);

  const maxWinnerStage = Math.max(3, ...Object.keys(winnersByStage).map(Number), 1);
  const maxRedemptionStage = Math.max(4, ...Object.keys(redemptionByStage).map(Number), 1);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ ...cardStyle(), background: "rgba(0,0,0,0.16)" }}>
        <h2 style={{ marginTop: 0 }}>🏆 Winners Bracket</h2>

        <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 10 }}>
          {Array.from({ length: maxWinnerStage }, (_, i) => i + 1).map((stage) => (
            <div
  key={stage}
  style={{
    position: "relative",
    minWidth: isMobile ? 220 : 230,
    paddingRight: isMobile ? 8 : 34,
  }}
>
              <h3>Round {stage}</h3>

              {(winnersByStage[stage] || [null]).map((match, index) => (
                <div key={match?.id || `w-${stage}-${index}`} style={{ marginBottom: 14 }}>
                  <VisualMatchCard match={match} bracketType="winner" />
                </div>
              ))}
              {!isMobile && stage < maxWinnerStage && (
  <div
    style={{
      position: "absolute",
      right: -26,
      top: "52%",
      width: 34,
      zIndex: 5,
      height: 2,
      background: "#a855f7",
      opacity: 0.75,
    }}
  />
)}
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle(), background: "rgba(0,0,0,0.16)", border: "1px solid rgba(239,68,68,0.25)" }}>
        <h2 style={{ marginTop: 0, color: "#f87171" }}>🔥 Redemption Bracket</h2>

        <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 10 }}>
          {Array.from({ length: maxRedemptionStage }, (_, i) => i + 1).map((stage) => (
            <div
  key={stage}
  style={{
    position: "relative",
    minWidth: isMobile ? 220 : 230,
    paddingRight: isMobile ? 8 : 34,
  }}
>
              <h3>Round {stage}</h3>

              {(redemptionByStage[stage] || [null]).map((match, index) => (
                <div key={match?.id || `l-${stage}-${index}`} style={{ marginBottom: 14 }}>
                  <VisualMatchCard match={match} bracketType="redemption" />
                </div>
              ))}
              {!isMobile && stage < maxRedemptionStage && (
  <div
    style={{
      position: "absolute",
      right: -26,
      top: "52%",
      width: 34,
      zIndex: 5,
      height: 2,
      background: "#ef4444",
      opacity: 0.75,
    }}
  />
)}
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle(), background: "rgba(124,58,237,0.10)" }}>
        <h2 style={{ marginTop: 0 }}>👑 Grand Final</h2>
        <VisualMatchCard match={tournament.grandFinal || null} bracketType="winner" />
      </div>
    </div>
  );
}
function VisualBracketBoardV3() {
  const completed = tournament.completedRounds || [];
  const activeWinners = tournament.activeWinners || [];
  const activeRedemption = tournament.activeRedemption || [];

  const winnersByStage = getMatchesByStage([
    ...completed.filter((m) => m.bracket === "W"),
    ...activeWinners,
  ]);

  const winnersRoundOneLosers = completed
    .filter((m) => m.bracket === "W" && Number(m.stage || 1) === 1 && m.loserId)
    .map((m) => m.loserId);

  const visualRedemptionR1 = [];
  for (let i = 0; i < winnersRoundOneLosers.length; i += 2) {
    visualRedemptionR1.push({
      id: `v3-redemption-r1-${i}`,
      bracket: "L",
      stage: 1,
      teamAId: winnersRoundOneLosers[i],
      teamBId: winnersRoundOneLosers[i + 1] || null,
      teamBLabel: winnersRoundOneLosers[i + 1] ? "" : "BYE / Waiting",
      visualOnly: true,
    });
  }

  const realRedemptionMatches = [
    ...completed.filter((m) => m.bracket === "L"),
    ...activeRedemption,
  ];

  const realRedemptionTeamIds = new Set(
    realRedemptionMatches.flatMap((m) => [m.teamAId, m.teamBId]).filter(Boolean)
  );

  const redemptionByStage = getMatchesByStage([
    ...visualRedemptionR1.filter(
      (m) =>
        !realRedemptionTeamIds.has(m.teamAId) &&
        !realRedemptionTeamIds.has(m.teamBId)
    ),
    ...realRedemptionMatches,
  ]);

  const maxWinnerStage = Math.max(3, ...Object.keys(winnersByStage).map(Number), 1);
  const maxRedemptionStage = Math.max(4, ...Object.keys(redemptionByStage).map(Number), 1);

  function getStageMatches(byStage, maxStage, type) {
    return Array.from({ length: maxStage }, (_, i) => {
      const stage = i + 1;
      const matches =
        byStage[stage]?.length > 0
          ? byStage[stage]
          : [
              {
                id: `future-${type}-${stage}`,
                futureOnly: true,
                visualOnly: true,
                teamALabel:
                  type === "winner"
                    ? stage === 1
                      ? "TBD"
                      : `Winner Round ${stage - 1}`
                    : stage === 1
                    ? "TBD"
                    : `Winner Redemption R${stage - 1}`,
                teamBLabel:
                  type === "winner"
                    ? stage === 1
                      ? "TBD"
                      : `Winner Round ${stage - 1}`
                    : stage === 1
                    ? "TBD"
                    : `Loser Winners R${stage}`,
              },
            ];

      return { stage, matches };
    });
  }

  function BracketLane({ title, byStage, maxStage, type }) {
    const rows = getStageMatches(byStage, maxStage, type);
    const color = type === "redemption" ? "#ef4444" : "#a855f7";

    return (
      <div
        style={{
          ...cardStyle(),
          position: "relative",
          background: "rgba(0,0,0,0.16)",
          border:
            type === "redemption"
              ? "1px solid rgba(239,68,68,0.28)"
              : "1px solid rgba(168,85,247,0.22)",
          overflowX: "auto",
        }}
      >
        <h2 style={{ marginTop: 0, color: type === "redemption" ? "#f87171" : "white" }}>
          {title}
        </h2>

        <div
          style={{
            display: "flex",
            gap: isMobile ? 14 : 26,
            alignItems: "flex-start",
            paddingBottom: 12,
            minWidth: isMobile ? "max-content" : "auto",
          }}
        >
          {rows.map(({ stage, matches }) => (
            <div
              key={stage}
              style={{
                minWidth: isMobile ? 215 : 235,
                paddingTop: isMobile ? 0 : stage === 1 ? 0 : 34 * (stage - 1),
              }}
            >
              <h3 style={{ marginTop: 0 }}>Round {stage}</h3>

              {matches.map((match, index) => (
                <div
                  key={match.id || `${type}-${stage}-${index}`}
                  style={{
                    position: "relative",
                    marginBottom: isMobile ? 10 : stage === 1 ? 12 : 34,
                  }}
                >
                  <VisualMatchCard match={match} bracketType={type} />

                  {!isMobile && stage < maxStage && (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          right: -26,
                          top: "50%",
                          width: 26,
                          height: 2,
                          background: color,
                          opacity: 0.7,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          right: -26,
                          top: "50%",
                          width: 2,
                          height: index % 2 === 0 ? 40 : -40,
                          background: color,
                          opacity: 0.55,
                        }}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <BracketLane
        title="🏆 Winners Bracket"
        byStage={winnersByStage}
        maxStage={maxWinnerStage}
        type="winner"
      />

      <BracketLane
        title="🔥 Redemption Bracket"
        byStage={redemptionByStage}
        maxStage={maxRedemptionStage}
        type="redemption"
      />

      <div
        style={{
          ...cardStyle(),
          background: "rgba(124,58,237,0.14)",
          border: "1px solid rgba(250,204,21,0.45)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>👑 Grand Final</h2>

        <VisualMatchCard
          match={
            tournament.grandFinal || {
              id: "future-grand-final",
              futureOnly: true,
              visualOnly: true,
              teamALabel: "Winner Winners Bracket",
              teamBLabel: "Winner Redemption Bracket",
            }
          }
          bracketType="final"
        />
      </div>
    </div>
  );
}
  const championTeam = tournament.championTeamId ? findTeam(tournament.championTeamId) : null;

  if (loading) {
    return (
      <div style={{ ...appBg, display: "grid", placeItems: "center" }}>
        <div style={cardStyle()}>Loading Shadowborn ZA...</div>
      </div>
    );
  }

  if (!loggedInPlayer) {
  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        padding: isMobile ? 16 : 28,
        boxSizing: "border-box",
        color: "white",

        // The stadium image will be added as:
        // public/sbza-login-stadium.jpg
        backgroundImage: `
          linear-gradient(
            180deg,
            rgba(3,2,8,0.32) 0%,
            rgba(7,3,15,0.58) 45%,
            rgba(5,2,12,0.92) 100%
          ),
          radial-gradient(
            circle at 50% 30%,
            rgba(168,85,247,0.22),
            transparent 48%
          ),
          url("/sbza-login-stadium.jpg")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#08040f",
      }}
    >
      <style>{glowStyles}</style>
      {/* Top purple stadium glow */}
      <div
        style={{
          position: "absolute",
          top: -180,
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? 520 : 1100,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.38), transparent 68%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Left spotlight */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: isMobile ? "-55%" : "-8%",
          width: isMobile ? 340 : 520,
          height: "120%",
          transform: "rotate(-18deg)",
          background:
            "linear-gradient(90deg, transparent, rgba(168,85,247,0.12), transparent)",
          filter: "blur(16px)",
          pointerEvents: "none",
        }}
      />

      {/* Right spotlight */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: isMobile ? "-55%" : "-8%",
          width: isMobile ? 340 : 520,
          height: "120%",
          transform: "rotate(18deg)",
          background:
            "linear-gradient(90deg, transparent, rgba(59,130,246,0.1), transparent)",
          filter: "blur(16px)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom arena fog */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -80,
          height: 260,
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.23), transparent 68%)",
          filter: "blur(26px)",
          pointerEvents: "none",
        }}
      />

      {/* Main login content */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          width: "100%",
          maxWidth: 1180,
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "minmax(0, 1.25fr) minmax(360px, 0.75fr)",
          gap: isMobile ? 24 : 54,
          alignItems: "center",
        }}
      >
        {/* Championship introduction */}
        <div
          style={{
            textAlign: isMobile ? "center" : "left",
            padding: isMobile ? "20px 4px 0" : "30px 10px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 12px",
              borderRadius: 999,
              background: "rgba(8,5,16,0.72)",
              border: "1px solid rgba(196,181,253,0.3)",
              color: "#ddd6fe",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 1.5,
              backdropFilter: "blur(10px)",
            }}
          >
            🏟 SHADOWBORN CHAMPIONSHIP ARENA
          </div>

          <div
            style={{
              marginTop: 18,
              fontSize: isMobile ? 42 : 72,
              lineHeight: 0.92,
              fontWeight: 950,
              letterSpacing: isMobile ? 1 : 2,
              textTransform: "uppercase",
              textShadow:
                "0 5px 26px rgba(0,0,0,0.95), 0 0 36px rgba(168,85,247,0.68)",
            }}
          >
            Shadowborn
            <br />
            <span
              style={{
                color: "#c084fc",
              }}
            >
              ZA
            </span>
          </div>

          <div
            style={{
              marginTop: 16,
              color: "#f5f3ff",
              fontSize: isMobile ? 14 : 17,
              fontWeight: 900,
              letterSpacing: 3,
              textTransform: "uppercase",
              textShadow: "0 3px 12px rgba(0,0,0,0.9)",
            }}
          >
            Competitive Platform
          </div>

          <div
            style={{
              maxWidth: 560,
              margin: isMobile ? "14px auto 0" : "14px 0 0",
              color: "#d8cff0",
              lineHeight: 1.6,
              fontSize: isMobile ? 13 : 15,
              textShadow: "0 2px 10px rgba(0,0,0,0.95)",
            }}
          >
            Enter the arena. Represent your division. Build your legacy.
          </div>
        </div>

        {/* Login glass panel */}
        <div
          style={{
            width: "100%",
            maxWidth: 440,
            justifySelf: "center",
            boxSizing: "border-box",
            padding: isMobile ? 22 : 30,
            borderRadius: 28,

            background:
              "linear-gradient(145deg, rgba(18,11,31,0.9), rgba(7,4,14,0.94))",

            border: "1px solid rgba(192,132,252,0.36)",

            boxShadow:
              "0 28px 80px rgba(0,0,0,0.62), 0 0 42px rgba(168,85,247,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",

            backdropFilter: "blur(20px)",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "grid",
              placeItems: "center",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: isMobile ? 84 : 100,
                height: isMobile ? 84 : 100,
                padding: 6,
                borderRadius: 24,
                background:
                  "linear-gradient(135deg, rgba(168,85,247,0.48), rgba(59,130,246,0.2), rgba(0,0,0,0.5))",
                border: "1px solid rgba(216,180,254,0.48)",
                boxShadow:
                  "0 0 30px rgba(168,85,247,0.42), 0 0 70px rgba(124,58,237,0.16)",
              }}
            >
              <img
                src={state.logoUrl || DEFAULT_LOGO}
                alt="Shadowborn ZA"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 19,
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: isMobile ? 24 : 28,
              fontWeight: 950,
            }}
          >
            Welcome Back
          </div>

          <div
            style={{
              marginTop: 7,
              marginBottom: 22,
              textAlign: "center",
              color: "#b9accf",
              fontSize: 13,
            }}
          >
            Enter your unique four-digit player PIN
          </div>

          <input
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              const numbersOnly = e.target.value
                .replace(/\D/g, "")
                .slice(0, 4);

              setPin(numbersOnly);
              setLoginError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                loginWithPin();
              }
            }}
            placeholder="••••"
            aria-label="Player PIN"
            style={{
              width: "100%",
              height: 64,
              boxSizing: "border-box",
              borderRadius: 17,
              border: loginError
                ? "1px solid rgba(248,113,113,0.7)"
                : "1px solid rgba(192,132,252,0.42)",
              outline: "none",
              background: "rgba(5,3,11,0.7)",
              color: "white",
              textAlign: "center",
              fontSize: 28,
              fontWeight: 950,
              letterSpacing: 16,
              paddingLeft: 18,
              boxShadow: loginError
                ? "0 0 18px rgba(239,68,68,0.16)"
                : "inset 0 0 18px rgba(168,85,247,0.08)",
            }}
          />

          {loginError ? (
            <div
              style={{
                marginTop: 10,
                color: "#fca5a5",
                fontSize: 13,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {loginError}
            </div>
          ) : null}

          <button
            type="button"
            onClick={loginWithPin}
            disabled={pin.length !== 4 || loginIntroVisible}
            style={{
              width: "100%",
              marginTop: 14,
              padding: "14px 16px",
              borderRadius: 16,
              border: "1px solid rgba(216,180,254,0.35)",
              background:
                pin.length === 4
                  ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                  : "rgba(255,255,255,0.06)",
              color: pin.length === 4 ? "white" : "#81778f",
              cursor: pin.length === 4 ? "pointer" : "not-allowed",
              fontSize: 14,
              fontWeight: 950,
              letterSpacing: 1.3,
              boxShadow:
                pin.length === 4
                  ? "0 10px 26px rgba(124,58,237,0.34)"
                  : "none",
            }}
          >
            <Lock size={15} style={{ marginRight: 7 }} />

{loginIntroVisible
  ? "ENTERING..."
  : "ENTER THE ARENA"}
          </button>

          {/* Live platform stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
              marginTop: 18,
            }}
          >
            {[
              {
                value: players.length,
                label: "PLAYERS",
                color: "#c084fc",
              },
              {
                value: 3,
                label: "DIVISIONS",
                color: "#fde047",
              },
              {
                value: "LIVE",
                label: "PLATFORM",
                color: "#86efac",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  minWidth: 0,
                  padding: "10px 5px",
                  borderRadius: 13,
                  background: "rgba(255,255,255,0.045)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: item.color,
                    fontWeight: 950,
                    fontSize: 15,
                  }}
                >
                  {item.value}
                </div>

                <div
                  style={{
                    color: "#9589a8",
                    fontSize: 9,
                    fontWeight: 800,
                    marginTop: 3,
                    letterSpacing: 0.5,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noreferrer"
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "11px 12px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "#d8cff0",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            <MessageCircle size={14} />
            Join Shadowborn Discord
          </a>

          <div
            style={{
              marginTop: 13,
              textAlign: "center",
              color: "#70667f",
              fontSize: 10,
            }}
          >
            Secure clan access • Never share your PIN
          </div>
        </div>
      </div>

      {/* Bottom championship label */}
      <div
        style={{
          position: "absolute",
          zIndex: 4,
          bottom: isMobile ? 9 : 14,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "rgba(226,232,240,0.48)",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: 2,
        }}
      >
        SHADOWBORN ZA • VICTORY AWAITS IN THE SHADOWS
      </div>
      {loginIntroVisible && loginIntroPlayer ? (
  <LoginIntro
    player={loginIntroPlayer}
    logo={state.logoUrl || DEFAULT_LOGO}
    fallbackImage={DEFAULT_LOGO}
    isMobile={isMobile}
  />
) : null}
    </div>
  );
}
const pendingCallout = state.callouts?.find(
  (c) =>
    c.challengedId === loggedInPlayer?.id &&
    c.status === "pending"
);
  return (
    <div style={appBg}>
    {/* GLOBAL SHADOWBORN BACKGROUND ATMOSPHERE */}
<div
  aria-hidden="true"
  style={{
    position: "fixed",
    inset: 0,
    zIndex: -3,
    overflow: "hidden",
    pointerEvents: "none",
  }}
>
  {/* Soft central purple light */}
  <div
    style={{
      position: "absolute",
      width: isMobile ? 500 : 1050,
      height: isMobile ? 500 : 1050,
      top: isMobile ? -180 : -440,
      left: "50%",
      transform: "translateX(-50%)",
      borderRadius: "50%",

      background:
        "radial-gradient(circle, rgba(126,34,206,0.22) 0%, rgba(88,28,135,0.10) 40%, transparent 72%)",

      filter: "blur(22px)",
    }}
  />

  {/* Left smoke */}
  <div
    style={{
      position: "absolute",
      width: isMobile ? 420 : 900,
      height: isMobile ? 520 : 900,
      left: isMobile ? -280 : -540,
      top: "15%",
      borderRadius: "50%",

      background:
        "radial-gradient(ellipse, rgba(109,40,217,0.13), transparent 68%)",

      filter: "blur(42px)",
      transform: "rotate(-18deg)",
    }}
  />

  {/* Right smoke */}
  <div
    style={{
      position: "absolute",
      width: isMobile ? 440 : 950,
      height: isMobile ? 560 : 920,
      right: isMobile ? -300 : -580,
      top: "35%",
      borderRadius: "50%",

      background:
        "radial-gradient(ellipse, rgba(88,28,135,0.15), transparent 70%)",

      filter: "blur(46px)",
      transform: "rotate(22deg)",
    }}
  />

  {/* Faint Shadowborn emblem */}
  <img
    src={state.logoUrl || DEFAULT_LOGO}
    alt=""
    style={{
      position: "fixed",
      right: isMobile ? -110 : -90,
      top: isMobile ? 120 : 55,

      width: isMobile ? 340 : 660,
      height: isMobile ? 340 : 660,

      objectFit: "contain",
      opacity: isMobile ? 0.035 : 0.045,

      filter:
        "grayscale(1) brightness(1.6) contrast(1.2) drop-shadow(0 0 45px rgba(126,34,206,0.28))",

      mixBlendMode: "screen",

      WebkitMaskImage:
        "radial-gradient(circle, black 24%, rgba(0,0,0,0.72) 48%, transparent 72%)",

      maskImage:
        "radial-gradient(circle, black 24%, rgba(0,0,0,0.72) 48%, transparent 72%)",
    }}
  />

  {/* Dark vignette */}
  <div
    style={{
      position: "absolute",
      inset: 0,

      background:
        "radial-gradient(circle at center, transparent 28%, rgba(0,0,0,0.62) 100%)",
    }}
  />
</div>
    <style>{glowStyles}</style>
    {previewImage && (
  <div
    onClick={() => setPreviewImage(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.9)",
      zIndex: 10000,
      display: "grid",
      placeItems: "center",
      padding: 18,
    }}
  >
    <img
      src={previewImage}
      alt="Preview"
      style={{
        maxWidth: "96vw",
        maxHeight: "90vh",
        objectFit: "contain",
        borderRadius: 18,
        boxShadow: "0 0 40px rgba(168,85,247,0.35)",
      }}
    />
  </div>
)}
    {selectedProfilePlayerId && (() => {
  const profilePlayer = players.find((p) => p.id === selectedProfilePlayerId);
  if (!profilePlayer) return null;

  const profileRank = getRank(profilePlayer.points);

  return (
    <div
      onClick={() => setSelectedProfilePlayerId(null)}
      style={{
        position: "fixed",
        inset: 0,
        background: "#05020a",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1100px, 96vw)",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#12101a",
          border: "1px solid #2a1b3d",
          borderRadius: 24,
          boxShadow: "0 0 50px rgba(168,85,247,0.25)",
        }}
      >
        <div
        onClick={() => setPreviewImage(profilePlayer.banner || DEFAULT_LOGO)}
          style={{
            height: isMobile ? 180 : 300,
            backgroundImage: `url(${profilePlayer.banner || DEFAULT_LOGO})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            borderRadius: "24px 24px 0 0",
            cursor: "pointer",
          }}
        >
          <button
            onClick={() => setSelectedProfilePlayerId(null)}
            style={{
              ...buttonStyle(false, false),
              position: "absolute",
              top: 14,
              right: 14,
              background: "rgba(0,0,0,0.55)",
            }}
          >
            ✕ Close
          </button>
        </div>

        <div style={{ padding: isMobile ? 18 : 28, position: "relative" }}>
          <img
            src={profilePlayer.avatar || DEFAULT_LOGO}
            alt={profilePlayer.name}
            style={{
              width: isMobile ? 110 : 155,
              height: isMobile ? 110 : 155,
              objectFit: "cover",
              borderRadius: 28,
              border: `4px solid ${profileRank.color}`,
              boxShadow: `0 0 30px ${profileRank.glow}`,
              background: "#111",
              position: isMobile ? "relative" : "absolute",
              right: isMobile ? "auto" : 40,
              top: isMobile ? -55 : -80,
            }}
          />

          <div style={{ paddingRight: isMobile ? 0 : 220 }}>
            <h1 style={{ margin: 0, fontSize: isMobile ? 32 : 48 }}>
              {profilePlayer.name}
            </h1>
{(loggedInPlayer?.id === profilePlayer.id || canAdmin) && (
  <div style={{ marginTop: 12, maxWidth: 220 }}>
    <select
      value={profilePlayer.playStyle || ""}
      onChange={(e) =>
        updatePlayer(profilePlayer.id, "playStyle", e.target.value)
      }
      style={{
        width: "100%",
        padding: 10,
        borderRadius: 10,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "#fff",
      }}
    >
      <option value="">Select Preferred Weapon</option>
      <option value="AR">🎯 AR</option>
      <option value="SMG">⚡ SMG</option>
    </select>
  </div>
)}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              <span style={badgeStyle("rgba(168,85,247,0.25)", "#d8b4fe")}>
                {profilePlayer.role}
              </span>
              <span style={badgeStyle(profileRank.glow, profileRank.color)}>
                {profileRank.name}
              </span>
              {profilePlayer.playStyle && (
  <span
    style={badgeStyle(
      "rgba(250,204,21,0.15)",
      "#facc15"
    )}
  >
    {profilePlayer.playStyle === "AR" && "🎯 AR"}
    {profilePlayer.playStyle === "SMG" && "⚡ SMG"}
  </span>
)}
            </div>

            <div style={{ marginTop: 18, fontSize: 22, fontWeight: 900, color: profileRank.color }}>
              {profileRank.name} <span style={{ color: "#cfc4e8", fontSize: 16 }}>({profilePlayer.points} Points)</span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(6, 1fr)",
              gap: 12,
              marginTop: 26,
            }}
          >
            <div style={statCardStyle()}>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{profilePlayer.points}</div>
              <div style={{ color: "#a9a0bd" }}>Points</div>
            </div>

            <div style={statCardStyle()}>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{profilePlayer.tournamentWins}</div>
              <div style={{ color: "#a9a0bd" }}>Tournament Wins</div>
            </div>

            <div style={statCardStyle()}>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{profilePlayer.wins}</div>
              <div style={{ color: "#a9a0bd" }}>Wins</div>
            </div>

            <div style={statCardStyle()}>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{profilePlayer.losses}</div>
              <div style={{ color: "#a9a0bd" }}>Losses</div>
            </div>

            <div style={statCardStyle()}>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{profilePlayer.mvpPoints}</div>
              <div style={{ color: "#a9a0bd" }}>MVP Points</div>
            </div>

            <div style={statCardStyle()}>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{profilePlayer.activityPoints}</div>
              <div style={{ color: "#a9a0bd" }}>Activity Points</div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr",
              gap: 14,
              marginTop: 18,
            }}
          >
            <div style={cardStyle()}>
              <h3 style={{ marginTop: 0 }}>About</h3>
              <div style={{ color: "#cfc4e8" }}>
                Shadowborn ZA member. Always grinding. Always improving.
              </div>
            </div>
             <div style={cardStyle()}>
  <h3 style={{ marginTop: 0 }}>BO7 Ranked Rank</h3>
{canAdmin && (state.rankRequests || []).filter((r) => r.status === "pending").length > 0 ? (
  <div style={cardStyle()}>
    <h3 style={{ marginTop: 0 }}>Pending Rank Approvals</h3>

    <div style={{ display: "grid", gap: 10 }}>
      {(state.rankRequests || [])
        .filter((r) => r.status === "pending")
        .map((request) => (
          <div
            key={request.id}
            style={{
              background: "rgba(0,0,0,0.22)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 900 }}>
              {request.playerName} requested {request.requestedRank}
            </div>

            <div style={{ color: "#a9a0bd", fontSize: 13, marginTop: 4 }}>
              Submitted: {request.createdAt}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              <button
                type="button"
                onClick={() => setPreviewImage(request.proofUrl)}
                style={buttonStyle(false, false)}
              >
                View Proof
              </button>

              <button
                type="button"
                onClick={() => approveRankRequest(request.id)}
                style={buttonStyle(true, false)}
              >
                Approve
              </button>

              <button
                type="button"
                onClick={() => rejectRankRequest(request.id)}
                style={{
                  ...buttonStyle(false, false),
                  background: "rgba(239,68,68,0.22)",
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
    </div>
  </div>
) : null}
  <div style={{ marginBottom: 10 }}>
    Current Approved Rank:{" "}
    <strong>{profilePlayer.codRank || "Not approved yet"}</strong>
  </div>

  {loggedInPlayer?.id === profilePlayer.id ? (
    <div style={{ display: "grid", gap: 10 }}>
      <select
        value={rankRequestDraft.rank}
        onChange={(e) =>
          setRankRequestDraft({ ...rankRequestDraft, rank: e.target.value })
        }
        style={inputStyle(false)}
      >
        <option value="">Select your BO7 rank</option>
        {COD_RANKS.map((rank) => (
          <option key={rank} value={rank}>
            {rank}
          </option>
        ))}
      </select>

      <button
  type="button"
  onClick={chooseRankProof}
  style={buttonStyle(false, false)}
>
  Upload Screenshot Proof
</button>

{rankRequestDraft.proofUrl ? (
  <div style={{ color: "#86efac", fontSize: 13 }}>
    ✅ Screenshot uploaded
  </div>
) : (
  <div style={{ color: "#fca5a5", fontSize: 13 }}>
    Screenshot proof required
  </div>
)}

      <button onClick={submitRankRequest} style={buttonStyle(true, false)}>
        Submit Rank for Approval
      </button>
    </div>
  ) : (
    <div style={{ color: "#a9a0bd" }}>
      Only this player can request a rank update.
    </div>
  )}
</div>
            <div style={cardStyle()}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: "#a9a0bd" }}>Member Since</span>
                <strong>{profilePlayer.createdAt || "2026/05/11"}</strong>
              </div>

              {canAdmin ? (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#a9a0bd" }}>Login PIN</span>
                  <strong>{state.playerPins?.[profilePlayer.id] || PLAYER_PINS[profilePlayer.id] || "Not set"}</strong>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})()}
      <div style={{ maxWidth: 1800, margin: "0 auto", padding: 20 }}>
       {pendingCallout && (
  <div
    style={{
      background: "linear-gradient(135deg, #7f1d1d, #dc2626)",
      padding: 16,
      borderRadius: 14,
      marginBottom: 16,
      fontWeight: 900,
      textAlign: "center",
      boxShadow: "0 0 20px rgba(220,38,38,0.6)",
    }}
  >
    ⚠️ YOU HAVE BEEN CALLED OUT ⚠️

    <div style={{ fontSize: 16, marginTop: 6 }}>
      {
        sortedPlayers.find(p => p.id === pendingCallout.challengerId)?.name
      } has called you out.
    </div>

    <div style={{ fontSize: 13, marginTop: 4 }}>
      Accept the challenge or forfeit the match.
    </div>

    <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 10 }}>
      <button
        onClick={() => acceptCallout(pendingCallout.id)}
        style={buttonStyle(true, false)}
      >
        Accept Call-out
      </button>

      <button
        onClick={() => forfeitCallout(pendingCallout.id)}
        style={buttonStyle(false, false)}
      >
        Forfeit
      </button>
    </div>
  </div>
)}
      {/* LOGGED-IN TOP BAR */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
  }}
>
  <div
    style={{
      color: "#b8a7d4",
      fontSize: isMobile ? 13 : 14,
    }}
  >
    Logged in as{" "}
    <strong style={{ color: "#c084fc" }}>
      {loggedInPlayer.name}
    </strong>{" "}
    • {loggedInPlayer.role}
    {saving ? " • Saving..." : ""}
  </div>

  <div
    style={{
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
    }}
  >
    <a
      href={DISCORD_LINK}
      target="_blank"
      rel="noreferrer"
      style={{
        ...buttonStyle(false, false),
        textDecoration: "none",
      }}
    >
      <MessageCircle size={14} />
      Discord
    </a>

    <button
      type="button"
      onClick={logout}
      style={buttonStyle(false, false)}
    >
      <LogOut size={14} />
      Logout
    </button>
  </div>
</div>

{/* PREMIUM CLAN HERO */}
<div
  style={{
    ...cardStyle(),
    position: "relative",
    overflow: "hidden",
    marginBottom: 18,
    padding: isMobile ? 20 : 28,

    background:
      "linear-gradient(135deg, rgba(14,9,23,0.72), rgba(5,3,10,0.48))",

    border: "1px solid rgba(192,132,252,0.16)",
  }}
>
  {/* Ambient hero glow */}
  <div
    aria-hidden="true"
    style={{
      position: "absolute",
      width: isMobile ? 260 : 520,
      height: isMobile ? 260 : 520,
      left: isMobile ? -110 : -180,
      top: isMobile ? -100 : -210,
      borderRadius: "50%",

      background:
        "radial-gradient(circle, rgba(126,34,206,0.30), rgba(88,28,135,0.10) 45%, transparent 72%)",

      filter: "blur(18px)",
      pointerEvents: "none",
    }}
  />

  <div
    style={{
      position: "relative",
      zIndex: 2,
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "170px minmax(0, 1fr)",
      gap: isMobile ? 20 : 28,
      alignItems: "center",
    }}
  >
    {/* New circular emblem */}
    <div
      style={{
        width: isMobile ? 132 : 160,
        height: isMobile ? 132 : 160,
        margin: isMobile ? "0 auto" : 0,
        borderRadius: "50%",
        padding: 8,

        background:
          "radial-gradient(circle, rgba(168,85,247,0.30), rgba(5,3,10,0.84) 70%)",

        border: "1px solid rgba(192,132,252,0.42)",

        boxShadow:
          "0 0 28px rgba(168,85,247,0.30), 0 0 70px rgba(88,28,135,0.22)",
      }}
    >
      <img
        src={state.logoUrl || DEFAULT_LOGO}
        alt="Shadowborn ZA"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",

          WebkitMaskImage:
            "radial-gradient(circle, black 58%, rgba(0,0,0,0.82) 72%, transparent 88%)",

          maskImage:
            "radial-gradient(circle, black 58%, rgba(0,0,0,0.82) 72%, transparent 88%)",
        }}
      />
    </div>

    <div
      style={{
        minWidth: 0,
        textAlign: isMobile ? "center" : "left",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: isMobile ? "center" : "flex-start",
          marginBottom: 14,
        }}
      >
        <span style={badgeStyle()}>
          <Trophy size={14} />
          Clan Hub
        </span>

        <span style={badgeStyle()}>
          <ShieldCheck size={14} />
          Saved Online
        </span>

        <span style={badgeStyle()}>
          <Swords size={14} />
          Double Elimination
        </span>

        <span style={badgeStyle()}>
          <Star size={14} />
          Hall of Fame
        </span>
      </div>

      <h1
        style={{
          margin: 0,
          fontSize: isMobile ? 34 : 52,
          lineHeight: 1,
          letterSpacing: -1,
          fontWeight: 950,
        }}
      >
        {state.clanName}
      </h1>

      <div
        style={{
          color: "#bbaecb",
          marginTop: 12,
          fontSize: isMobile ? 16 : 19,
        }}
      >
        {state.tagline}
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: isMobile ? "center" : "flex-start",
          marginTop: 20,
        }}
      >
        <div
          style={{
            padding: "9px 13px",
            borderRadius: 999,
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.18)",
            color: "#86efac",
            fontSize: 12,
            fontWeight: 850,
          }}
        >
          ● Platform Online
        </div>

        <div
          style={{
            padding: "9px 13px",
            borderRadius: 999,
            background: "rgba(168,85,247,0.09)",
            border: "1px solid rgba(192,132,252,0.18)",
            color: "#d8b4fe",
            fontSize: 12,
            fontWeight: 850,
          }}
        >
          {players.length} Clan Members
        </div>
      </div>
    </div>
  </div>
</div>  

{/* ONLINE MEMBERS */}
<div
  style={{
    ...cardStyle(),
    marginBottom: 18,
    padding: isMobile ? 15 : 18,
    overflow: "hidden",
  }}
>
  <button
    type="button"
    onClick={() =>
      setOnlinePlayersExpanded((current) => !current)
    }
    style={{
      width: "100%",
      padding: 0,
      border: "none",
      background: "transparent",
      color: "white",
      cursor: "pointer",

      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 14,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          width: 11,
          height: 11,
          flexShrink: 0,
          borderRadius: "50%",
          background: "#22c55e",
          boxShadow:
            "0 0 12px rgba(34,197,94,0.75)",
        }}
      />

      <span
        style={{
          fontWeight: 950,
          fontSize: isMobile ? 14 : 16,
          letterSpacing: 0.4,
        }}
      >
        Online Now ({onlinePlayers.length})
      </span>
    </div>

    <span
      style={{
        color: "#c084fc",
        fontSize: 13,
        fontWeight: 850,
      }}
    >
      {onlinePlayersExpanded ? "Collapse ▲" : "View all ▼"}
    </span>
  </button>

  {onlinePlayersExpanded ? (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : "repeat(auto-fit, minmax(210px, 1fr))",
        gap: 10,
        marginTop: 16,
      }}
    >
      {onlinePlayers.length === 0 ? (
        <div
          style={{
            color: "#9589a8",
            padding: "12px 2px",
          }}
        >
          No clan members are currently online.
        </div>
      ) : (
        onlinePlayers.map((onlinePlayer) => {
          const matchingPlayer = players.find(
            (player) =>
              Number(player.id) ===
              Number(onlinePlayer.player_id)
          );

          const avatarImage =
            onlinePlayer.avatar_url ||
            matchingPlayer?.avatar ||
            matchingPlayer?.cardPhoto ||
            DEFAULT_LOGO;

          return (
            <button
              key={onlinePlayer.player_id}
              type="button"
              onClick={() => {
                if (matchingPlayer) {
                  setSelectedProfilePlayerId(
                    matchingPlayer.id
                  );
                }
              }}
              style={{
                padding: 11,
                borderRadius: 15,

                display: "flex",
                alignItems: "center",
                gap: 11,

                border:
                  "1px solid rgba(255,255,255,0.07)",

                background:
                  "linear-gradient(145deg, rgba(24,18,34,0.62), rgba(8,6,14,0.52))",

                color: "white",
                textAlign: "left",
                cursor: matchingPlayer
                  ? "pointer"
                  : "default",

                boxShadow:
                  "0 8px 20px rgba(0,0,0,0.18)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 46,
                  height: 46,
                  flexShrink: 0,
                }}
              >
                <img
                  src={avatarImage}
                  alt={onlinePlayer.player_name}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border:
                      "1px solid rgba(192,132,252,0.42)",
                  }}
                />

                <span
                  style={{
                    position: "absolute",
                    width: 12,
                    height: 12,
                    right: -1,
                    bottom: -1,
                    borderRadius: "50%",
                    background: "#22c55e",
                    border: "2px solid #0b0711",
                    boxShadow:
                      "0 0 9px rgba(34,197,94,0.8)",
                  }}
                />
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 900,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {onlinePlayer.player_name}
                </div>

                <div
                  style={{
                    color: "#a99dbb",
                    fontSize: 12,
                    marginTop: 3,
                  }}
                >
                  {onlinePlayer.current_page ||
                    "Shadowborn ZA"}
                </div>
              </div>
            </button>
          );
        })
      )}
    </div>
  ) : null}
</div>
        {state.championBanner ? (
          <div style={{ ...cardStyle(), marginBottom: 18, background: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(168,85,247,0.18))" }}>
            <div style={{ fontSize: 14, color: "#fde68a", fontWeight: 800 }}>CURRENT CHAMPION</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>
              {state.championBanner.teamName}
            </div>
            <div style={{ color: "#d6caef", marginTop: 4 }}>
              Crowned on {state.championBanner.createdAt}
            </div>
          </div>
        ) : null}

        <>
  {/* Top Menu Button */}
  <div style={{ marginBottom: 20 }}>
    <button
      type="button"
      onClick={() => setMenuOpen(true)}
      style={{
        ...buttonStyle(true, false),
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Menu size={18} />
      Menu
    </button>
  </div>

  {/* Dark Overlay */}
  {menuOpen && (
    <div
      onClick={() => setMenuOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 98,
      }}
    />
  )}

  {/* Slide Menu */}
  <div
    style={{
      position: "fixed",
      top: 0,
      left: menuOpen ? 0 : -320,
      width: 280,
      height: "100vh",
      background: "#12091d",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      padding: 20,
      zIndex: 99,
      transition: "left 0.25s ease",
      boxShadow: "0 0 40px rgba(0,0,0,0.45)",
      overflowY: "auto",
    }}
  >
    {/* Header */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 20 }}>
        Shadowborn ZA
      </div>

      <button
        type="button"
        onClick={() => setMenuOpen(false)}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
        }}
      >
        <X size={22} />
      </button>
    </div>

    {/* Menu Items */}
    {[
      ["dashboard", "Dashboard", <Home size={18} />],
      ["leaderboard", "Leaderboard", <Trophy size={18} />],
      ["competition", "A-Team / Challengers", <ShieldCheck size={18} />],
      ["players", "Players", <Users size={18} />],
      ["callouts", "Call-outs", <Swords size={18} />],
      ["tournament", "Tournament", <Crown size={18} />],
      ["bracket", "Bracket", <Flame size={18} />],
      ["hall", "Hall of Fame", <Star size={18} />],
      ["sunday", "Sunday Points", <Flame size={18} />],
      ["vote", "Vote", <Crown size={18} />],
      ["recommendations", "Recommendations", <Star size={18} />],
    ].map(([key, label, icon]) => (
      <button
        key={key}
        type="button"
        onClick={() => {
          setTab(key);
          setMenuOpen(false);
        }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          marginBottom: 8,
          borderRadius: 14,
          border: "none",
          background:
            tab === key
              ? "linear-gradient(135deg, #7c3aed, #a855f7)"
              : "rgba(255,255,255,0.04)",
          color: "white",
          fontWeight: 800,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {icon}
        {label}
      </button>
    ))}
  </div>
</>

        {tab === "dashboard" && (
  <>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
      <div style={cardStyle()}><Users /><div style={{ marginTop: 12, color: "#cfc4e8" }}>Total Players</div><div style={{ fontSize: 32, fontWeight: 900 }}>{players.length}</div></div>
      <div style={cardStyle()}><Swords /><div style={{ marginTop: 12, color: "#cfc4e8" }}>Tournament Teams</div><div style={{ fontSize: 32, fontWeight: 900 }}>{tournament.teams.length}</div></div>
      <div style={cardStyle()}><Target /><div style={{ marginTop: 12, color: "#cfc4e8" }}>Tournament Format</div><div style={{ fontSize: 32, fontWeight: 900 }}>{tournament.format}</div></div>
      <div
  style={{
    ...cardStyle(),
    background: "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(124,58,237,0.16))",
    border: "1px solid rgba(250,204,21,0.45)",
  }}
>
  <Crown />
  <div style={{ marginTop: 12, color: "#fde68a", fontWeight: 800 }}>
    Defending Champion
  </div>
  <div style={{ fontSize: 20, fontWeight: 900 }}>
    {championTeam ? getTeamName(championTeam) : state.championBanner?.teamName || "TBD"}
  </div>
  <div style={{ color: "#d6caef", marginTop: 6, fontSize: 13 }}>
    Current Shadowborn ZA tournament champion
  </div>
</div>
    </div>
 <div style={{ ...cardStyle(), marginBottom: 18 }}>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
      marginBottom: 16,
    }}
  >
    <div>
      <h2 style={{ margin: 0 }}>
        🛡 Shadowborn Competitive Divisions
      </h2>

      <div
        style={{
          color: "#cfc4e8",
          marginTop: 5,
        }}
      >
        Official competitive rosters for the current season.
      </div>
    </div>
  </div>

  {[
    {
      number: 1,
      players: division1Players,
      title: "Division 1",
      subtitle: "Shadowborn ZA elite competitive roster",
      color: "#facc15",
    },
    {
      number: 2,
      players: division2Players,
      title: "Division 2",
      subtitle: "Promotion and development roster",
      color: "#cbd5e1",
    },
    {
      number: 3,
      players: division3Players,
      title: "Division 3",
      subtitle: "Challenger and rising talent roster",
      color: "#fb923c",
    },
  ].map((division) => (
    <div
      key={division.number}
      style={{
        marginTop: division.number === 1 ? 0 : 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 950,
              color: division.color,
            }}
          >
            {division.title}
          </div>

          <div
            style={{
              color: "#b9accf",
              fontSize: 13,
              marginTop: 3,
            }}
          >
            {division.subtitle}
          </div>
        </div>

        <span
          style={badgeStyle(
            `${division.color}22`,
            division.color
          )}
        >
          {division.players.length}/4 Players
        </span>
      </div>

      {division.players.length === 0 ? (
        <div
          style={{
            padding: 18,
            borderRadius: 16,
            border: "1px dashed rgba(255,255,255,0.14)",
            color: "#9d90b7",
            textAlign: "center",
          }}
        >
          No players assigned to {division.title}.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
  ? "1fr"
  : "repeat(4, minmax(0, 1fr))",
          }}
        >
          {division.players.map((player) => (
  <CompetitiveDivisionCard
    key={player.id}
    player={player}
  />
))}
        </div>
      )}
    </div>
  ))}
</div>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr", gap: 16 }}>
     
        
        <div style={{ display: "grid", gap: 16 }}>
  <div style={cardStyle()}>
    <h2 style={{ marginTop: 0 }}>🏅 Competitive Rankings</h2>
    <div style={{ color: "#d6caef", marginBottom: 18 }}>
      Current CR standings across the clan.
    </div>

    {(() => {
  const topCRPlayers = [...players]
    .sort((a, b) => getCompetitiveScore(b) - getCompetitiveScore(a))
    .slice(0, 4);

  const highestCR = Math.max(
    ...topCRPlayers.map((p) => getCompetitiveScore(p)),
    1
  );

  return topCRPlayers.map((player, index) => (
        <div
          key={player.id}
          style={{
            marginBottom: 14,
            padding: 12,
            borderRadius: 14,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            <span>{["🥇", "🥈", "🥉", "⭐"][index]} {player.name}</span>
            <span>{getCompetitiveScore(player)} CR</span>
          </div>

          <div
            style={{
              height: 8,
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(getCompetitiveScore(player) / highestCR) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg,#facc15,#7c3aed)",
              }}
            />
          </div>
        </div>
      ));
})()}
  </div>
</div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <div style={cardStyle()}>
          <h2 style={{ marginTop: 0 }}>🔥 Weekly Challenge Leaders</h2>
          <div style={{ color: "#d6caef", marginBottom: 18 }}>This week's hardest grinders.</div>

          {[...players]
            .sort((a, b) => (b.weeklyChallenges || 0) - (a.weeklyChallenges || 0))
            .slice(0, 4)
            .map((player, index) => (
              <div key={player.id} style={{ marginBottom: 14, padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, marginBottom: 8 }}>
                  <span>{["🥇", "🥈", "🥉", "⭐"][index]} {player.name}</span>
                  <span>{player.weeklyChallenges || 0}</span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.min((player.weeklyChallenges || 0) * 5, 100)}%`,
                      height: "100%",
                      background: "linear-gradient(90deg,#facc15,#a855f7)",
                    }}
                  />
                </div>
              </div>
            ))}
        </div>

        <div style={cardStyle()}>
          <h2 style={{ marginTop: 0 }}>Vote Snapshot</h2>
          {state.poll.options.map((option) => (
            <div key={option.id} style={{ display: "flex", justifyContent: "space-between", padding: 12, borderRadius: 14, background: "rgba(0,0,0,0.18)", marginBottom: 10 }}>
              <div>{option.label}</div>
              <span style={badgeStyle()}>{option.votes} votes</span>
            </div>
          ))}
        </div>
      </div>
  </>
)}
        {tab === "competition" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={cardStyle()}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ marginTop: 0, marginBottom: 6 }}>👑 Shadowborn ZA A-Team</h2>
                  <div style={{ color: "#d6caef" }}>
                    Fixed competitive roster. These 4 players represent the clan in serious scrims, clan wars and tournaments.
                  </div>
                </div>
                <span style={badgeStyle("rgba(250,204,21,0.16)", "#fde68a")}>
                  {aTeamPlayers.length}/4 Pro Team Spots
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14, marginTop: 16 }}>
                {aTeamPlayers.length === 0 ? (
                  <div style={{ color: "#c4b5fd" }}>No A-Team selected yet. Admins can promote players below.</div>
                ) : (
                  aTeamPlayers.map((player, index) => (
                    <div
                      key={player.id}
                      style={{
                        padding: 16,
                        borderRadius: 18,
                        background: "linear-gradient(135deg, rgba(250,204,21,0.14), rgba(124,58,237,0.18))",
                        border: "1px solid rgba(250,204,21,0.36)",
                        boxShadow: "0 0 26px rgba(250,204,21,0.14)",
                      }}
                    >
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <img
                          src={player.avatar || DEFAULT_LOGO}
                          alt={player.name}
                          style={{ width: 58, height: 58, borderRadius: 16, objectFit: "cover", border: "1px solid rgba(250,204,21,0.55)" }}
                        />
                        <div>
                          <div style={{ fontWeight: 900, fontSize: 18 }}>#{index + 1} {player.name}</div>
                          <div style={{ color: "#fde68a", fontWeight: 800 }}>A-Team Pro</div>
                          {player.playStyle && (
  <div
    style={{
      marginTop: 4,
      fontSize: 20,
      fontWeight: 900,
      textShadow: "0 0 12px currentColor",
      color:
        player.playStyle === "AR"
          ? "#facc15"
          : player.playStyle === "SMG"
          ? "#ef4444"
          : "#a855f7",
    }}
  >
    {player.playStyle === "AR" && "🎯 AR"}
    {player.playStyle === "SMG" && "⚡ SMG"}
    {player.playStyle === "FLEX" && "🔀 FLEX"}
  </div>
)}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
                        <div style={badgeStyle()}>CR {getCompetitiveScore(player)}</div>
                        <div style={badgeStyle("rgba(250,204,21,0.13)", "#facc15")}>
  🏆 Challenges {player.weeklyChallenges || 0}
</div>
                        <div style={badgeStyle()}>W {player.wins} / L {player.losses}</div>
                        <div style={badgeStyle("rgba(34,197,94,0.13)", "#86efac")}>Training {player.trainingAttended || 0}</div>
                        <div style={badgeStyle("rgba(239,68,68,0.13)", "#fca5a5")}>Missed {player.trainingMissed || 0}</div>
                      </div>
                      {canAdmin && (
  <>
    <button
      type="button"
      onClick={() => setTeamRole(player.id, "challenger")}
      style={{ ...buttonStyle(false, false), marginTop: 12, width: "100%" }}
    >
      Move to Challengers
    </button>
    <button
  type="button"
  onClick={() => setTeamRole(player.id, "promotion")}
  style={{
    ...buttonStyle(false, false),
    marginTop: 12,
    width: "100%",
  }}
>
  Move to Promotion Squad
</button>

    <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginTop: 10,
  }}
>
      <button
        type="button"
        onClick={() => markTraining(player.id, "attended")}
        style={buttonStyle(false, false)}
      >
        ✅ Train
      </button>

      <button
        type="button"
        onClick={() => markTraining(player.id, "missed")}
        style={buttonStyle(false, false)}
      >
        ❌ Missed
      </button>
<button
  type="button"
  onClick={() =>
  setWeeklyAwardDraft({
    playerId: player.id,
    amount: 10,
    reason: "",
  })
}
  style={buttonStyle(true, false)}
>
  🏆 Weekly 
</button>
      <button
        type="button"
        onClick={() => resetTraining(player.id)}
        style={buttonStyle(false, false)}
      >
        🔄 Reset
      </button>
      <button
  type="button"
  onClick={() => resetPlayerCR(player.id)}
  style={buttonStyle(false, false)}
>
  Reset CR
</button>
    </div>
  </>
)}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>🔥 Promotion Squad</h2>
              <div style={{ color: "#d6caef", marginBottom: 14 }}>
                The next 4 players in line for A-Team promotion. Strong performance, activity and training attendance can earn an A-Team opportunity.
              </div>

              {promotionZonePlayers.length === 0 ? (
                <div style={{ color: "#c4b5fd" }}>No challengers yet.</div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {promotionZonePlayers.map((player, index) => (
                    <div
                      key={player.id}
                      style={{
                        padding: 14,
                        borderRadius: 16,
                        background:
                          index === 0
                            ? "linear-gradient(135deg, rgba(239,68,68,0.20), rgba(250,204,21,0.12))"
                            : "rgba(255,255,255,0.05)",
                        border: index === 0 ? "1px solid rgba(239,68,68,0.45)" : "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 18 }}>
                          {index === 0 ? "⚔️ #1 Challenger" : `#${index + 1} Challenger`} • {player.name}
                        </div>
                        {player.playStyle && (
  <div
    style={{
      marginTop: 4,
      fontSize: 16,
      fontWeight: 900,
      color:
        player.playStyle === "AR"
          ? "#facc15"
          : player.playStyle === "SMG"
          ? "#ef4444"
          : "#a855f7",
    }}
  >
    {player.playStyle === "AR" && "🎯 AR"}
    {player.playStyle === "SMG" && "⚡ SMG"}
    {player.playStyle === "FLEX" && "🔀 FLEX"}
  </div>
)}
                       <div style={{ color: "#d6caef", marginTop: 4 }}>
  CR {getCompetitiveScore(player)} •
  🏆 Weekly {player.weeklyChallenges || 0} •
  W {player.wins} /
  L {player.losses} •
  MVP {player.mvpPoints || 0}
</div>
                        {lowestATeamPlayer && (
                          <div style={{ color: "#fca5a5", marginTop: 4, fontWeight: 800 }}>
                            Target spot: {lowestATeamPlayer.name}
                          </div>
                        )}
                      </div>

                      <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginTop: 12,
  }}
>
                        {canAdmin && (
  <>
    <button
      type="button"
      onClick={() => setTeamRole(player.id, "a-team")}
      style={buttonStyle(true, false)}
    >
      Promote to A-Team
    </button>

    <button
      type="button"
      onClick={() => setTeamRole(player.id, "challenger")}
      style={{
        ...buttonStyle(false, false),
        marginTop: 8,
        width: "100%",
      }}
    >
      Move to Challengers
    </button>
  </>
)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>⚔️ Challenger Rankings</h2>
              <div style={{ color: "#d6caef", marginBottom: 14 }}>
                This is the grind ladder for everyone outside the A-Team. Activity alone should not be enough — wins, MVPs, tournaments and training must matter.
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {challengerPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.045)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "70px 1fr 260px",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontWeight: 900, color: index < 3 ? "#fde68a" : "#c4b5fd" }}>#{index + 1}</div>
                    <div>
                      <div style={{ fontWeight: 900 }}>{player.name}</div>
                      {player.playStyle && (
  <div
    style={{
      color: "#facc15",
      fontSize: 18,
      fontWeight: 700,
      marginTop: 2,
    }}
  >
    {player.playStyle === "AR" && "🎯 AR"}
    {player.playStyle === "SMG" && "⚡ SMG"}
    {player.playStyle === "FLEX" && "🔀 FLEX"}
  </div>
)}
                      <div style={{ color: "#d6caef", fontSize: 13 }}>
                        CR {getCompetitiveScore(player)} • Points {player.points} • W {player.wins} / L {player.losses} • Tournaments {player.tournamentWins}
                      </div>
                    </div>
                    {canAdmin && (
                      <div style={{ display: "flex", gap: 6, justifyContent: isMobile ? "flex-start" : "flex-end", flexWrap: "wrap" }}>
                        <button type="button" onClick={() => updateTraining(player.id, "attended", 1)} style={buttonStyle(false, false)}>+ Training</button>
                        <button type="button" onClick={() => updateTraining(player.id, "missed", 1)} style={buttonStyle(false, false)}>+ Missed</button>
                        <button
  type="button"
  onClick={() =>
  setWeeklyAwardDraft({
    playerId: player.id,
    amount: 10,
    reason: "",
  })
}
  style={buttonStyle(true, false)}
>
  🏆 + Challenge
</button>
                        <button type="button" onClick={() => setTeamRole(player.id, "a-team")} style={buttonStyle(true, false)}>A-Team</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {canAdmin && (
              <div style={cardStyle()}>
                <h2 style={{ marginTop: 0 }}>🛠 Admin Competitive Rating</h2>
                <div style={{ color: "#d6caef", marginBottom: 14 }}>
                  Optional manual CR override. Leave it on 0 to let the site calculate CR from points, wins, MVP, tournaments and training.
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {competitivePlayers.map((player) => (
                    <div
                      key={player.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 140px 160px 160px",
                        gap: 10,
                        alignItems: "center",
                        padding: 12,
                        borderRadius: 14,
                        background: "rgba(0,0,0,0.16)",
                      }}
                    >
                      <strong>{player.name}</strong>
                      <input
                        type="number"
                        value={player.competitiveRating || 0}
                        onChange={(e) => updatePlayer(player.id, "competitiveRating", e.target.value)}
                        style={inputStyle(false)}
                      />
                      <select
                        value={player.teamRole || "challenger"}
                        onChange={(e) => setTeamRole(player.id, e.target.value)}
                        style={inputStyle(false)}
                      >
                        <option value="challenger">Challenger</option>
                        <option value="a-team">A-Team</option>
                      </select>
                      <span style={badgeStyle(player.teamRole === "a-team" ? "rgba(250,204,21,0.16)" : "rgba(124,58,237,0.16)", player.teamRole === "a-team" ? "#fde68a" : "#d8b4fe")}>
                        {player.teamRole === "a-team" ? "Pro Team" : "Challenger"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "leaderboard" && (
  <div style={{ display: "grid", gap: 12 }}>
    
    {canAdmin ? (
  <>
    <button
      type="button"
      onClick={postLeaderboardToDiscord}
      style={{
        ...buttonStyle(true, false),
        background: "linear-gradient(135deg, #7f1d1d, #dc2626)",
        marginBottom: 8,
      }}
    >
      <MessageCircle size={14} /> Post Leaderboard to Discord
    </button>

    <button
      type="button"
      onClick={archiveSeasonAndReset}
      style={{
        ...buttonStyle(true, false),
        background: "linear-gradient(135deg, #92400e, #f59e0b)",
        marginBottom: 8,
      }}
    >
      🏆 Archive Season & Reset Leaderboard
    </button>
  </>
) : null}
          {(state.seasonHistory || []).length > 0 && (
  <div style={{ ...cardStyle(), marginBottom: 18 }}>
    <h2>👑 Season Legacy</h2>

    {Object.entries(
      (state.seasonHistory || [])
        .flatMap((season) => season.top4 || [])
        .reduce((acc, player) => {
          acc[player.playerName] = (acc[player.playerName] || 0) + 1;
          return acc;
        }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([playerName, count], index) => (
        <div
          key={playerName}
          style={{
            padding: 10,
            marginTop: 8,
            borderRadius: 10,
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <strong>
            {index === 0 ? "👑" : `#${index + 1}`} {playerName}
          </strong>
          <span>{count} Top 4 finishes</span>
        </div>
      ))}
  </div>
)}
    <div
  style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: 16,
    alignItems: "start",
  }}
>
  {/* SMG LEADERBOARD */}
  <div style={cardStyle()}>
    <h2 style={{ marginTop: 0 }}>⚡ SMG Leaderboard</h2>

    <div style={{ color: "#d6caef", marginBottom: 16 }}>
      Ranked by Competitive Rating
    </div>

    {smgPlayers.length === 0 ? (
      <div style={{ color: "#9d90b7" }}>
        No SMG players selected yet.
      </div>
    ) : (
      smgPlayers.slice(0, 10).map((player, index) => (
        <LeaderboardCard
          key={player.id}
          player={player}
          index={index}
          competitiveScore={getCompetitiveScore(player)}
        />
      ))
    )}
  </div>

  {/* AR LEADERBOARD */}
  <div style={cardStyle()}>
    <h2 style={{ marginTop: 0 }}>🎯 AR Leaderboard</h2>

    <div style={{ color: "#d6caef", marginBottom: 16 }}>
      Ranked by Competitive Rating
    </div>

    {arPlayers.length === 0 ? (
      <div style={{ color: "#9d90b7" }}>
        No AR players selected yet.
      </div>
    ) : (
      arPlayers.slice(0, 10).map((player, index) => (
        <LeaderboardCard
          key={player.id}
          player={player}
          index={index}
          competitiveScore={getCompetitiveScore(player)}
        />
      ))
    )}
  </div>
</div>

{/* NO PREFERENCE */}
{noPreferencePlayers.length > 0 && (
  <div style={{ ...cardStyle(), marginTop: 16 }}>
    <h2 style={{ marginTop: 0 }}>❔ No Preferred Weapon Selected</h2>

    <div style={{ color: "#d6caef", marginBottom: 16 }}>
      These players must select either SMG or AR from their profile.
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 10,
      }}
    >
      {noPreferencePlayers.map((player) => (
        <div
          key={player.id}
          style={{
            padding: 12,
            borderRadius: 14,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <strong>{player.name}</strong>
          <span>{getCompetitiveScore(player)} CR</span>
        </div>
      ))}
    </div>
  </div>
)}     
{(state.seasonHistory || []).length > 0 && (
  <div style={{ ...cardStyle(), marginTop: 18 }}>
    <h2>🏆 Season Leaderboard History</h2>

    {(state.seasonHistory || []).map((season) => (
      <div
        key={season.id}
        style={{
          marginTop: 14,
          padding: 14,
          borderRadius: 14,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(250,204,21,0.25)",
        }}
      >
        <h3>{season.seasonName}</h3>
        <div style={{ color: "#c4b5fd", marginBottom: 10 }}>
          Ended: {season.endedAt}
        </div>
        {(() => {
  const smg = season.top4.filter((p) => p.weaponType === "SMG");
  const ar = season.top4.filter((p) => p.weaponType === "AR");

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <h4 style={{ color: "#38bdf8", marginBottom: 6 }}>
          ⚡ SMG Champions
        </h4>

        {smg.map((p, index) => (
          <div key={`${season.id}-smg-${p.playerId}`}>
            {index === 0 ? "🥇" : "🥈"} {p.playerName} — {p.points} CR — {p.rank}
          </div>
        ))}
      </div>

      <div>
        <h4 style={{ color: "#facc15", marginBottom: 6 }}>
          🎯 AR Champions
        </h4>

        {ar.map((p, index) => (
          <div key={`${season.id}-ar-${p.playerId}`}>
            {index === 0 ? "🥇" : "🥈"} {p.playerName} — {p.points} CR — {p.rank}
          </div>
        ))}
      </div>
    </>
  );
})()}

      </div>
    ))}
  </div>
)}
          </div>
        )}
        {tab === "players" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.25fr 0.75fr", gap: 16 }}>
            <div style={{ display: "grid", gap: 12 }}>
              {players.map((player) => <PlayerCard key={player.id} player={player} />)}
            </div>

            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Add Clan Member</h2>
{canAdmin ? (
  <button
    type="button"
    onClick={auditPlayerPins}
    style={{
      ...buttonStyle(false, false),
      width: "100%",
      marginBottom: 16,
      background: "rgba(250,204,21,0.16)",
      border: "1px solid rgba(250,204,21,0.45)",
      color: "#fde047",
    }}
  >
    🔐 Audit All Player PINs
  </button>
) : null}
              <div style={{ marginBottom: 8 }}>Name</div>
              <input value={newPlayer.name} onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })} style={{ ...inputStyle(!canAdmin), marginBottom: 12 }} disabled={!canAdmin} />

              <div style={{ marginBottom: 8 }}>Emblem</div>
              <input value={newPlayer.emblem} onChange={(e) => setNewPlayer({ ...newPlayer, emblem: e.target.value })} style={{ ...inputStyle(!canAdmin), marginBottom: 12 }} disabled={!canAdmin} />

              <div style={{ marginBottom: 8 }}>Starting Points</div>
              <input type="number" value={newPlayer.points} onChange={(e) => setNewPlayer({ ...newPlayer, points: e.target.value })} style={{ ...inputStyle(!canAdmin), marginBottom: 12 }} disabled={!canAdmin} />
              <div style={{ marginBottom: 8 }}>Login PIN</div>
<input
  type="text"
  value={newPlayer.pin}
  onChange={(e) => setNewPlayer({ ...newPlayer, pin: e.target.value })}
  placeholder="Example: 1234"
  style={inputStyle(!canAdmin)}
  disabled={!canAdmin}
/>
              <div style={{ marginBottom: 8 }}>Tournament Wins</div>
              <input type="number" value={newPlayer.tournamentWins} onChange={(e) => setNewPlayer({ ...newPlayer, tournamentWins: e.target.value })} style={{ ...inputStyle(!canAdmin), marginBottom: 12 }} disabled={!canAdmin} />

              <div style={{ marginBottom: 8 }}>Role</div>
              <select value={newPlayer.role} onChange={(e) => setNewPlayer({ ...newPlayer, role: e.target.value })} style={{ ...inputStyle(!canAdmin), marginBottom: 12 }} disabled={!canAdmin}>
                <option value="leader">leader</option>
                <option value="co-leader">co-leader</option>
                <option value="player">player</option>
              </select>

              <button onClick={addPlayer} style={{ ...buttonStyle(true, !canAdmin), width: "100%" }} disabled={!canAdmin}>
                <Plus size={16} /> Add Player
              </button>
            </div>
          </div>
        )}

        {tab === "callouts" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.8fr 1.2fr", gap: 16 }}>
            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Create Call-out</h2>
              <div style={{ color: "#d6caef", marginBottom: 12 }}>
                You can call out someone within 2 positions above or below you. Winner +10, loser -10.
              </div>

              <select
                value={calloutDraft.challengedId}
                onChange={(e) => setCalloutDraft({ ...calloutDraft, challengedId: e.target.value })}
                style={{ ...inputStyle(false), marginBottom: 12 }}
              >
                <option value="">Select opponent</option>
                {sortedPlayers
                  .filter((p) => {
                    const me = sortedPlayers.findIndex((x) => x.id === loggedInPlayer.id);
                    const them = sortedPlayers.findIndex((x) => x.id === p.id);
                    return p.id !== loggedInPlayer.id && Math.abs(me - them) <= 2;
                  })
                  .map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
              </select>

              <button onClick={submitCallout} style={buttonStyle(true, false)}>Submit Call-out</button>
            </div>
            
            <div style={cardStyle()}>
  <h2 style={{ marginTop: 0 }}>Call-out History</h2>
<div style={{ marginBottom: 16 }}>
  <label style={{ marginRight: 10, fontWeight: 700 }}>
    Filter by Month:
  </label>

  <select
    value={calloutHistoryFilter}
    onChange={(e) => setCalloutHistoryFilter(e.target.value)}
    style={{
      padding: 10,
      borderRadius: 10,
      background: "#15151d",
      color: "white",
      border: "1px solid rgba(255,255,255,0.12)",
    }}
  >
    {calloutHistoryMonths.map((month) => (
      <option key={month} value={month}>
        {month === "all" ? "All Months" : month}
      </option>
    ))}
  </select>
</div>
  {completedCallouts.length === 0 &&
  pendingCallouts.length === 0 &&
  acceptedCallouts.length === 0 ? (
    <div style={{ color: "#d6caef" }}>No call-outs yet.</div>
  ) : (
    <div style={{ display: "grid", gap: 18 }}>
      {[
  { key: "pending", title: "⏳ Pending Call-outs", items: pendingCallouts },
  { key: "accepted", title: "⚔️ Accepted / Still To Be Played", items: acceptedCallouts },
  { key: "completed", title: "🏆 Completed Call-out History", items: filteredCompletedCallouts },
].map((section) => (
        <div key={section.title}>
          <h3
  onClick={() =>
    setOpenCalloutSections((prev) => ({
      ...prev,
      [section.key]: !prev[section.key],
    }))
  }
  style={{
    marginBottom: 10,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <span>{section.title} ({section.items.length})</span>
  <span>{openCalloutSections[section.key] ? "▲" : "▼"}</span>
</h3>

          {openCalloutSections[section.key] ? (
  <div style={{ display: "grid", gap: 12 }}>
            {section.items.length === 0 ? (
              <div style={{ color: "#a9a0bd" }}>None</div>
            ) : (
              section.items.map((c) => {
                const challenger = players.find((p) => p.id === c.challengerId);
                const challenged = players.find((p) => p.id === c.challengedId);
                const canEnterResult =
                  c.status === "accepted" &&
                  !c.confirmed &&
                  (loggedInPlayer?.id === c.challengerId ||
                    loggedInPlayer?.id === c.challengedId ||
                    canAdmin);

                return (
                  <div key={c.id} style={{ padding: 12, borderRadius: 14, background: "rgba(0,0,0,0.18)" }}>
                    <div style={{ fontWeight: 800 }}>
                      {challenger?.name} vs {challenged?.name}
                    </div>

                    <div style={{ color: "#d6caef", marginTop: 4 }}>
                      Score: {c.scoreA || "-"} - {c.scoreB || "-"}
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <span style={badgeStyle()}>
                        {c.status === "forfeit" ? "Forfeit" : c.confirmed ? "Confirmed" : c.status === "accepted" ? "Accepted" : "Pending"}
                      </span>
                    </div>

                    {canAdmin && !c.confirmed && c.status !== "forfeit" ? (
                      <button
                        type="button"
                        onClick={() => deleteCallout(c.id)}
                        style={{
                          ...buttonStyle(false, false),
                          background: "rgba(239,68,68,0.22)",
                          marginTop: 10,
                        }}
                      >
                        {c.status === "accepted" ? "Delete Accepted Call-out" : "Delete Pending Call-out"}
                      </button>
                    ) : null}

                    {canEnterResult ? (
                      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <input
                            type="number"
                            placeholder={`${challenger?.name} score`}
                            value={c.scoreA || ""}
                            onChange={(e) =>
                              updateState((prev) => ({
                                ...prev,
                                callouts: prev.callouts.map((item) =>
                                  item.id === c.id ? { ...item, scoreA: e.target.value } : item
                                ),
                              }))
                            }
                            style={inputStyle(false)}
                          />

                          <input
                            type="number"
                            placeholder={`${challenged?.name} score`}
                            value={c.scoreB || ""}
                            onChange={(e) =>
                              updateState((prev) => ({
                                ...prev,
                                callouts: prev.callouts.map((item) =>
                                  item.id === c.id ? { ...item, scoreB: e.target.value } : item
                                ),
                              }))
                            }
                            style={inputStyle(false)}
                          />
                        </div>

                        <button onClick={() => confirmCallout(c.id)} style={buttonStyle(true, false)}>
                          Confirm Result
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
          ) : null}
        </div>
      ))}
    </div>
  )}
</div>
  </div>
)}    

        {tab === "tournament" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Tournament Setup</h2>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 180px auto auto auto", gap: 12, alignItems: "end" }}>
                <div>
                  <div style={{ marginBottom: 8 }}>Tournament Title</div>
                  <input value={tournament.title} onChange={(e) => updateState((prev) => ({ ...prev, tournament: { ...prev.tournament, title: e.target.value } }))} style={inputStyle(!canAdmin)} disabled={!canAdmin} />
                </div>

                <div>
                  <div style={{ marginBottom: 8 }}>Format</div>
                  <select value={tournament.format} onChange={(e) => updateState((prev) => ({ ...prev, tournament: { ...prev.tournament, format: e.target.value, teams: [], teamDraft: { name: "", memberIds: [] } } }))} style={inputStyle(!canAdmin)} disabled={!canAdmin}>
                     <option value="1v1">1v1</option>
  <option value="2v2">2v2</option>
  <option value="3v3">3v3</option>
  <option value="4v4">4v4</option>
                  </select>
                </div>

                <button onClick={generateTournament} style={buttonStyle(true, !canAdmin || tournament.teams.length < 2)} disabled={!canAdmin || tournament.teams.length < 2}>Generate Bracket</button>
                <button onClick={advanceBracket} style={buttonStyle(false, !canAdmin)} disabled={!canAdmin}>Advance Bracket</button>
                <button onClick={finalizeChampion} style={buttonStyle(false, !canAdmin)} disabled={!canAdmin}>Finalize Champion</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.8fr 1.2fr", gap: 16 }}>
              <div style={cardStyle()}>
                <h2 style={{ marginTop: 0 }}>Manual Team Builder</h2>

                <input
                  placeholder="Team name"
                  value={tournament.teamDraft.name}
                  onChange={(e) => updateState((prev) => ({ ...prev, tournament: { ...prev.tournament, teamDraft: { ...prev.tournament.teamDraft, name: e.target.value } } }))}
                  style={{ ...inputStyle(!canAdmin), marginBottom: 12 }}
                  disabled={!canAdmin}
                />

                <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                  {players.map((p) => {
                    const selected = tournament.teamDraft.memberIds.includes(p.id);
                    return (
                      <button key={p.id} onClick={() => toggleDraftMember(p.id)} style={buttonStyle(selected, !canAdmin)} disabled={!canAdmin}>
                        {p.name}
                      </button>
                    );
                  })}
                </div>

                <button onClick={createManualTeam} style={buttonStyle(true, !canAdmin)} disabled={!canAdmin}>Create Team</button>

                <h3>Teams</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {tournament.teams.map((team) => (
                    <div key={team.id} style={{ padding: 12, borderRadius: 14, background: "rgba(0,0,0,0.18)", display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div>{getTeamName(team)}</div>
                      {canAdmin ? <button onClick={() => deleteTeam(team.id)} style={buttonStyle(false, false)}><Trash2 size={14} /></button> : null}
                    </div>
                  ))}
                </div>
              </div>

              <div style={cardStyle()}>
                <h2 style={{ marginTop: 0 }}>Match Management</h2>

                <div style={{ display: "grid", gap: 14 }}>
                  {[...tournament.activeWinners, ...tournament.activeRedemption, ...(tournament.grandFinal ? [tournament.grandFinal] : [])].map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "bracket" && (
          <div style={{ display: "grid", gap: 18 }}>
    <VisualBracketBoardV3 />
    <div style={cardStyle()}>
      <h2 style={{ marginTop: 0 }}>Completed Rounds</h2>
                         {tournament.completedRounds.length === 0 ? (
                <div style={{ color: "#d6caef" }}>No completed rounds yet.</div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {tournament.completedRounds.map((match) => (
                    <div key={match.id} style={{ padding: 12, borderRadius: 14, background: "rgba(0,0,0,0.18)" }}>
                      {getTeamName(findTeam(match.teamAId))} vs {getTeamName(findTeam(match.teamBId))} — {match.scoreA}-{match.scoreB}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "hall" && (
          <div style={cardStyle()}>
            <h2 style={{ marginTop: 0 }}>Hall of Fame</h2>
            {state.hallOfFame.length === 0 ? (
              <div style={{ color: "#d6caef" }}>No champions recorded yet.</div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {state.hallOfFame.map((h) => (
                  <div key={h.id} style={{ padding: 14, borderRadius: 16, background: "rgba(0,0,0,0.18)" }}>
                    <div style={{ fontWeight: 900 }}>{h.championName}</div>
                    <div style={{ color: "#d6caef", marginTop: 4 }}>{h.tournamentTitle} • {h.createdAt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "sunday" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.95fr 1.05fr", gap: 16 }}>
            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Sunday Point Match Calculator</h2>
              <div style={{ color: "#d6caef", marginBottom: 12 }}>
                Best KD is awarded to only one player in the whole match.
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <select value={sundayEntry.mode} onChange={(e) => setSundayEntry({ ...sundayEntry, mode: e.target.value })} style={inputStyle(!canAdmin)} disabled={!canAdmin}>
                  <option>Hardpoint</option>
                  <option>SND</option>
                  <option>Overload</option>
                </select>

                <input placeholder="Map / Match Name" value={sundayEntry.mapName} onChange={(e) => setSundayEntry({ ...sundayEntry, mapName: e.target.value })} style={inputStyle(!canAdmin)} disabled={!canAdmin} />
                <input placeholder="Score Summary" value={sundayEntry.scoreText} onChange={(e) => setSundayEntry({ ...sundayEntry, scoreText: e.target.value })} style={inputStyle(!canAdmin)} disabled={!canAdmin} />

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                  <div>
                    <h4>Winning Team</h4>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <select key={`w-${index}`} value={sundayEntry.winningTeamIds[index] || ""} onChange={(e) => {
                        const next = [...sundayEntry.winningTeamIds];
                        next[index] = Number(e.target.value);
                        setSundayEntry({ ...sundayEntry, winningTeamIds: next.filter(Boolean) });
                      }} style={{ ...inputStyle(!canAdmin), marginBottom: 8 }} disabled={!canAdmin}>
                        <option value="">Select player</option>
                        {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    ))}
                  </div>

                  <div>
                    <h4>Losing Team</h4>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <select key={`l-${index}`} value={sundayEntry.losingTeamIds[index] || ""} onChange={(e) => {
                        const next = [...sundayEntry.losingTeamIds];
                        next[index] = Number(e.target.value);
                        setSundayEntry({ ...sundayEntry, losingTeamIds: next.filter(Boolean) });
                      }} style={{ ...inputStyle(!canAdmin), marginBottom: 8 }} disabled={!canAdmin}>
                        <option value="">Select player</option>
                        {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    ))}
                  </div>
                </div>

                {[
                  ["Winning MVP", "winningMvpId"],
                  ["Losing MVP", "losingMvpId"],
                  ["Highest Objective", "objectiveLeaderId"],
                  ["Best KD Overall", "bestKdId"],
                  ["0 Deaths", "zeroDeathId"],
                ].map(([label, field]) => (
                  <select key={field} value={sundayEntry[field]} onChange={(e) => setSundayEntry({ ...sundayEntry, [field]: e.target.value })} style={inputStyle(!canAdmin)} disabled={!canAdmin}>
                    <option value="">{label}</option>
                    {(
  field === "winningMvpId"
    ? sundayWinningPlayers
    : field === "losingMvpId"
    ? sundayLosingPlayers
    : sundayPlayingPlayers
).map((p) => (
  <option key={p.id} value={p.id}>
    {p.name}
  </option>
))}
                  </select>
                ))}
<div
  style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>
  <div>
    <h4 style={{ marginTop: 0, color: "#86efac" }}>
      🏆 Winning Team Extra Players
    </h4>

    <div style={{ color: "#d6caef", fontSize: 13, marginBottom: 10 }}>
      Each selected player receives +10 points.
    </div>

    <div style={{ display: "grid", gap: 8 }}>
      {players
        .filter(
          (player) =>
            !(sundayEntry.winningTeamIds || [])
              .map(Number)
              .includes(Number(player.id)) &&
            !(sundayEntry.losingTeamIds || [])
              .map(Number)
              .includes(Number(player.id))
        )
        .map((player) => (
          <label
            key={`winning-sub-${player.id}`}
            style={{
              padding: 9,
              borderRadius: 10,
              background: (sundayEntry.winningSubstituteIds || [])
                .map(Number)
                .includes(Number(player.id))
                ? "rgba(34,197,94,0.20)"
                : "rgba(0,0,0,0.18)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={(sundayEntry.winningSubstituteIds || [])
                .map(Number)
                .includes(Number(player.id))}
              onChange={() =>
                toggleSundaySubstitute("winning", player.id)
              }
              disabled={!canAdmin}
              style={{ marginRight: 8 }}
            />

            {player.name}
          </label>
        ))}
    </div>
  </div>

  <div>
    <h4 style={{ marginTop: 0, color: "#fca5a5" }}>
      💀 Losing Team Extra Players
    </h4>

    <div style={{ color: "#d6caef", fontSize: 13, marginBottom: 10 }}>
      Each selected player receives -5 points.
    </div>

    <div style={{ display: "grid", gap: 8 }}>
      {players
        .filter(
          (player) =>
            !(sundayEntry.winningTeamIds || [])
              .map(Number)
              .includes(Number(player.id)) &&
            !(sundayEntry.losingTeamIds || [])
              .map(Number)
              .includes(Number(player.id))
        )
        .map((player) => (
          <label
            key={`losing-sub-${player.id}`}
            style={{
              padding: 9,
              borderRadius: 10,
              background: (sundayEntry.losingSubstituteIds || [])
                .map(Number)
                .includes(Number(player.id))
                ? "rgba(239,68,68,0.18)"
                : "rgba(0,0,0,0.18)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={(sundayEntry.losingSubstituteIds || [])
                .map(Number)
                .includes(Number(player.id))}
              onChange={() =>
                toggleSundaySubstitute("losing", player.id)
              }
              disabled={!canAdmin}
              style={{ marginRight: 8 }}
            />

            {player.name}
          </label>
        ))}
    </div>
  </div>
</div>
                <label>
                  <input type="checkbox" checked={sundayEntry.flawless} onChange={(e) => setSundayEntry({ ...sundayEntry, flawless: e.target.checked })} disabled={!canAdmin} /> Flawless victory bonus
                </label>
               
<div
  style={{
    ...cardStyle(),
    marginTop: 18,
    marginBottom: 18,
    background: "rgba(124,58,237,0.10)",
  }}
>
  <h3 style={{ marginTop: 0 }}>🎲 Sunday Team Generator</h3>

  <div style={{ color: "#d6caef", marginBottom: 12 }}>
    Select attending players, choose number of teams, then generate CR-balanced teams.
  </div>

  <label style={{ display: "block", marginBottom: 10 }}>
    Number of Teams
    <select
      value={sundayTeamCount}
      onChange={(e) => setSundayTeamCount(Number(e.target.value))}
      style={{ ...inputStyle(false), marginTop: 6 }}
    >
      <option value={2}>2 Teams</option>
      <option value={3}>3 Teams</option>
      <option value={4}>4 Teams</option>
    </select>
  </label>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
      gap: 8,
      marginTop: 12,
    }}
  >
    {players.map((player) => (
      <label
        key={player.id}
        style={{
          padding: 10,
          borderRadius: 12,
          background: sundaySelectedPlayers.includes(player.id)
            ? "rgba(168,85,247,0.28)"
            : "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={sundaySelectedPlayers.includes(player.id)}
          onChange={() => toggleSundayPlayer(player.id)}
          style={{ marginRight: 8 }}
        />
        {player.name} • CR {getCompetitiveScore(player)}
      </label>
    ))}
  </div>

  <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
    <button
      type="button"
      onClick={generateSundayTeams}
      style={buttonStyle(true, !canAdmin)}
      disabled={!canAdmin}
    >
      🎲 Generate CR Teams
    </button>

    <button
      type="button"
      onClick={() => {
        setSundaySelectedPlayers([]);
        setSundayTeams([]);
      }}
      style={buttonStyle(false, false)}
    >
      Clear
    </button>
  </div>

  {sundayTeams.length > 0 && (
    <div style={{ marginTop: 18 }}>
      <h3>Generated Teams</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : `repeat(${sundayTeams.length}, 1fr)`,
          gap: 12,
        }}
      >
        {sundayTeams.map((team, index) => (
          <div
            key={team.name}
            style={{
              padding: 14,
              borderRadius: 16,
              background: "rgba(0,0,0,0.20)",
              border: "1px solid rgba(168,85,247,0.25)",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>
              {team.name}
            </div>

            <div style={{ color: "#facc15", fontWeight: 800, marginBottom: 8 }}>
              Total CR: {team.totalCR}
            </div>

            {team.players.map((player) => (
              <div key={player.id} style={{ marginBottom: 6 }}>
                🎮 {player.name} • CR {getCompetitiveScore(player)}
              </div>
            ))}
            
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
  <button
    type="button"
    onClick={() => applyGeneratedSundayTeam("winning", index)}
    style={buttonStyle(true, false)}
  >
    🏆 Set Winner
  </button>

  <button
    type="button"
    onClick={() => applyGeneratedSundayTeam("losing", index)}
    style={buttonStyle(false, false)}
  >
    💀 Set Loser
  </button>
</div>
          </div>
        ))}
      </div>
    </div>
  )}
  {sundayTeams.length > 0 && (
  <div
    style={{
      display: "flex",
      gap: 10,
      marginTop: 16,
      flexWrap: "wrap",
      justifyContent: "center",
    }}
  >
    <button
      type="button"
      onClick={lockSundayTeams}
      style={buttonStyle(true, false)}
    >
      🔒 Lock Teams For Today
    </button>

    <button
      type="button"
      onClick={clearLockedSundayTeams}
      style={buttonStyle(false, false)}
    >
      🧹 Clear Locked Teams
    </button>
  </div>
)}
</div>
{sundayTeams.length > 0 && (
  <div
    style={{
      ...cardStyle(),
      marginTop: 18,
      background: "rgba(0,0,0,0.18)",
    }}
  >
    <h3 style={{ marginTop: 0 }}>🎮 Sunday Round Manager</h3>

    <div style={{ color: "#d6caef", marginBottom: 12 }}>
      Create each round from the locked teams. This saves the Sunday match flow.
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
        gap: 10,
      }}
    >
      <input
        value={sundayRoundDraft.roundName}
        onChange={(e) =>
          setSundayRoundDraft({
            ...sundayRoundDraft,
            roundName: e.target.value,
          })
        }
        style={inputStyle(false)}
        placeholder="Round name"
      />

      <select
        value={sundayRoundDraft.teamAIndex}
        onChange={(e) =>
          setSundayRoundDraft({
            ...sundayRoundDraft,
            teamAIndex: e.target.value,
          })
        }
        style={inputStyle(false)}
      >
        <option value="">Team A</option>
        {sundayTeams.map((team, index) => (
          <option key={team.name} value={index}>
            {team.name}
          </option>
        ))}
      </select>

      <select
        value={sundayRoundDraft.teamBIndex}
        onChange={(e) =>
          setSundayRoundDraft({
            ...sundayRoundDraft,
            teamBIndex: e.target.value,
          })
        }
        style={inputStyle(false)}
      >
        <option value="">Team B</option>
        {sundayTeams.map((team, index) => (
          <option key={team.name} value={index}>
            {team.name}
          </option>
        ))}
      </select>

      <select
        value={sundayRoundDraft.winnerIndex}
        onChange={(e) =>
          setSundayRoundDraft({
            ...sundayRoundDraft,
            winnerIndex: e.target.value,
          })
        }
        style={inputStyle(false)}
      >
        <option value="">Winner optional</option>
        {sundayTeams.map((team, index) => (
          <option key={team.name} value={index}>
            {team.name}
          </option>
        ))}
      </select>
    </div>

    <button
      type="button"
      onClick={createSundayRound}
      style={{ ...buttonStyle(true, false), marginTop: 12 }}
    >
      ➕ Save Round
    </button>

    {sundayRounds.length > 0 && (
      <div style={{ marginTop: 18 }}>
        <h3>Saved Sunday Rounds</h3>

        {sundayRounds.map((round) => {
          const teamA = sundayTeams[round.teamAIndex];
          const teamB = sundayTeams[round.teamBIndex];
          const winner =
            round.winnerIndex === "" ? null : sundayTeams[round.winnerIndex];

          return (
            <div
              key={round.id}
              style={{
                padding: 12,
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 900 }}>
                {round.roundName}
              </div>

              <div style={{ color: "#d6caef", marginTop: 4 }}>
                {teamA?.name || "Team A"} vs {teamB?.name || "Team B"}
              </div>

              {winner && (
                <div style={{ color: "#facc15", marginTop: 4, fontWeight: 800 }}>
                  🏆 Winner: {winner.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
)}
                <button onClick={applySundayPoints} style={buttonStyle(true, !canAdmin)} disabled={!canAdmin}>Apply Sunday Points</button>
              </div>
              </div>
            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Sunday Match History</h2>
              {state.sundayHistory.length === 0 ? (
                <div style={{ color: "#d6caef" }}>No Sunday submissions yet.</div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {state.sundayHistory.map((entry) => (
                    <div key={entry.id} style={{ padding: 14, borderRadius: 16, background: "rgba(0,0,0,0.18)" }}>
                      <div style={{ fontWeight: 800 }}>{entry.mapName || entry.mode}</div>
                      <div style={{ color: "#d6caef", fontSize: 13 }}>Mode: {entry.mode} • Score: {entry.scoreText || "-"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "recommendations" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.9fr 1.4fr", gap: 16 }}>
            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Recommendations</h2>
              <div style={{ color: "#d6caef", marginBottom: 14 }}>
                Tell the clan what we should upgrade next on the app.
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <input
                  value={recommendationDraft.title}
                  onChange={(e) => setRecommendationDraft((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Recommendation title"
                  style={inputStyle(false)}
                />

                <select
                  value={recommendationDraft.category}
                  onChange={(e) => setRecommendationDraft((prev) => ({ ...prev, category: e.target.value }))}
                  style={inputStyle(false)}
                >
                  {["General", "Callouts", "Tournament", "Leaderboard", "UI", "Rewards", "Ranked", "Bugs", "Discord"].map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <textarea
                  value={recommendationDraft.description}
                  onChange={(e) => setRecommendationDraft((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Explain your idea..."
                  rows={5}
                  style={{ ...inputStyle(false), resize: "vertical" }}
                />

                <button type="button" onClick={submitRecommendation} style={buttonStyle(true, false)}>
                  <Plus size={14} /> Submit Recommendation
                </button>
              </div>
            </div>

            <div style={cardStyle()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                <h2 style={{ margin: 0 }}>Community Roadmap</h2>
                <span style={badgeStyle()}>{(state.recommendations || []).length} ideas</span>
              </div>

              {sortedRecommendations.length === 0 ? (
                <div style={{ color: "#d6caef" }}>No recommendations yet. Be the first to suggest an upgrade.</div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {sortedRecommendations.map((item) => {
                    const hasVoted = (item.votedBy || []).includes(loggedInPlayer?.id);
                    const statusColor =
                      item.status === "Completed"
                        ? ["rgba(34,197,94,0.18)", "#86efac"]
                        : item.status === "In Progress"
                        ? ["rgba(59,130,246,0.18)", "#93c5fd"]
                        : item.status === "Planned"
                        ? ["rgba(250,204,21,0.18)", "#fde68a"]
                        : item.status === "Rejected"
                        ? ["rgba(239,68,68,0.18)", "#fca5a5"]
                        : ["rgba(255,255,255,0.08)", "white"];

                    return (
                      <div key={item.id} style={{ padding: 14, borderRadius: 16, background: "rgba(0,0,0,0.18)", border: item.pinned ? "1px solid rgba(250,204,21,0.55)" : "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                          <div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                              {item.pinned ? <span style={badgeStyle("rgba(250,204,21,0.18)", "#fde68a")}>Pinned</span> : null}
                              <span style={badgeStyle()}>{item.category}</span>
                              <span style={badgeStyle(statusColor[0], statusColor[1])}>{item.status || "New"}</span>
                            </div>

                            <div style={{ fontSize: 18, fontWeight: 900, marginTop: 8 }}>{item.title}</div>
                            {item.description ? (
                              <div style={{ color: "#d6caef", marginTop: 6, lineHeight: 1.45 }}>{item.description}</div>
                            ) : null}
                            <div style={{ color: "#9d90b7", fontSize: 12, marginTop: 8 }}>
                              Submitted by {item.createdByName || "Unknown"} • {item.createdAt || "No date"}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleRecommendationVote(item.id)}
                            style={{
                              ...buttonStyle(hasVoted, false),
                              minWidth: 104,
                            }}
                          >
                            👍 {Number(item.votes || 0)}
                          </button>
                        </div>

                        {canAdmin ? (
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                            {["New", "Planned", "In Progress", "Completed", "Rejected"].map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => updateRecommendationStatus(item.id, status)}
                                style={buttonStyle(item.status === status, false)}
                              >
                                {status}
                              </button>
                            ))}

                            <button type="button" onClick={() => toggleRecommendationPinned(item.id)} style={buttonStyle(item.pinned, false)}>
                              {item.pinned ? "Unpin" : "Pin"}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Delete this recommendation?")) deleteRecommendation(item.id);
                              }}
                              style={{ ...buttonStyle(false, false), background: "rgba(239,68,68,0.22)" }}
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "vote" && (
          <div style={cardStyle()}>
            <h2 style={{ marginTop: 0 }}>{state.poll.question}</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {state.poll.options.map((option) => (
                <div key={option.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, borderRadius: 16, background: "rgba(0,0,0,0.18)", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ fontWeight: 700 }}>{option.label}</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={badgeStyle()}>{option.votes} votes</span>
                    <button onClick={() => vote(option.id)} style={buttonStyle(true, false)}>Vote</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
            </div>
                  {weeklyAwardDraft.playerId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div style={{ ...cardStyle(), maxWidth: 460, width: "100%" }}>
            <h2 style={{ marginTop: 0 }}>🏆 Weekly Challenge Completed</h2>
            <div
  style={{
    padding: 12,
    marginBottom: 14,
    borderRadius: 14,
    background: "rgba(168,85,247,0.12)",
    border: "1px solid rgba(168,85,247,0.24)",
  }}
>
  <div
    style={{
      color: "#a99cbe",
      fontSize: 11,
      fontWeight: 800,
      marginBottom: 4,
    }}
  >
    AWARDING PLAYER
  </div>

  <div
    style={{
      color: "white",
      fontSize: 18,
      fontWeight: 900,
    }}
  >
    {players.find(
      (player) =>
        Number(player.id) ===
        Number(weeklyAwardDraft.playerId)
    )?.name || "Unknown Player"}
  </div>
</div>

            <label>
              CR Reward
              <input
  type="number"
  min="1"
  step="1"
  inputMode="numeric"
  value={weeklyAwardDraft.amount}
  onChange={(e) =>
    setWeeklyAwardDraft({
      ...weeklyAwardDraft,
      amount: e.target.value,
    })
  }
  placeholder="Enter CR reward"
  style={inputStyle(false)}
/>
            </label>

            <label>
              Reason
              <input
                value={weeklyAwardDraft.reason}
                onChange={(e) =>
                  setWeeklyAwardDraft({
                    ...weeklyAwardDraft,
                    reason: e.target.value,
                  })
                }
                placeholder="Example: Weekly AR challenge completed"
                style={inputStyle(false)}
              />
            </label>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button type="button" onClick={awardWeeklyChallenge} style={buttonStyle(true, false)}>
                Award
              </button>

              <button
                type="button"
                onClick={() =>
                  setWeeklyAwardDraft({
                    playerId: "",
                    amount: 10,
                    reason: "",
                  })
                }
                style={buttonStyle(false, false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}