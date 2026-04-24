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
  Upload,
  MessageCircle,
  Star,
} from "lucide-react";
import { supabase } from "./supabase";

const STORAGE_ROW_ID = 1;
const DISCORD_LINK = "https://discord.gg/DRads9MkB";
const DEFAULT_LOGO = "/shadowborn-za-logo.jpg";

const PLAYER_PINS = {
  "The Fudgeman": "4182",
  Bulletstorm: "2809",
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
  Dolomieu: "1782",
  Papi: "4309",
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
  tournament: emptyTournament,
  championBanner: null,
  hallOfFame: [],
  callouts: [],
  poll: {
    question: "What should we play next?",
    options: [
      { id: 1, label: "1v1 Tournament", votes: 0 },
      { id: 2, label: "2v2 Tournament", votes: 0 },
      { id: 3, label: "4v4 Tournament", votes: 0 },
      { id: 4, label: "Sunday Point Match", votes: 0 },
    ],
  },
  sundayHistory: [],
};

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

export default function App() {
  const [state, setState] = useState(defaultState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState(null);
  const [auth, setAuth] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [pin, setPin] = useState("");
  const [selectedLoginPlayerId, setSelectedLoginPlayerId] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

  const [newPlayer, setNewPlayer] = useState({
    name: "",
    emblem: "",
    points: 0,
    tournamentWins: 0,
    avatar: "",
    role: "player",
  });

  const [calloutDraft, setCalloutDraft] = useState({
    challengedId: "",
    scoreA: "",
    scoreB: "",
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

  const players = state.players || [];
  const tournament = state.tournament || emptyTournament;

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name)),
    [players]
  );

  const loggedInPlayer = auth ? players.find((p) => p.id === auth.playerId) : null;
  const canAdmin = loggedInPlayer && (loggedInPlayer.role === "leader" || loggedInPlayer.role === "co-leader");

  useEffect(() => {
    loadCloudState();
  }, []);

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
        tournament: { ...emptyTournament, ...(data.data.tournament || {}) },
        hallOfFame: data.data.hallOfFame || [],
        callouts: data.data.callouts || [],
      });
    } else {
      await supabase
        .from("shadowborn_state")
        .upsert({ id: STORAGE_ROW_ID, data: defaultState, updated_at: new Date().toISOString() });
      setState(defaultState);
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
    setTab("dashboard");
  }

  function logout() {
    setAuth(null);
    setPin("");
    setSelectedLoginPlayerId("");
    setLoginError("");
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
              [field]: ["points", "tournamentWins", "wins", "losses", "mvpPoints", "activityPoints"].includes(field)
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

  function addPlayer() {
    if (!canAdmin) return;

    if (!newPlayer.name.trim()) return;

    const nextId = Math.max(...players.map((p) => p.id), 0) + 1;

    updateState((prev) => ({
      ...prev,
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

  function removePlayer(playerId) {
    if (!canAdmin) return;

    updateState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== playerId),
    }));
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
          status: "Live",
          winnersStage: 1,
          redemptionStage: 1,
        },
      };
    });

    setTab("bracket");
  }

  function updateMatchField(matchId, field, value) {
    updateState((prev) => {
      const apply = (arr) =>
        arr.map((m) => (m.id === matchId ? { ...m, [field]: value } : m));

      return {
        ...prev,
        tournament: {
          ...prev.tournament,
          activeWinners: apply(prev.tournament.activeWinners),
          activeRedemption: apply(prev.tournament.activeRedemption),
          grandFinal:
            prev.tournament.grandFinal?.id === matchId
              ? { ...prev.tournament.grandFinal, [field]: value }
              : prev.tournament.grandFinal,
        },
      };
    });
  }

  function submitByTeamA(matchId) {
    updateMatchField(matchId, "submittedByTeamA", true);
  }

  function confirmByTeamB(matchId) {
    updateState((prev) => {
      function finalize(match) {
        const scoreA = Number(match.scoreA);
        const scoreB = Number(match.scoreB);

        if (Number.isNaN(scoreA) || Number.isNaN(scoreB)) return match;

        const winnerId = scoreA > scoreB ? match.teamAId : match.teamBId;
        const loserId = scoreA > scoreB ? match.teamBId : match.teamAId;

        return {
          ...match,
          teamBConfirmed: true,
          locked: true,
          winnerId,
          loserId,
        };
      }

      return {
        ...prev,
        tournament: {
          ...prev.tournament,
          activeWinners: prev.tournament.activeWinners.map((m) =>
            m.id === matchId ? finalize(m) : m
          ),
          activeRedemption: prev.tournament.activeRedemption.map((m) =>
            m.id === matchId ? finalize(m) : m
          ),
          grandFinal:
            prev.tournament.grandFinal?.id === matchId
              ? finalize(prev.tournament.grandFinal)
              : prev.tournament.grandFinal,
        },
      };
    });
  }

  function advanceBracket() {
    if (!canAdmin) return;

    updateState((prev) => {
      const tournament = prev.tournament;

      const winnersDone = allLocked(tournament.activeWinners);
      const redemptionDone = allLocked(tournament.activeRedemption);

      if (!winnersDone) return prev;

      const winners = getOfficialWinners(tournament.activeWinners);
      const losers = getOfficialLosers(tournament.activeWinners);

      const completed = [
        ...tournament.completedRounds,
        ...tournament.activeWinners,
        ...tournament.activeRedemption,
      ];

      if (winners.length === 1 && losers.length === 1 && redemptionDone) {
        const grandFinal = {
          id: `GF-${Date.now()}`,
          bracket: "GF",
          stage: 1,
          label: "Grand Final",
          teamAId: winners[0],
          teamBId: losers[0],
          scoreA: "",
          scoreB: "",
          submittedByTeamA: false,
          teamBConfirmed: false,
          locked: false,
          winnerId: null,
          loserId: null,
        };

        return {
          ...prev,
          tournament: {
            ...tournament,
            activeWinners: [],
            activeRedemption: [],
            grandFinal,
            completedRounds: completed,
          },
        };
      }

      const nextWinners = pairTeams(winners, "W", tournament.winnersStage + 1);
      const nextRedemption = pairTeams(losers, "L", tournament.redemptionStage + 1);

      return {
        ...prev,
        tournament: {
          ...tournament,
          activeWinners: nextWinners.matches,
          activeRedemption: nextRedemption.matches,
          winnersCarry: nextWinners.carry,
          redemptionCarry: nextRedemption.carry,
          completedRounds: completed,
          winnersStage: tournament.winnersStage + 1,
          redemptionStage: tournament.redemptionStage + 1,
        },
      };
    });
  }

  function finalizeChampion() {
    if (!canAdmin) return;
    if (!tournament.grandFinal?.locked) return;

    const championTeam = findTeam(tournament.grandFinal.winnerId);

    if (!championTeam) return;

    updateState((prev) => ({
      ...prev,
      championBanner: {
        teamId: championTeam.id,
        teamName: getTeamName(championTeam),
        createdAt: new Date().toLocaleDateString(),
      },
      hallOfFame: [
        {
          id: Date.now(),
          championTeamId: championTeam.id,
          championName: getTeamName(championTeam),
          tournamentTitle: prev.tournament.title,
          createdAt: new Date().toLocaleDateString(),
        },
        ...prev.hallOfFame,
      ],
      tournament: {
        ...emptyTournament,
      },
    }));
  }

  function submitCallout() {
    if (!loggedInPlayer) return;
    if (!calloutDraft.challengedId) return;

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
          scoreA: calloutDraft.scoreA,
          scoreB: calloutDraft.scoreB,
          confirmed: false,
          createdAt: new Date().toLocaleDateString(),
        },
        ...prev.callouts,
      ],
    }));

    setCalloutDraft({
      challengedId: "",
      scoreA: "",
      scoreB: "",
    });
  }

  function confirmCallout(calloutId) {
    updateState((prev) => {
      const callout = prev.callouts.find((c) => c.id === calloutId);

      if (!callout || callout.confirmed) return prev;

      const scoreA = Number(callout.scoreA);
      const scoreB = Number(callout.scoreB);

      const winnerId = scoreA > scoreB ? callout.challengerId : callout.challengedId;
      const loserId = scoreA > scoreB ? callout.challengedId : callout.challengerId;

      return {
        ...prev,
        callouts: prev.callouts.map((c) =>
          c.id === calloutId ? { ...c, confirmed: true } : c
        ),
        players: prev.players.map((p) => {
          if (p.id === winnerId) return { ...p, points: p.points + 10 };
          if (p.id === loserId) return { ...p, points: p.points - 10 };
          return p;
        }),
      };
    });
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
        options: prev.poll.options.map((o) =>
          o.id === optionId ? { ...o, votes: o.votes + 1 } : o
        ),
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
    const canUpload = loggedInPlayer?.id === player.id || canAdmin;

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

            {canUpload ? (
              <label
                style={{
                  ...buttonStyle(false, false),
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 10,
                  fontSize: 13,
                }}
              >
                <Upload size={14} />
                Upload Avatar
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadAvatar(player.id, e.target.files?.[0])}
                  style={{ display: "none" }}
                />
              </label>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  function MatchCard({ match }) {
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
      <div style={{ ...appBg, display: "grid", placeItems: "center", padding: 20 }}>
        <div
          style={{
            width: 420,
            maxWidth: "96vw",
            ...cardStyle(),
            textAlign: "center",
            padding: 28,
          }}
        >
          <img
            src={state.logoUrl || DEFAULT_LOGO}
            alt="Shadowborn ZA"
            style={{
              width: 140,
              height: 140,
              objectFit: "contain",
              marginBottom: 12,
            }}
          />

          <h1 style={{ margin: 0, fontSize: 32 }}>{state.clanName}</h1>
          <div style={{ color: "#d6caef", marginTop: 8, marginBottom: 24 }}>
            {state.tagline}
          </div>

          <div style={{ display: "grid", gap: 12, textAlign: "left" }}>
            <div>
              <div style={{ marginBottom: 6 }}>Player Name</div>
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
            </div>

            <div>
              <div style={{ marginBottom: 6 }}>PIN</div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                style={inputStyle(false)}
              />
            </div>

            {loginError ? (
              <div style={{ color: "#fca5a5", fontSize: 14 }}>{loginError}</div>
            ) : null}

            <button onClick={loginWithPin} style={buttonStyle(true, false)}>
              <Lock size={14} /> Login
            </button>

            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noreferrer"
              style={{
                ...buttonStyle(false, false),
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              <MessageCircle size={14} /> Join Shadowborn Discord
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={appBg}>
      <div style={{ maxWidth: 1480, margin: "0 auto", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ color: "#a78bfa" }}>
            Logged in as <strong>{loggedInPlayer.name}</strong> • {loggedInPlayer.role}
            {saving ? " • Saving..." : ""}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noreferrer"
              style={{
                ...buttonStyle(false, false),
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MessageCircle size={14} /> Discord
            </a>

            <button onClick={logout} style={buttonStyle(false, false)}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        <div style={{ ...cardStyle(), padding: 24, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <span style={badgeStyle()}><Trophy size={14} /> Clan Hub</span>
                <span style={badgeStyle()}><ShieldCheck size={14} /> Saved Online</span>
                <span style={badgeStyle()}><Swords size={14} /> Double Elimination</span>
                <span style={badgeStyle()}><Star size={14} /> Hall of Fame</span>
              </div>
              <h1 style={{ margin: 0, fontSize: isMobile ? 30 : 46 }}>{state.clanName}</h1>
              <div style={{ color: "#d6c8ef", marginTop: 8 }}>{state.tagline}</div>
            </div>

            <img
              src={state.logoUrl || DEFAULT_LOGO}
              alt="Shadowborn ZA"
              style={{
                width: isMobile ? 90 : 126,
                height: isMobile ? 90 : 126,
                objectFit: "contain",
                borderRadius: 28,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: 8,
              }}
            />
          </div>
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

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          {[
            ["dashboard", "Dashboard"],
            ["leaderboard", "Leaderboard"],
            ["players", "Players"],
            ["callouts", "Call-outs"],
            ["tournament", "Tournament"],
            ["bracket", "Bracket"],
            ["hall", "Hall of Fame"],
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
              <div style={cardStyle()}><Users /><div style={{ marginTop: 12, color: "#cfc4e8" }}>Total Players</div><div style={{ fontSize: 32, fontWeight: 900 }}>{players.length}</div></div>
              <div style={cardStyle()}><Swords /><div style={{ marginTop: 12, color: "#cfc4e8" }}>Tournament Teams</div><div style={{ fontSize: 32, fontWeight: 900 }}>{tournament.teams.length}</div></div>
              <div style={cardStyle()}><Target /><div style={{ marginTop: 12, color: "#cfc4e8" }}>Tournament Format</div><div style={{ fontSize: 32, fontWeight: 900 }}>{tournament.format}</div></div>
              <div style={cardStyle()}><Crown /><div style={{ marginTop: 12, color: "#cfc4e8" }}>Champion</div><div style={{ fontSize: 20, fontWeight: 900 }}>{championTeam ? getTeamName(championTeam) : state.championBanner?.teamName || "TBD"}</div></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr", gap: 16 }}>
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
                    <div key={option.id} style={{ display: "flex", justifyContent: "space-between", padding: 12, borderRadius: 14, background: "rgba(0,0,0,0.18)", marginBottom: 10 }}>
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
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "80px 1.1fr repeat(4, 120px)", gap: 12, alignItems: "center" }}>
                  <div style={{ fontWeight: 900, fontSize: 22 }}>#{index + 1}</div>
                  <div>
                    <div style={{ fontWeight: 800 }}>{player.name}</div>
                    <div style={{ color: "#d5caec", fontSize: 13 }}>{getRank(player.points).name}</div>
                  </div>
                  <input type="number" value={player.points} onChange={(e) => updatePlayer(player.id, "points", e.target.value)} style={inputStyle(!canAdmin)} disabled={!canAdmin} />
                  <input type="number" value={player.tournamentWins} onChange={(e) => updatePlayer(player.id, "tournamentWins", e.target.value)} style={inputStyle(!canAdmin)} disabled={!canAdmin} />
                  <input type="number" value={player.wins} onChange={(e) => updatePlayer(player.id, "wins", e.target.value)} style={inputStyle(!canAdmin)} disabled={!canAdmin} />
                  <input type="number" value={player.losses} onChange={(e) => updatePlayer(player.id, "losses", e.target.value)} style={inputStyle(!canAdmin)} disabled={!canAdmin} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "players" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.25fr 0.75fr", gap: 16 }}>
            <div style={{ display: "grid", gap: 12 }}>
              {players.map((player) => <PlayerCard key={player.id} player={player} />)}
            </div>

            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Add Clan Member</h2>

              <div style={{ marginBottom: 8 }}>Name</div>
              <input value={newPlayer.name} onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })} style={{ ...inputStyle(!canAdmin), marginBottom: 12 }} disabled={!canAdmin} />

              <div style={{ marginBottom: 8 }}>Emblem</div>
              <input value={newPlayer.emblem} onChange={(e) => setNewPlayer({ ...newPlayer, emblem: e.target.value })} style={{ ...inputStyle(!canAdmin), marginBottom: 12 }} disabled={!canAdmin} />

              <div style={{ marginBottom: 8 }}>Starting Points</div>
              <input type="number" value={newPlayer.points} onChange={(e) => setNewPlayer({ ...newPlayer, points: e.target.value })} style={{ ...inputStyle(!canAdmin), marginBottom: 12 }} disabled={!canAdmin} />

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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <input placeholder="Your score" value={calloutDraft.scoreA} onChange={(e) => setCalloutDraft({ ...calloutDraft, scoreA: e.target.value })} style={inputStyle(false)} />
                <input placeholder="Opponent score" value={calloutDraft.scoreB} onChange={(e) => setCalloutDraft({ ...calloutDraft, scoreB: e.target.value })} style={inputStyle(false)} />
              </div>

              <button onClick={submitCallout} style={buttonStyle(true, false)}>Submit Call-out</button>
            </div>

            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Call-out History</h2>
              {state.callouts.length === 0 ? (
                <div style={{ color: "#d6caef" }}>No call-outs yet.</div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {state.callouts.map((c) => {
                    const challenger = players.find((p) => p.id === c.challengerId);
                    const challenged = players.find((p) => p.id === c.challengedId);
                    const canConfirm = loggedInPlayer?.id === c.challengedId && !c.confirmed;

                    return (
                      <div key={c.id} style={{ padding: 12, borderRadius: 14, background: "rgba(0,0,0,0.18)" }}>
                        <div style={{ fontWeight: 800 }}>{challenger?.name} vs {challenged?.name}</div>
                        <div style={{ color: "#d6caef", marginTop: 4 }}>Score: {c.scoreA} - {c.scoreB}</div>
                        <div style={{ marginTop: 8 }}>
                          <span style={badgeStyle(c.confirmed ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.08)", c.confirmed ? "#86efac" : "white")}>
                            {c.confirmed ? "Confirmed" : "Pending"}
                          </span>
                        </div>

                        {canConfirm ? (
                          <button onClick={() => confirmCallout(c.id)} style={{ ...buttonStyle(true, false), marginTop: 10 }}>
                            Confirm Result
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
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
                    <option>1v1</option>
                    <option>2v2</option>
                    <option>4v4</option>
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
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14, alignItems: "start" }}>
              <BracketColumn title="Winners Bracket" matches={tournament.activeWinners} emptyText="No active winners matches." />
              <BracketColumn title="Redemption Bracket" matches={tournament.activeRedemption} emptyText="No active redemption matches yet." />
              <BracketColumn title="Grand Final" matches={tournament.grandFinal ? [tournament.grandFinal] : []} emptyText="Grand Final not ready yet." />
            </div>

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
                    {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                ))}

                <label>
                  <input type="checkbox" checked={sundayEntry.flawless} onChange={(e) => setSundayEntry({ ...sundayEntry, flawless: e.target.checked })} disabled={!canAdmin} /> Flawless victory bonus
                </label>

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
    </div>
  );
}