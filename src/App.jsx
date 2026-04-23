import { useEffect, useMemo, useState } from "react";
import {
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
} from "lucide-react";

const STORAGE_KEY = "shadowborn-za-v7";
const AUTH_KEY = "shadowborn-za-player-auth-v3";
const DEFAULT_LOGO = "/shadowborn-za-logo.jpg";

const PLAYER_PINS = {
  "The Fudgeman": "4182",
  Bulletstorm: "1457",
  Thirdstriker: "3319",
  Toxicmuffin: "8842",
  Stifler: "5206",
  Dreamzz: "2784",
  Botzzy: "6413",
  Gallie: "7095",
  Jeanre: "1946",
  STG: "8361",
  Dwain: "4728",
  DancyRaptor: "6159",
  Dennis: "9034",
  UncleCyril: "2871",
  Nico: "5540",
  AJ: "7622",
  Jaundre: "3185",
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
  teamDraft: {
    name: "",
    memberIds: [],
  },
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
  poll: {
    question: "What should we play next?",
    options: [
      { id: 1, label: "1v1 Tournament", votes: 0 },
      { id: 2, label: "2v2 Tournament", votes: 0 },
      { id: 3, label: "4v4 Tournament", votes: 0 },
      { id: 4, label: "Sunday Point Match", votes: 0 },
    ],
  },
  tournament: emptyTournament,
  sundayHistory: [],
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  } catch {
    return defaultState;
  }
}

function loadAuth() {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function getTeamSize(format) {
  if (format === "1v1") return 1;
  if (format === "2v2") return 2;
  return 4;
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
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 22,
    padding: 16,
    boxShadow: "0 14px 34px rgba(0,0,0,0.26)",
  };
}

function inputStyle(disabled = false) {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #3b2a57",
    background: disabled ? "#1b122c" : "#140c24",
    color: disabled ? "#9d90b7" : "white",
    boxSizing: "border-box",
    opacity: disabled ? 0.7 : 1,
  };
}

function buttonStyle(active = false, disabled = false) {
  return {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: disabled
      ? "rgba(255,255,255,0.04)"
      : active
      ? "linear-gradient(135deg, #7c3aed, #a855f7)"
      : "rgba(255,255,255,0.06)",
    color: disabled ? "#9d90b7" : "white",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 700,
    opacity: disabled ? 0.7 : 1,
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

function pairTeams(teamIds, bracket, stage) {
  const ids = [...teamIds];
  const matches = [];
  let carry = null;

  if (ids.length % 2 === 1) {
    carry = ids.pop();
  }

  for (let i = 0; i < ids.length; i += 2) {
    matches.push({
      id: `${bracket}-${stage}-${i / 2 + 1}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      bracket,
      stage,
      label:
        bracket === "W"
          ? `Winners Round ${stage}`
          : bracket === "L"
          ? `Redemption Round ${stage}`
          : "Grand Final",
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

export default function App() {
  const [state, setState] = useState(loadState);
  const [auth, setAuth] = useState(loadAuth);
  const [tab, setTab] = useState("dashboard");
  const [pin, setPin] = useState("");
  const [selectedLoginPlayerId, setSelectedLoginPlayerId] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const [newPlayer, setNewPlayer] = useState({
    name: "",
    emblem: "",
    points: 0,
    tournamentWins: 0,
    avatar: "",
    role: "player",
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
    flawless: false,
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (auth) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [auth]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const players = state.players;
  const tournament = state.tournament;
  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name)),
    [players]
  );

  const loggedInPlayer = auth ? players.find((p) => p.id === auth.playerId) : null;
  const canAdmin =
    loggedInPlayer &&
    (loggedInPlayer.role === "leader" || loggedInPlayer.role === "co-leader");

  function updateState(updater) {
    setState((prev) => (typeof updater === "function" ? updater(prev) : updater));
  }

  function loginWithPin() {
    const chosen = players.find((p) => p.id === Number(selectedLoginPlayerId));
    if (!chosen) {
      setLoginError("Please select your player name.");
      return;
    }

    const expectedPin = PLAYER_PINS[chosen.name];
    if (!expectedPin) {
      setLoginError("No PIN found for this player.");
      return;
    }

    if (pin !== expectedPin) {
      setLoginError("Incorrect PIN.");
      return;
    }

    setAuth({
      playerId: chosen.id,
      playerName: chosen.name,
      role: chosen.role,
    });
    setPin("");
    setLoginError("");
  }

  function logout() {
    setAuth(null);
    setPin("");
    setSelectedLoginPlayerId("");
    setLoginError("");
  }

  function updatePlayer(id, field, value) {
    updateState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]: ["points", "tournamentWins", "wins", "losses", "mvpPoints", "activityPoints"].includes(field)
                ? Number(value) || 0
                : value,
            }
          : p
      ),
    }));
  }

  function addPlayer() {
    if (!canAdmin || !newPlayer.name.trim()) return;

    updateState((prev) => ({
      ...prev,
      players: [
        ...prev.players,
        {
          id: Date.now(),
          name: newPlayer.name.trim(),
          emblem: newPlayer.emblem || newPlayer.name.trim().slice(0, 2).toUpperCase(),
          points: Number(newPlayer.points) || 0,
          tournamentWins: Number(newPlayer.tournamentWins) || 0,
          wins: 0,
          losses: 0,
          mvpPoints: 0,
          activityPoints: 0,
          avatar: newPlayer.avatar || "",
          role: newPlayer.role,
        },
      ],
    }));

    setNewPlayer({
      name: "",
      emblem: "",
      points: 0,
      tournamentWins: 0,
      avatar: "",
      role: "player",
    });
  }

  function setTournamentField(field, value) {
    if (!canAdmin) return;
    updateState((prev) => ({
      ...prev,
      tournament: {
        ...prev.tournament,
        [field]: value,
      },
    }));
  }

  function setTeamDraftField(field, value) {
    if (!canAdmin) return;
    updateState((prev) => ({
      ...prev,
      tournament: {
        ...prev.tournament,
        teamDraft: {
          ...prev.tournament.teamDraft,
          [field]: value,
        },
      },
    }));
  }

  function usedPlayerIdsExcludingCurrentTeams(teams) {
    const ids = new Set();
    teams.forEach((team) => {
      team.members.forEach((id) => ids.add(id));
    });
    return ids;
  }

  const usedIds = usedPlayerIdsExcludingCurrentTeams(tournament.teams);
  const draftTeamSize = getTeamSize(tournament.format);

  function setDraftMember(slot, playerId) {
    if (!canAdmin) return;

    updateState((prev) => {
      const nextMembers = [...prev.tournament.teamDraft.memberIds];
      nextMembers[slot] = playerId ? Number(playerId) : null;

      return {
        ...prev,
        tournament: {
          ...prev.tournament,
          teamDraft: {
            ...prev.tournament.teamDraft,
            memberIds: nextMembers,
          },
        },
      };
    });
  }

  function addTeamToTournament() {
    if (!canAdmin) return;

    const teamSize = getTeamSize(tournament.format);
    const cleanMembers = tournament.teamDraft.memberIds.filter(Boolean);

    if (cleanMembers.length !== teamSize) return;
    if (new Set(cleanMembers).size !== cleanMembers.length) return;
    if (cleanMembers.some((id) => usedIds.has(id))) return;

    const nextTeamId =
      tournament.teams.length > 0
        ? Math.max(...tournament.teams.map((t) => t.id)) + 1
        : 1;

    const draftName =
      tournament.format === "1v1"
        ? players.find((p) => p.id === cleanMembers[0])?.name || `Team ${nextTeamId}`
        : tournament.teamDraft.name.trim() || `Team ${nextTeamId}`;

    updateState((prev) => ({
      ...prev,
      tournament: {
        ...prev.tournament,
        teams: [
          ...prev.tournament.teams,
          {
            id: nextTeamId,
            name: draftName,
            members: cleanMembers,
          },
        ],
        teamDraft: {
          name: "",
          memberIds: [],
        },
      },
    }));
  }

  function removeTeam(teamId) {
    if (!canAdmin || tournament.status !== "Setup") return;
    updateState((prev) => ({
      ...prev,
      tournament: {
        ...prev.tournament,
        teams: prev.tournament.teams.filter((t) => t.id !== teamId),
      },
    }));
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
        tournament: {
          ...prev.tournament,
          activeWinners: firstRound.matches,
          activeRedemption: [],
          completedRounds: [],
          winnersCarry: firstRound.carry,
          redemptionCarry: null,
          grandFinal: null,
          championTeamId: null,
          status: "Live",
          winnersStage: 1,
          redemptionStage: 1,
        },
      };
    });
  }

  function resetTournament() {
    if (!canAdmin) return;

    updateState((prev) => ({
      ...prev,
      tournament: {
        ...emptyTournament,
        title: prev.tournament.title,
        format: prev.tournament.format,
      },
    }));
  }

  function unlockMatch(matchId) {
    if (!canAdmin) return;

    updateState((prev) => {
      const resetList = (list) =>
        list.map((m) =>
          m.id === matchId
            ? {
                ...m,
                scoreA: "",
                scoreB: "",
                submittedByTeamA: false,
                teamBConfirmed: false,
                locked: false,
                winnerId: null,
                loserId: null,
              }
            : m
        );

      return {
        ...prev,
        tournament: {
          ...prev.tournament,
          activeWinners: resetList(prev.tournament.activeWinners),
          activeRedemption: resetList(prev.tournament.activeRedemption),
          grandFinal: prev.tournament.grandFinal ? resetList(prev.tournament.grandFinal) : null,
        },
      };
    });
  }

  function updateMatchField(matchId, field, value) {
    updateState((prev) => {
      const updateList = (list) =>
        list.map((m) => {
          if (m.id !== matchId || m.locked) return m;
          if (!teamHasLoggedInPlayer(findTeam(m.teamAId))) return m;
          if (field !== "scoreA" && field !== "scoreB") return m;

          return {
            ...m,
            [field]: value,
            submittedByTeamA: false,
            teamBConfirmed: false,
            winnerId: null,
            loserId: null,
          };
        });

      return {
        ...prev,
        tournament: {
          ...prev.tournament,
          activeWinners: updateList(prev.tournament.activeWinners),
          activeRedemption: updateList(prev.tournament.activeRedemption),
          grandFinal: prev.tournament.grandFinal ? updateList(prev.tournament.grandFinal) : null,
        },
      };
    });
  }

  function submitResult(matchId) {
    updateState((prev) => {
      const updateList = (list) =>
        list.map((m) => {
          if (m.id !== matchId || m.locked) return m;
          if (!teamHasLoggedInPlayer(findTeam(m.teamAId))) return m;

          const a = Number(m.scoreA);
          const b = Number(m.scoreB);
          if (Number.isNaN(a) || Number.isNaN(b) || a === b) return m;

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
          activeWinners: updateList(prev.tournament.activeWinners),
          activeRedemption: updateList(prev.tournament.activeRedemption),
          grandFinal: prev.tournament.grandFinal ? updateList(prev.tournament.grandFinal) : null,
        },
      };
    });
  }

  function confirmResult(matchId) {
    updateState((prev) => {
      const confirmList = (list) =>
        list.map((m) => {
          if (m.id !== matchId || m.locked) return m;
          if (!teamHasLoggedInPlayer(findTeam(m.teamBId))) return m;
          if (!m.submittedByTeamA) return m;

          const a = Number(m.scoreA);
          const b = Number(m.scoreB);
          if (Number.isNaN(a) || Number.isNaN(b) || a === b) return m;

          return {
            ...m,
            teamBConfirmed: true,
            locked: true,
            winnerId: a > b ? m.teamAId : m.teamBId,
            loserId: a > b ? m.teamBId : m.teamAId,
          };
        });

      const nextTournament = {
        ...prev.tournament,
        activeWinners: confirmList(prev.tournament.activeWinners),
        activeRedemption: confirmList(prev.tournament.activeRedemption),
        grandFinal: prev.tournament.grandFinal ? confirmList(prev.tournament.grandFinal) : null,
      };

      return {
        ...prev,
        tournament: advanceTournament(nextTournament),
      };
    });
  }

  function advanceTournament(t) {
    if (t.championTeamId) return t;

    if (t.grandFinal && allLocked(t.grandFinal)) {
      const gf = t.grandFinal[0];
      if (gf?.winnerId) {
        return {
          ...t,
          completedRounds: [...t.completedRounds, { name: "Grand Final", bracket: "GF", matches: t.grandFinal }],
          grandFinal: null,
          championTeamId: gf.winnerId,
          status: "Finished",
        };
      }
    }

    if (!allLocked(t.activeWinners) || !allLocked(t.activeRedemption)) {
      return t;
    }

    const undefeatedAdvancers = [
      ...(t.winnersCarry ? [t.winnersCarry] : []),
      ...getOfficialWinners(t.activeWinners),
    ];

    const droppedFromWinners = getOfficialLosers(t.activeWinners);

    const redemptionAdvancers = [
      ...(t.redemptionCarry ? [t.redemptionCarry] : []),
      ...getOfficialWinners(t.activeRedemption),
    ];

    const nextRedemptionPool = [...redemptionAdvancers, ...droppedFromWinners];

    const archived = [
      ...t.completedRounds,
      ...(t.activeWinners.length ? [{ name: `Winners Round ${t.winnersStage}`, bracket: "W", matches: t.activeWinners }] : []),
      ...(t.activeRedemption.length ? [{ name: `Redemption Round ${t.redemptionStage}`, bracket: "L", matches: t.activeRedemption }] : []),
    ];

    if (undefeatedAdvancers.length === 1 && nextRedemptionPool.length === 0) {
      return {
        ...t,
        completedRounds: archived,
        activeWinners: [],
        activeRedemption: [],
        winnersCarry: null,
        redemptionCarry: null,
        championTeamId: undefeatedAdvancers[0],
        status: "Finished",
      };
    }

    if (undefeatedAdvancers.length === 1 && nextRedemptionPool.length === 1) {
      const gf = pairTeams([undefeatedAdvancers[0], nextRedemptionPool[0]], "GF", 1);

      return {
        ...t,
        completedRounds: archived,
        activeWinners: [],
        activeRedemption: [],
        winnersCarry: null,
        redemptionCarry: null,
        grandFinal: gf.matches,
        status: "Grand Final",
      };
    }

    const nextWStage = t.winnersStage + 1;
    const nextLStage = t.redemptionStage + 1;

    const newW =
      undefeatedAdvancers.length > 1
        ? pairTeams(undefeatedAdvancers, "W", nextWStage)
        : { matches: [], carry: undefeatedAdvancers[0] || null };

    const newL =
      nextRedemptionPool.length > 1
        ? pairTeams(nextRedemptionPool, "L", nextLStage)
        : { matches: [], carry: nextRedemptionPool[0] || null };

    return {
      ...t,
      completedRounds: archived,
      activeWinners: newW.matches,
      activeRedemption: newL.matches,
      winnersCarry: newW.carry,
      redemptionCarry: newL.carry,
      winnersStage: nextWStage,
      redemptionStage: nextLStage,
      status: "Live",
    };
  }

  function applySundayPoints() {
    if (!canAdmin) return;

    const winnerSet = new Set(sundayEntry.winningTeamIds.map(Number));
    const loserSet = new Set(sundayEntry.losingTeamIds.map(Number));
    if (!winnerSet.size || !loserSet.size) return;

    updateState((prev) => {
      const updatedPlayers = prev.players.map((p) => {
        let points = p.points;
        let wins = p.wins;
        let losses = p.losses;
        let mvpPoints = p.mvpPoints;
        let activityPoints = p.activityPoints;

        if (winnerSet.has(p.id)) {
          points += 10;
          wins += 1;
          activityPoints += 1;
        }

        if (loserSet.has(p.id)) {
          points += 5;
          losses += 1;
          activityPoints += 1;
        }

        if (Number(sundayEntry.winningMvpId) === p.id) {
          points += 10;
          mvpPoints += 10;
        }

        if (Number(sundayEntry.losingMvpId) === p.id) {
          points += 5;
          mvpPoints += 5;
        }

        if (Number(sundayEntry.objectiveLeaderId) === p.id) points += 2;
        if (Number(sundayEntry.bestKdId) === p.id) points += 2;
        if (Number(sundayEntry.zeroDeathId) === p.id) points += 5;
        if (sundayEntry.flawless && winnerSet.has(p.id)) points += 15;

        return { ...p, points, wins, losses, mvpPoints, activityPoints };
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
      flawless: false,
    });
  }

  function vote(optionId) {
    updateState((prev) => ({
      ...prev,
      poll: {
        ...prev.poll,
        options: prev.poll.options.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)),
      },
    }));
  }

  const appBg = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(168,85,247,0.35), transparent 25%), linear-gradient(135deg, #0a0612, #12091d 55%, #1f1036)",
    color: "white",
    fontFamily: "Arial, sans-serif",
  };

  function PlayerCard({ player }) {
    const rank = getRank(player.points);

    return (
      <div
        style={{
          ...cardStyle(),
          background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${rank.glow})`,
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
              <div style={{ fontWeight: 800, fontSize: 18 }}>{player.name}</div>
              <span style={badgeStyle(rank.glow, rank.color)}>{rank.name}</span>
              <span style={badgeStyle()}>{player.role}</span>
            </div>
            <div style={{ color: "#d6caef", fontSize: 13, marginTop: 4 }}>
              {player.points} pts • {player.tournamentWins} tournament wins • W {player.wins} / L {player.losses}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <span style={badgeStyle()}><Medal size={12} /> MVP {player.mvpPoints}</span>
              <span style={badgeStyle()}><CalendarDays size={12} /> Activity {player.activityPoints}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function MatchManagementCard({ match }) {
    const teamA = findTeam(match.teamAId);
    const teamB = findTeam(match.teamBId);
    const canA = canTeamAEdit(match);
    const canB = canTeamBConfirm(match);

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
            onClick={() => submitResult(match.id)}
            style={buttonStyle(match.submittedByTeamA, !canA)}
            disabled={!canA}
          >
            <PencilLine size={14} /> Team 1 Submit Result
          </button>

          <button
            onClick={() => confirmResult(match.id)}
            style={buttonStyle(match.teamBConfirmed, !canB)}
            disabled={!canB}
          >
            <CheckCircle2 size={14} /> Team 2 Confirm Result
          </button>

          {canAdmin && (
            <button
              onClick={() => unlockMatch(match.id)}
              style={buttonStyle(false, false)}
            >
              Unlock Match
            </button>
          )}
        </div>

        {!match.locked && match.scoreA !== "" && match.scoreB !== "" && Number(match.scoreA) === Number(match.scoreB) ? (
          <div style={{ marginTop: 10, color: "#fca5a5", fontSize: 13 }}>
            Draws are not allowed. Enter a winning score.
          </div>
        ) : null}
      </div>
    );
  }

  function renderBracketColumn(title, matches, emptyText = "No matches yet.") {
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

  const championTeam = tournament.championTeamId ? findTeam(tournament.championTeamId) : null;

  return (
    <div style={appBg}>
      <div style={{ marginBottom: 20, padding: isMobile ? "10px" : "16px 20px 0" }}>
        {!loggedInPlayer ? (
          <div
            style={{
              maxWidth: 520,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Lock size={18} />
              <strong>Player Login</strong>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <select
                value={selectedLoginPlayerId}
                onChange={(e) => setSelectedLoginPlayerId(e.target.value)}
                style={inputStyle(false)}
              >
                <option value="">Select your player name</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="password"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                style={inputStyle(false)}
              />

              {loginError ? <div style={{ color: "#fca5a5", fontSize: 14 }}>{loginError}</div> : null}

              <button onClick={loginWithPin} style={buttonStyle(true, false)}>
                Login
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ color: "#a78bfa" }}>
              Logged in as: <strong>{loggedInPlayer.name}</strong> • {loggedInPlayer.role}
            </div>

            <button
              onClick={logout}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1480, margin: "0 auto", padding: 20 }}>
        <div style={{ ...cardStyle(), padding: 24, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <span style={badgeStyle()}><Trophy size={14} /> Clan Hub</span>
                <span style={badgeStyle()}><ShieldCheck size={14} /> Admin Tools</span>
                <span style={badgeStyle()}><Swords size={14} /> Double Elimination</span>
                <span style={badgeStyle()}><CalendarDays size={14} /> Sunday Points</span>
              </div>
              <h1 style={{ margin: 0, fontSize: isMobile ? 30 : 46 }}>{state.clanName}</h1>
              <div style={{ color: "#d6c8ef", marginTop: 8 }}>{state.tagline}</div>
            </div>

            <div
              style={{
                width: isMobile ? 90 : 126,
                height: isMobile ? 90 : 126,
                borderRadius: 28,
                overflow: "hidden",
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {state.logoUrl ? (
                <img
                  src={state.logoUrl}
                  alt="Shadowborn ZA"
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }}
                />
              ) : (
                <div style={{ fontWeight: 900, fontSize: 28 }}>SZ</div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          {[
            ["dashboard", "Dashboard"],
            ["leaderboard", "Leaderboard"],
            ["players", "Players"],
            ["tournament", "Tournament"],
            ["bracket", "Bracket"],
            ["sunday", "Sunday Points"],
            ["vote", "Vote"],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={buttonStyle(tab === key, false)}>
              {label}
            </button>
          ))}
        </div>

        {tab === "dashboard" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
              <div style={cardStyle()}>
                <Users />
                <div style={{ marginTop: 12, color: "#cfc4e8" }}>Total Players</div>
                <div style={{ fontSize: 32, fontWeight: 900 }}>{players.length}</div>
              </div>

              <div style={cardStyle()}>
                <Swords />
                <div style={{ marginTop: 12, color: "#cfc4e8" }}>Tournament Teams</div>
                <div style={{ fontSize: 32, fontWeight: 900 }}>{tournament.teams.length}</div>
              </div>

              <div style={cardStyle()}>
                <Target />
                <div style={{ marginTop: 12, color: "#cfc4e8" }}>Tournament Format</div>
                <div style={{ fontSize: 32, fontWeight: 900 }}>{tournament.format}</div>
              </div>

              <div style={cardStyle()}>
                <Crown />
                <div style={{ marginTop: 12, color: "#cfc4e8" }}>Champion</div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>{championTeam ? getTeamName(championTeam) : "TBD"}</div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr",
                gap: 16,
              }}
            >
              <div style={cardStyle()}>
                <h2 style={{ marginTop: 0 }}>Top Leaderboard</h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {sortedPlayers.slice(0, 5).map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                <div style={cardStyle()}>
                  <h2 style={{ marginTop: 0 }}>Quick Branding</h2>

                  <div style={{ marginBottom: 8 }}>Clan Name</div>
                  <input
                    value={state.clanName}
                    onChange={(e) => updateState((prev) => ({ ...prev, clanName: e.target.value }))}
                    style={{ ...inputStyle(!canAdmin), marginBottom: 12 }}
                    disabled={!canAdmin}
                  />

                  <div style={{ marginBottom: 8 }}>Tagline</div>
                  <input
                    value={state.tagline}
                    onChange={(e) => updateState((prev) => ({ ...prev, tagline: e.target.value }))}
                    style={{ ...inputStyle(!canAdmin), marginBottom: 12 }}
                    disabled={!canAdmin}
                  />

                  <div style={{ marginBottom: 8 }}>Logo Path</div>
                  <input
                    value={state.logoUrl}
                    onChange={(e) => updateState((prev) => ({ ...prev, logoUrl: e.target.value }))}
                    style={inputStyle(!canAdmin)}
                    disabled={!canAdmin}
                  />
                </div>

                <div style={cardStyle()}>
                  <h2 style={{ marginTop: 0 }}>Vote Snapshot</h2>
                  {state.poll.options.map((option) => (
                    <div
                      key={option.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 12,
                        borderRadius: 14,
                        background: "rgba(0,0,0,0.18)",
                        marginBottom: 10,
                      }}
                    >
                      <div>{option.label}</div>
                      <span style={badgeStyle()}>{option.votes} votes</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "leaderboard" && (
          <div style={{ display: "grid", gap: 12 }}>
            {sortedPlayers.map((player, index) => (
              <div key={player.id} style={{ ...cardStyle(), padding: 14 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "80px 1.1fr repeat(4, 120px)",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 22 }}>#{index + 1}</div>
                  <div>
                    <div style={{ fontWeight: 800 }}>{player.name}</div>
                    <div style={{ color: "#d5caec", fontSize: 13 }}>{getRank(player.points).name}</div>
                  </div>

                  <input
                    type="number"
                    value={player.points}
                    onChange={(e) => updatePlayer(player.id, "points", e.target.value)}
                    style={inputStyle(!canAdmin)}
                    disabled={!canAdmin}
                  />
                  <input
                    type="number"
                    value={player.tournamentWins}
                    onChange={(e) => updatePlayer(player.id, "tournamentWins", e.target.value)}
                    style={inputStyle(!canAdmin)}
                    disabled={!canAdmin}
                  />
                  <input
                    type="number"
                    value={player.wins}
                    onChange={(e) => updatePlayer(player.id, "wins", e.target.value)}
                    style={inputStyle(!canAdmin)}
                    disabled={!canAdmin}
                  />
                  <input
                    type="number"
                    value={player.losses}
                    onChange={(e) => updatePlayer(player.id, "losses", e.target.value)}
                    style={inputStyle(!canAdmin)}
                    disabled={!canAdmin}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "players" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.25fr 0.75fr",
              gap: 16,
            }}
          >
            <div style={{ display: "grid", gap: 12 }}>
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>

            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Add Clan Member</h2>

              <div style={{ marginBottom: 8 }}>Name</div>
              <input
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                style={{ ...inputStyle(!canAdmin), marginBottom: 12 }}
                disabled={!canAdmin}
              />

              <div style={{ marginBottom: 8 }}>Emblem</div>
              <input
                value={newPlayer.emblem}
                onChange={(e) => setNewPlayer({ ...newPlayer, emblem: e.target.value })}
                style={{ ...inputStyle(!canAdmin), marginBottom: 12 }}
                disabled={!canAdmin}
              />

              <div style={{ marginBottom: 8 }}>Starting Points</div>
              <input
                type="number"
                value={newPlayer.points}
                onChange={(e) => setNewPlayer({ ...newPlayer, points: e.target.value })}
                style={{ ...inputStyle(!canAdmin), marginBottom: 12 }}
                disabled={!canAdmin}
              />

              <div style={{ marginBottom: 8 }}>Tournament Wins</div>
              <input
                type="number"
                value={newPlayer.tournamentWins}
                onChange={(e) => setNewPlayer({ ...newPlayer, tournamentWins: e.target.value })}
                style={{ ...inputStyle(!canAdmin), marginBottom: 12 }}
                disabled={!canAdmin}
              />

              <div style={{ marginBottom: 8 }}>Role</div>
              <select
                value={newPlayer.role}
                onChange={(e) => setNewPlayer({ ...newPlayer, role: e.target.value })}
                style={{ ...inputStyle(!canAdmin), marginBottom: 12 }}
                disabled={!canAdmin}
              >
                <option value="leader">leader</option>
                <option value="co-leader">co-leader</option>
                <option value="player">player</option>
              </select>

              <div style={{ marginBottom: 8 }}>Profile Image URL</div>
              <input
                value={newPlayer.avatar}
                onChange={(e) => setNewPlayer({ ...newPlayer, avatar: e.target.value })}
                style={{ ...inputStyle(!canAdmin), marginBottom: 14 }}
                disabled={!canAdmin}
              />

              <button onClick={addPlayer} style={{ ...buttonStyle(true, !canAdmin), width: "100%" }} disabled={!canAdmin}>
                <Plus size={16} style={{ marginRight: 6 }} /> Add Player
              </button>
            </div>
          </div>
        )}

        {tab === "tournament" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Tournament Setup</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 180px auto auto",
                  gap: 12,
                  alignItems: "end",
                }}
              >
                <div>
                  <div style={{ marginBottom: 8 }}>Tournament Title</div>
                  <input
                    value={tournament.title}
                    onChange={(e) => setTournamentField("title", e.target.value)}
                    style={inputStyle(!canAdmin)}
                    disabled={!canAdmin}
                  />
                </div>

                <div>
                  <div style={{ marginBottom: 8 }}>Format</div>
                  <select
                    value={tournament.format}
                    onChange={(e) => setTournamentField("format", e.target.value)}
                    style={inputStyle(!canAdmin)}
                    disabled={!canAdmin}
                  >
                    <option>1v1</option>
                    <option>2v2</option>
                    <option>4v4</option>
                  </select>
                </div>

                <button style={buttonStyle(true, !canAdmin)} onClick={generateTournament} disabled={!canAdmin || tournament.teams.length < 2}>
                  Generate Bracket
                </button>

                <button style={buttonStyle(false, !canAdmin)} onClick={resetTournament} disabled={!canAdmin}>
                  Reset
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "0.95fr 1.05fr",
                gap: 16,
              }}
            >
              <div style={cardStyle()}>
                <h2 style={{ marginTop: 0 }}>Manual Team Builder</h2>
                <div style={{ color: "#d6caef", marginBottom: 12 }}>
                  Format: {tournament.format} • Team size: {draftTeamSize} • Build teams manually before generating the bracket.
                </div>

                {tournament.format !== "1v1" && (
                  <>
                    <div style={{ marginBottom: 8 }}>Team Name</div>
                    <input
                      value={tournament.teamDraft.name}
                      onChange={(e) => setTeamDraftField("name", e.target.value)}
                      style={{ ...inputStyle(!canAdmin), marginBottom: 12 }}
                      disabled={!canAdmin}
                      placeholder="Example: Team Alpha"
                    />
                  </>
                )}

                <div style={{ display: "grid", gap: 10 }}>
                  {Array.from({ length: draftTeamSize }).map((_, index) => (
                    <select
                      key={index}
                      value={tournament.teamDraft.memberIds[index] || ""}
                      onChange={(e) => setDraftMember(index, e.target.value)}
                      style={inputStyle(!canAdmin)}
                      disabled={!canAdmin}
                    >
                      <option value="">Select player</option>
                      {players
                        .filter((p) => {
                          const selectedElsewhere = tournament.teamDraft.memberIds.some(
                            (id, slotIndex) => slotIndex !== index && Number(id) === p.id
                          );
                          const alreadyUsed = usedIds.has(p.id);
                          return !selectedElsewhere && !alreadyUsed;
                        })
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                  ))}
                </div>

                <div style={{ marginTop: 12 }}>
                  <button onClick={addTeamToTournament} style={buttonStyle(true, !canAdmin)} disabled={!canAdmin}>
                    Add Team
                  </button>
                </div>

                <div style={{ marginTop: 18 }}>
                  <div style={{ marginBottom: 8, fontWeight: 800 }}>Saved Teams</div>
                  {tournament.teams.length === 0 ? (
                    <div style={{ color: "#cfc4e8" }}>No teams added yet.</div>
                  ) : (
                    <div style={{ display: "grid", gap: 10 }}>
                      {tournament.teams.map((team) => (
                        <div
                          key={team.id}
                          style={{
                            padding: 12,
                            borderRadius: 14,
                            background: "rgba(0,0,0,0.18)",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 10,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800 }}>{getTeamName(team)}</div>
                          </div>

                          {canAdmin && tournament.status === "Setup" && (
                            <button
                              onClick={() => removeTeam(team.id)}
                              style={{
                                ...buttonStyle(false, false),
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <Trash2 size={14} />
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={cardStyle()}>
                <h2 style={{ marginTop: 0 }}>Match Management</h2>
                <div style={{ color: "#d6caef", marginBottom: 14 }}>
                  Team 1 enters both scores. Team 2 confirms. Once confirmed, the bracket advances automatically.
                </div>

                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>Active Winners Bracket</div>
                    {tournament.activeWinners.length === 0 ? (
                      <div style={{ color: "#cfc4e8" }}>No active winners matches.</div>
                    ) : (
                      <div style={{ display: "grid", gap: 12 }}>
                        {tournament.activeWinners.map((match) => (
                          <MatchManagementCard key={match.id} match={match} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>Active Redemption Bracket</div>
                    {tournament.activeRedemption.length === 0 ? (
                      <div style={{ color: "#cfc4e8" }}>No active redemption matches.</div>
                    ) : (
                      <div style={{ display: "grid", gap: 12 }}>
                        {tournament.activeRedemption.map((match) => (
                          <MatchManagementCard key={match.id} match={match} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>Grand Final</div>
                    {!tournament.grandFinal || tournament.grandFinal.length === 0 ? (
                      <div style={{ color: "#cfc4e8" }}>Grand Final not ready yet.</div>
                    ) : (
                      <div style={{ display: "grid", gap: 12 }}>
                        {tournament.grandFinal.map((match) => (
                          <MatchManagementCard key={match.id} match={match} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "bracket" && (
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ ...cardStyle(), background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontWeight: 900, fontSize: 24, marginBottom: 12 }}>Bracket Tree View</div>
              <div style={{ color: "#d6caef", marginBottom: 16 }}>
                CDL-style layout without dates. Winners bracket, redemption bracket, and grand final shown separately.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                  gap: 14,
                  alignItems: "start",
                }}
              >
                {renderBracketColumn(
                  "Winners Bracket",
                  tournament.activeWinners,
                  "No active winners matches."
                )}

                {renderBracketColumn(
                  "Redemption Bracket",
                  tournament.activeRedemption,
                  "No active redemption matches yet."
                )}

                {renderBracketColumn(
                  "Grand Final",
                  tournament.grandFinal || [],
                  "Grand Final not ready yet."
                )}
              </div>
            </div>

            {tournament.winnersCarry ? (
              <div style={{ ...cardStyle(), background: "rgba(0,0,0,0.18)" }}>
                <div style={{ fontWeight: 900, marginBottom: 8 }}>Winners Carry / Bye</div>
                <div>{getTeamName(findTeam(tournament.winnersCarry))}</div>
              </div>
            ) : null}

            {tournament.redemptionCarry ? (
              <div style={{ ...cardStyle(), background: "rgba(0,0,0,0.18)" }}>
                <div style={{ fontWeight: 900, marginBottom: 8 }}>Redemption Carry / Bye</div>
                <div>{getTeamName(findTeam(tournament.redemptionCarry))}</div>
              </div>
            ) : null}

            <div style={{ ...cardStyle(), background: "rgba(0,0,0,0.18)" }}>
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 12 }}>Completed Rounds</div>

              {tournament.completedRounds.length === 0 ? (
                <div style={{ color: "#cfc4e8" }}>No completed rounds yet.</div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {tournament.completedRounds.map((round, index) => (
                    <div key={`${round.name}-${index}`} style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.04)" }}>
                      <div style={{ fontWeight: 800, marginBottom: 8 }}>{round.name}</div>
                      <div style={{ display: "grid", gap: 10 }}>
                        {round.matches.map((match) => {
                          const teamA = findTeam(match.teamAId);
                          const teamB = findTeam(match.teamBId);
                          const winner = findTeam(match.winnerId);

                          return (
                            <div key={match.id} style={{ padding: 10, borderRadius: 12, background: "rgba(0,0,0,0.18)" }}>
                              <div style={{ fontWeight: 700 }}>
                                {getTeamName(teamA)} vs {getTeamName(teamB)}
                              </div>
                              <div style={{ color: "#d6caef", fontSize: 13, marginTop: 4 }}>
                                Score: {match.scoreA} - {match.scoreB}
                              </div>
                              <div style={{ color: "#86efac", fontSize: 13, marginTop: 4 }}>
                                Winner: {winner ? getTeamName(winner) : "TBD"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {championTeam ? (
              <div style={{ ...cardStyle(), background: "rgba(34,197,94,0.08)" }}>
                <div style={{ fontWeight: 900, fontSize: 20 }}>Champion</div>
                <div style={{ marginTop: 8 }}>{getTeamName(championTeam)}</div>
              </div>
            ) : null}
          </div>
        )}

        {tab === "sunday" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "0.95fr 1.05fr",
              gap: 16,
            }}
          >
            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Sunday Point Match Calculator</h2>
              <div style={{ color: "#d6caef", marginBottom: 12 }}>
                Win +10 each, loss +5 each, winning MVP +10, losing MVP +5, objective +2, best KD +2, 0 deaths +5, flawless win +15.
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <div style={{ marginBottom: 6 }}>Mode</div>
                  <select
                    value={sundayEntry.mode}
                    onChange={(e) => setSundayEntry({ ...sundayEntry, mode: e.target.value })}
                    style={inputStyle(!canAdmin)}
                    disabled={!canAdmin}
                  >
                    <option>Hardpoint</option>
                    <option>SND</option>
                    <option>Overload</option>
                  </select>
                </div>

                <div>
                  <div style={{ marginBottom: 6 }}>Map / Match Name</div>
                  <input
                    value={sundayEntry.mapName}
                    onChange={(e) => setSundayEntry({ ...sundayEntry, mapName: e.target.value })}
                    style={inputStyle(!canAdmin)}
                    disabled={!canAdmin}
                  />
                </div>

                <div>
                  <div style={{ marginBottom: 6 }}>Score Summary</div>
                  <input
                    value={sundayEntry.scoreText}
                    onChange={(e) => setSundayEntry({ ...sundayEntry, scoreText: e.target.value })}
                    placeholder="250-47 or 6-0"
                    style={inputStyle(!canAdmin)}
                    disabled={!canAdmin}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ marginBottom: 6 }}>Winning Team</div>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <select
                        key={`w-${index}`}
                        value={sundayEntry.winningTeamIds[index] || ""}
                        onChange={(e) => {
                          const next = [...sundayEntry.winningTeamIds];
                          next[index] = Number(e.target.value);
                          setSundayEntry({ ...sundayEntry, winningTeamIds: next.filter(Boolean) });
                        }}
                        style={{ ...inputStyle(!canAdmin), marginBottom: 8 }}
                        disabled={!canAdmin}
                      >
                        <option value="">Select player</option>
                        {players.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>

                  <div>
                    <div style={{ marginBottom: 6 }}>Losing Team</div>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <select
                        key={`l-${index}`}
                        value={sundayEntry.losingTeamIds[index] || ""}
                        onChange={(e) => {
                          const next = [...sundayEntry.losingTeamIds];
                          next[index] = Number(e.target.value);
                          setSundayEntry({ ...sundayEntry, losingTeamIds: next.filter(Boolean) });
                        }}
                        style={{ ...inputStyle(!canAdmin), marginBottom: 8 }}
                        disabled={!canAdmin}
                      >
                        <option value="">Select player</option>
                        {players.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                </div>

                {[
                  ["Winning MVP", "winningMvpId"],
                  ["Losing MVP", "losingMvpId"],
                  ["Highest Objective", "objectiveLeaderId"],
                  ["Best KD", "bestKdId"],
                  ["0 Deaths", "zeroDeathId"],
                ].map(([label, field]) => (
                  <div key={field}>
                    <div style={{ marginBottom: 6 }}>{label}</div>
                    <select
                      value={sundayEntry[field]}
                      onChange={(e) => setSundayEntry({ ...sundayEntry, [field]: e.target.value })}
                      style={inputStyle(!canAdmin)}
                      disabled={!canAdmin}
                    >
                      <option value="">Select player</option>
                      {players.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={sundayEntry.flawless}
                    onChange={(e) => setSundayEntry({ ...sundayEntry, flawless: e.target.checked })}
                    disabled={!canAdmin}
                  />
                  Flawless victory bonus applies
                </label>

                <button onClick={applySundayPoints} style={buttonStyle(true, !canAdmin)} disabled={!canAdmin}>
                  Apply Sunday Points
                </button>
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
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                        <div style={{ fontWeight: 800 }}>{entry.mapName || entry.mode}</div>
                        <span style={badgeStyle()}>{entry.createdAt}</span>
                      </div>
                      <div style={{ color: "#d6caef", fontSize: 13 }}>
                        Mode: {entry.mode} • Score: {entry.scoreText || "-"}
                      </div>
                    </div>
                  ))}
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
                <div
                  key={option.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 14,
                    borderRadius: 16,
                    background: "rgba(0,0,0,0.18)",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{option.label}</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={badgeStyle()}>{option.votes} votes</span>
                    <button onClick={() => vote(option.id)} style={buttonStyle(true, false)}>
                      Vote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}