import { useEffect, useMemo, useState } from "react";
import {
  Trophy,
  Plus,
  X,
  Users,
  Swords,
  Target,
  Medal,
  Trash2,
  CheckCircle2,
  Clock3,
  ChevronDown,
  Flag,
} from "lucide-react";
import { supabase } from "../supabase";

const glassCard = {
  position: "relative",
  background:
    "linear-gradient(145deg, rgba(18,14,27,0.68), rgba(8,6,14,0.58))",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(216,180,254,0.11)",
  borderRadius: 22,
  boxShadow:
    "0 18px 45px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.025)",
};

const inputStyle = {
  width: "100%",
  padding: "12px 13px",
  borderRadius: 12,
  border: "1px solid rgba(192,132,252,0.18)",
  background: "rgba(9,6,15,0.72)",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  color: "#a99db9",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.5,
  marginBottom: 7,
  display: "block",
};

function StatCard({
  icon,
  value,
  label,
  accent = "#c084fc",
}) {
  return (
    <div
      style={{
        ...glassCard,
        padding: 18,
        minHeight: 84,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          display: "grid",
          placeItems: "center",
          color: accent,
          background: `${accent}12`,
          border: `1px solid ${accent}25`,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontSize: 25,
            lineHeight: 1,
            fontWeight: 950,
            color: "#fff",
          }}
        >
          {value}
        </div>

        <div
          style={{
            color: "#968ba6",
            marginTop: 6,
            fontSize: 12,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function placementNumber(value) {
  if (!value) return null;

  const match = String(value).match(/\d+/);

  return match ? Number(match[0]) : null;
}

function getRequiredPlayers(format) {
  if (format === "1v1") return 1;
  if (format === "2v2") return 2;
  if (format === "3v3") return 3;
  if (format === "4v4") return 4;

  return 0;
}

export default function TournamentResults({
  players = [],
  loggedInPlayer,
  canAdmin,
  storageRowId = 999,
}) {
  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);

  const [selectedDivision, setSelectedDivision] =
    useState("all");

  const [openTournamentId, setOpenTournamentId] =
    useState(null);

  const [addMatchTournamentId, setAddMatchTournamentId] =
    useState(null);

  const [finishTournamentId, setFinishTournamentId] =
    useState(null);

  const [matchDraft, setMatchDraft] = useState({
  bracketRound: "Round 1",
  opponent: "",
  result: "W",
  scoreFor: "",
  scoreAgainst: "",
  playerIds: [],
});
  const [finishPlacement, setFinishPlacement] =
    useState("1st");

  const [draft, setDraft] = useState({
    tournamentName: "",
    tournamentDate: new Date()
      .toISOString()
      .slice(0, 10),

    tournamentType: "2v2",

    gameMode: "SND",

    lineupType: "division",

    division: "",

    teamName: "",

    playerIds: [],
  });

  const divisions = useMemo(() => {
    const values = players
      .map((player) =>
        Number(player.division || 0)
      )
      .filter((division) => division > 0);

    return [...new Set(values)].sort(
      (a, b) => a - b
    );
  }, [players]);

  async function loadData() {
    setLoading(true);

    const [
      tournamentsResponse,
      matchesResponse,
    ] = await Promise.all([
      supabase
        .from("shadowborn_tournaments")
        .select("*")
        .eq(
          "storage_row_id",
          storageRowId
        )
        .order(
          "tournament_date",
          { ascending: false }
        )
        .order(
          "created_at",
          { ascending: false }
        ),

      supabase
        .from(
          "shadowborn_tournament_matches"
        )
        .select("*")
        .eq(
          "storage_row_id",
          storageRowId
        )
        .order(
          "created_at",
          { ascending: true }
        ),
    ]);

    if (tournamentsResponse.error) {
      console.error(
        "Tournament load failed:",
        tournamentsResponse.error
      );

      alert(
        "Tournament data could not load.\n\n" +
          tournamentsResponse.error.message
      );
    }

    if (matchesResponse.error) {
      console.error(
        "Tournament matches load failed:",
        matchesResponse.error
      );

      alert(
        "Tournament matches could not load.\n\n" +
          matchesResponse.error.message
      );
    }

    setTournaments(
      tournamentsResponse.data || []
    );

    setMatches(
      matchesResponse.data || []
    );

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [storageRowId]);

  const availablePlayers = useMemo(() => {
    if (
      draft.lineupType === "division" &&
      Number(draft.division) > 0
    ) {
      return players.filter(
        (player) =>
          Number(
            player.division || 0
          ) === Number(draft.division)
      );
    }

    return players;
  }, [
    players,
    draft.lineupType,
    draft.division,
  ]);

  function resetTournamentDraft() {
    setDraft({
      tournamentName: "",
      tournamentDate: new Date()
        .toISOString()
        .slice(0, 10),

      tournamentType: "2v2",

      gameMode: "SND",

      lineupType: "division",

      division: "",

      teamName: "",

      playerIds: [],
    });
  }

  function togglePlayer(playerId) {
    const id = Number(playerId);

    const requiredPlayers =
      getRequiredPlayers(
        draft.tournamentType
      );

    setDraft((prev) => {
      const selected =
        prev.playerIds.includes(id);

      if (selected) {
        return {
          ...prev,
          playerIds:
            prev.playerIds.filter(
              (selectedId) =>
                selectedId !== id
            ),
        };
      }

      if (
        prev.playerIds.length >=
        requiredPlayers
      ) {
        alert(
          `${draft.tournamentType} requires exactly ${requiredPlayers} player${
            requiredPlayers === 1
              ? ""
              : "s"
          }.`
        );

        return prev;
      }

      return {
        ...prev,
        playerIds: [
          ...prev.playerIds,
          id,
        ],
      };
    });
  }

  async function createTournament() {
    if (!loggedInPlayer) {
      alert(
        "You must be logged in to create a tournament."
      );

      return;
    }

    if (!draft.tournamentName.trim()) {
      alert(
        "Please enter the tournament name."
      );

      return;
    }

    if (!draft.tournamentDate) {
      alert(
        "Please select the tournament date."
      );

      return;
    }

    if (
      draft.lineupType === "division" &&
      !draft.division
    ) {
      alert(
        "Please select a division."
      );

      return;
    }

    const requiredPlayers =
      getRequiredPlayers(
        draft.tournamentType
      );

    if (
      draft.playerIds.length !==
      requiredPlayers
    ) {
      alert(
        `${draft.tournamentType} requires exactly ${requiredPlayers} selected player${
          requiredPlayers === 1
            ? ""
            : "s"
        }.`
      );

      return;
    }

    const selectedPlayers =
      players.filter((player) =>
        draft.playerIds.includes(
          Number(player.id)
        )
      );

    const payload = {
      storage_row_id: storageRowId,

      tournament_name:
        draft.tournamentName.trim(),

      tournament_date:
        draft.tournamentDate,

      tournament_type:
        draft.tournamentType,

      game_mode:
        draft.gameMode,

      division:
        draft.lineupType ===
        "division"
          ? Number(draft.division)
          : null,

      lineup_type:
        draft.lineupType,

      team_name:
        draft.teamName.trim() ||
        null,

      player_ids:
        selectedPlayers.map(
          (player) =>
            Number(player.id)
        ),

      player_names:
        selectedPlayers.map(
          (player) => player.name
        ),

      status: "active",

      placement: null,

      submitted_by_id:
        Number(loggedInPlayer.id),

      submitted_by_name:
        loggedInPlayer.name,
    };

    const { error } = await supabase
      .from(
        "shadowborn_tournaments"
      )
      .insert(payload);

    if (error) {
      console.error(
        "Tournament create failed:",
        error
      );

      alert(
        "Tournament could not be created.\n\n" +
          error.message
      );

      return;
    }

    resetTournamentDraft();

    setShowCreate(false);

    await loadData();
  }

  function resetMatchDraft(tournament = null) {
  setMatchDraft({
    bracketRound: "Round 1",
    opponent: "",
    result: "W",
    scoreFor: "",
    scoreAgainst: "",
    playerIds: Array.isArray(tournament?.player_ids)
      ? tournament.player_ids.map(Number)
      : [],
  });
}
function toggleMatchPlayer(playerId) {
  const id = Number(playerId);

  setMatchDraft((prev) => {
    const selected = prev.playerIds.includes(id);

    if (selected) {
      return {
        ...prev,
        playerIds: prev.playerIds.filter(
          (selectedId) => selectedId !== id
        ),
      };
    }

    return {
      ...prev,
      playerIds: [...prev.playerIds, id],
    };
  });
}
  async function addMatch(
    tournamentId
  ) {
    if (!loggedInPlayer) {
      alert(
        "You must be logged in to add a match."
      );

      return;
    }

    if (!matchDraft.opponent.trim()) {
      alert(
        "Please enter the opponent."
      );

      return;
    }
if (matchDraft.playerIds.length === 0) {
  alert(
    "Please select the players who played in this match."
  );

  return;
}
    const selectedMatchPlayers = players.filter(
  (player) =>
    matchDraft.playerIds.includes(
      Number(player.id)
    )
);

const payload = {
  storage_row_id: storageRowId,

  tournament_id:
    tournamentId,

  bracket_round:
    matchDraft.bracketRound,

  player_ids:
    selectedMatchPlayers.map(
      (player) => Number(player.id)
    ),

  player_names:
    selectedMatchPlayers.map(
      (player) => player.name
    ),

  opponent:
    matchDraft.opponent.trim(),

  result:
    matchDraft.result,

      score_for:
        Number(
          matchDraft.scoreFor
        ) || 0,

      score_against:
        Number(
          matchDraft.scoreAgainst
        ) || 0,

      submitted_by_id:
        Number(loggedInPlayer.id),

      submitted_by_name:
        loggedInPlayer.name,
    };

    const { error } = await supabase
      .from(
        "shadowborn_tournament_matches"
      )
      .insert(payload);

    if (error) {
      console.error(
        "Match save failed:",
        error
      );

      alert(
        "Match could not be saved.\n\n" +
          error.message
      );

      return;
    }

    resetMatchDraft();

    setAddMatchTournamentId(
      null
    );

    await loadData();
  }

  async function deleteMatch(
    matchId
  ) {
    if (!canAdmin) return;

    const confirmed =
      window.confirm(
        "Delete this tournament match?"
      );

    if (!confirmed) return;

    const { error } = await supabase
      .from(
        "shadowborn_tournament_matches"
      )
      .delete()
      .eq("id", matchId)
      .eq(
        "storage_row_id",
        storageRowId
      );

    if (error) {
      alert(
        "Match could not be deleted.\n\n" +
          error.message
      );

      return;
    }

    await loadData();
  }

  async function finishTournament(
    tournamentId
  ) {
    if (!canAdmin) {
      alert(
        "Only Leader or Co-Leader can complete a tournament."
      );

      return;
    }

    const { error } = await supabase
      .from(
        "shadowborn_tournaments"
      )
      .update({
        status: "completed",

        placement:
          finishPlacement,

        completed_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        tournamentId
      )
      .eq(
        "storage_row_id",
        storageRowId
      );

    if (error) {
      alert(
        "Tournament could not be completed.\n\n" +
          error.message
      );

      return;
    }

    setFinishTournamentId(
      null
    );

    setFinishPlacement("1st");

    await loadData();
  }

  async function reopenTournament(
    tournamentId
  ) {
    if (!canAdmin) return;

    const confirmed =
      window.confirm(
        "Re-open this tournament?\n\nIts final placement will be removed and more matches can be added."
      );

    if (!confirmed) return;

    const { error } = await supabase
      .from(
        "shadowborn_tournaments"
      )
      .update({
        status: "active",
        placement: null,
        completed_at: null,
      })
      .eq(
        "id",
        tournamentId
      )
      .eq(
        "storage_row_id",
        storageRowId
      );

    if (error) {
      alert(
        "Tournament could not be re-opened.\n\n" +
          error.message
      );

      return;
    }

    await loadData();
  }

  async function deleteTournament(
    tournamentId
  ) {
    if (!canAdmin) return;

    const confirmed =
      window.confirm(
        "Delete this entire tournament?\n\nAll matches inside this tournament will also be deleted."
      );

    if (!confirmed) return;

    const { error } = await supabase
      .from(
        "shadowborn_tournaments"
      )
      .delete()
      .eq(
        "id",
        tournamentId
      )
      .eq(
        "storage_row_id",
        storageRowId
      );

    if (error) {
      alert(
        "Tournament could not be deleted.\n\n" +
          error.message
      );

      return;
    }

    await loadData();
  }

  const filteredTournaments =
    useMemo(() => {
      if (
        selectedDivision === "all"
      ) {
        return tournaments;
      }

      if (
        selectedDivision ===
        "custom"
      ) {
        return tournaments.filter(
          (tournament) =>
            !tournament.division
        );
      }

      return tournaments.filter(
        (tournament) =>
          Number(
            tournament.division
          ) ===
          Number(
            selectedDivision
          )
      );
    }, [
      tournaments,
      selectedDivision,
    ]);

  const filteredTournamentIds =
    useMemo(
      () =>
        new Set(
          filteredTournaments.map(
            (tournament) =>
              Number(tournament.id)
          )
        ),
      [filteredTournaments]
    );

  const filteredMatches =
    useMemo(
      () =>
        matches.filter(
          (match) =>
            filteredTournamentIds.has(
              Number(
                match.tournament_id
              )
            )
        ),
      [
        matches,
        filteredTournamentIds,
      ]
    );

  const wins =
    filteredMatches.filter(
      (match) =>
        match.result === "W"
    ).length;

  const losses =
    filteredMatches.filter(
      (match) =>
        match.result === "L"
    ).length;

  const totalMatches =
    wins + losses;

  const winRate =
    totalMatches > 0
      ? Math.round(
          (wins / totalMatches) *
            100
        )
      : 0;

  const completedTournaments =
    filteredTournaments.filter(
      (tournament) =>
        tournament.status ===
        "completed"
    );

  const bestPlacement =
    useMemo(() => {
      const placements =
        completedTournaments
          .map((tournament) => ({
            original:
              tournament.placement,

            number:
              placementNumber(
                tournament.placement
              ),
          }))
          .filter(
            (item) =>
              item.original &&
              item.number !== null
          )
          .sort(
            (a, b) =>
              a.number -
              b.number
          );

      return placements.length
        ? placements[0].original
        : "—";
    }, [completedTournaments]);

  const playerStats = useMemo(() => {
  return players
    .map((player) => {
      const playerId = Number(player.id);

      // Find every tournament where this player:
      // 1. was in the original lineup, OR
      // 2. played at least one individual match as a substitute.
      const playerTournaments = tournaments.filter(
        (tournament) => {
          const originalLineupIncludesPlayer =
            Array.isArray(tournament.player_ids) &&
            tournament.player_ids
              .map(Number)
              .includes(playerId);

          const playedMatchInTournament =
            matches.some((match) => {
              if (
                Number(match.tournament_id) !==
                Number(tournament.id)
              ) {
                return false;
              }

              return (
                Array.isArray(match.player_ids) &&
                match.player_ids
                  .map(Number)
                  .includes(playerId)
              );
            });

          return (
            originalLineupIncludesPlayer ||
            playedMatchInTournament
          );
        }
      );

      const playerTournamentIds = new Set(
        playerTournaments.map((tournament) =>
          Number(tournament.id)
        )
      );

      // Only count matches the player actually played.
      const playerMatches = matches.filter((match) => {
        if (
          !playerTournamentIds.has(
            Number(match.tournament_id)
          )
        ) {
          return false;
        }

        // New matches use individual match lineups.
        if (
          Array.isArray(match.player_ids) &&
          match.player_ids.length > 0
        ) {
          return match.player_ids
            .map(Number)
            .includes(playerId);
        }

        // Backwards compatibility:
        // old matches without player_ids count for
        // players in the tournament's original lineup.
        const tournament = tournaments.find(
          (item) =>
            Number(item.id) ===
            Number(match.tournament_id)
        );

        return (
          Array.isArray(tournament?.player_ids) &&
          tournament.player_ids
            .map(Number)
            .includes(playerId)
        );
      });

      const playerWins = playerMatches.filter(
        (match) => match.result === "W"
      ).length;

      const playerLosses = playerMatches.filter(
        (match) => match.result === "L"
      ).length;

      const playerMatchCount =
        playerWins + playerLosses;

      const completedPlayerTournaments =
        playerTournaments.filter(
          (tournament) =>
            tournament.status === "completed"
        );

      const placements = completedPlayerTournaments
        .map(
          (tournament) =>
            tournament.placement
        )
        .filter(Boolean)
        .sort(
          (a, b) =>
            (placementNumber(a) ?? 999) -
            (placementNumber(b) ?? 999)
        );

      return {
        id: player.id,

        name: player.name,

        avatar:
          player.avatar ||
          player.cardPhoto ||
          "",

        division:
          Number(player.division || 0),

        appearances:
          playerTournaments.length,

        played:
          playerMatchCount,

        wins:
          playerWins,

        losses:
          playerLosses,

        winRate:
          playerMatchCount > 0
            ? Math.round(
                (playerWins /
                  playerMatchCount) *
                  100
              )
            : 0,

        bestFinish:
          placements[0] || "—",
      };
    })
    .filter(
      (player) =>
        player.appearances > 0 ||
        player.played > 0
    )
    .sort(
      (a, b) =>
        b.winRate - a.winRate ||
        b.played - a.played ||
        b.wins - a.wins
    );
}, [players, tournaments, matches]);
  const visiblePlayerStats =
    selectedDivision ===
      "all" ||
    selectedDivision ===
      "custom"
      ? playerStats
      : playerStats.filter(
          (player) =>
            Number(
              player.division
            ) ===
            Number(
              selectedDivision
            )
        );

  return (
    <div
      style={{
        display: "grid",
        gap: 18,
      }}
    >
      {/* HEADER */}

      <div
        style={{
          ...glassCard,
          padding: "24px 26px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background:
              "rgba(126,34,206,0.12)",
            filter: "blur(70px)",
            top: -120,
            right: 30,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: 10,
                color: "#c084fc",
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: 0.8,
                marginBottom: 10,
              }}
            >
              <Trophy size={17} />
              COMPETITIVE RECORDS
            </div>

            <h1
              style={{
                margin: 0,
                color: "#fff",
                fontSize:
                  "clamp(25px, 4vw, 36px)",
                fontWeight: 950,
                letterSpacing: -0.8,
              }}
            >
              Tournament Results
            </h1>

            <div
              style={{
                color: "#a99db9",
                marginTop: 8,
                maxWidth: 700,
                lineHeight: 1.6,
              }}
            >
              Track tournament
              appearances, bracket
              matches, team performance
              and player records.
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCreate(
                (prev) => !prev
              )
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 16px",
              borderRadius: 12,
              border:
                "1px solid rgba(192,132,252,0.30)",
              background:
                "rgba(126,34,206,0.17)",
              color: "#e9d5ff",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            {showCreate ? (
              <X size={17} />
            ) : (
              <Plus size={17} />
            )}

            {showCreate
              ? "Close"
              : "Create Tournament"}
          </button>
        </div>
      </div>

      {/* CREATE TOURNAMENT */}

      {showCreate && (
        <div
          style={{
            ...glassCard,
            padding: 22,
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 5,
            }}
          >
            Create Tournament
          </h2>

          <div
            style={{
              color: "#968ba6",
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            Create the tournament once.
            Matches are added as your
            team progresses through the
            bracket.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 14,
            }}
          >
            <div>
              <div>
  <label style={labelStyle}>
    BRACKET ROUND
  </label>

  <select
    value={matchDraft.bracketRound}
    onChange={(e) =>
      setMatchDraft((prev) => ({
        ...prev,
        bracketRound: e.target.value,
      }))
    }
    style={inputStyle}
  >
    <option value="Round 1">
      Round 1
    </option>

    <option value="Round 2">
      Round 2
    </option>

    <option value="Round 3">
      Round 3
    </option>

    <option value="Quarter Final">
      Quarter Final
    </option>

    <option value="Semi Final">
      Semi Final
    </option>

    <option value="Winners Final">
      Winners Final
    </option>

    <option value="Losers Round">
      Losers Round
    </option>

    <option value="Losers Semi Final">
      Losers Semi Final
    </option>

    <option value="Losers Final">
      Losers Final
    </option>

    <option value="Grand Final">
      Grand Final
    </option>
  </select>
</div>
              <label
                style={labelStyle}
              >
                TOURNAMENT NAME
              </label>

              <input
                value={
                  draft.tournamentName
                }
                onChange={(e) =>
                  setDraft(
                    (prev) => ({
                      ...prev,
                      tournamentName:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="Example: ACGL 2v2 SND"
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={labelStyle}
              >
                DATE
              </label>

              <input
                type="date"
                value={
                  draft.tournamentDate
                }
                onChange={(e) =>
                  setDraft(
                    (prev) => ({
                      ...prev,
                      tournamentDate:
                        e.target
                          .value,
                    })
                  )
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={labelStyle}
              >
                FORMAT
              </label>

              <select
                value={
                  draft.tournamentType
                }
                onChange={(e) =>
                  setDraft(
                    (prev) => ({
                      ...prev,
                      tournamentType:
                        e.target
                          .value,
                      playerIds: [],
                    })
                  )
                }
                style={inputStyle}
              >
                <option value="1v1">
                  1v1
                </option>

                <option value="2v2">
                  2v2
                </option>

                <option value="3v3">
                  3v3
                </option>

                <option value="4v4">
                  4v4
                </option>
              </select>
            </div>

            <div>
              <label
                style={labelStyle}
              >
                MODE
              </label>

              <select
                value={
                  draft.gameMode
                }
                onChange={(e) =>
                  setDraft(
                    (prev) => ({
                      ...prev,
                      gameMode:
                        e.target
                          .value,
                    })
                  )
                }
                style={inputStyle}
              >
                <option value="SND">
                  Search & Destroy
                </option>

                <option value="Hardpoint">
                  Hardpoint
                </option>

                <option value="Overload">
                  Overload
                </option>

                <option value="Mixed CDL">
                  Mixed / CDL
                </option>
              </select>
            </div>
          </div>

          <div
            style={{
              marginTop: 22,
              paddingTop: 20,
              borderTop:
                "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <label
              style={labelStyle}
            >
              LINEUP TYPE
            </label>

            <div
              style={{
                display: "flex",
                gap: 9,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setDraft(
                    (prev) => ({
                      ...prev,
                      lineupType:
                        "division",
                      playerIds: [],
                    })
                  )
                }
                style={{
                  padding:
                    "10px 14px",
                  borderRadius: 11,
                  cursor: "pointer",
                  fontWeight: 850,

                  color:
                    draft.lineupType ===
                    "division"
                      ? "#fff"
                      : "#aaa0b8",

                  border:
                    draft.lineupType ===
                    "division"
                      ? "1px solid rgba(192,132,252,0.40)"
                      : "1px solid rgba(255,255,255,0.08)",

                  background:
                    draft.lineupType ===
                    "division"
                      ? "rgba(126,34,206,0.22)"
                      : "rgba(255,255,255,0.035)",
                }}
              >
                Division Team
              </button>

              <button
                type="button"
                onClick={() =>
                  setDraft(
                    (prev) => ({
                      ...prev,
                      lineupType:
                        "custom",
                      division: "",
                      playerIds: [],
                    })
                  )
                }
                style={{
                  padding:
                    "10px 14px",
                  borderRadius: 11,
                  cursor: "pointer",
                  fontWeight: 850,

                  color:
                    draft.lineupType ===
                    "custom"
                      ? "#fff"
                      : "#aaa0b8",

                  border:
                    draft.lineupType ===
                    "custom"
                      ? "1px solid rgba(192,132,252,0.40)"
                      : "1px solid rgba(255,255,255,0.08)",

                  background:
                    draft.lineupType ===
                    "custom"
                      ? "rgba(126,34,206,0.22)"
                      : "rgba(255,255,255,0.035)",
                }}
              >
                Custom Lineup
              </button>
            </div>
          </div>

          {draft.lineupType ===
            "division" && (
            <div
              style={{
                marginTop: 16,
                maxWidth: 300,
              }}
            >
              <label
                style={labelStyle}
              >
                DIVISION
              </label>

              <select
                value={
                  draft.division
                }
                onChange={(e) =>
                  setDraft(
                    (prev) => ({
                      ...prev,
                      division:
                        e.target
                          .value,
                      playerIds: [],
                    })
                  )
                }
                style={inputStyle}
              >
                <option value="">
                  Select division
                </option>

                {divisions.map(
                  (division) => (
                    <option
                      key={
                        division
                      }
                      value={
                        division
                      }
                    >
                      Division{" "}
                      {division}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          <div
            style={{
              marginTop: 20,
            }}
          >
            <label
              style={labelStyle}
            >
              SELECT{" "}
              {getRequiredPlayers(
                draft.tournamentType
              )}{" "}
              PLAYER
              {getRequiredPlayers(
                draft.tournamentType
              ) === 1
                ? ""
                : "S"}
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(170px, 1fr))",
                gap: 9,
              }}
            >
              {availablePlayers.map(
                (player) => {
                  const selected =
                    draft.playerIds.includes(
                      Number(
                        player.id
                      )
                    );

                  return (
                    <button
                      type="button"
                      key={
                        player.id
                      }
                      onClick={() =>
                        togglePlayer(
                          player.id
                        )
                      }
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: 10,
                        padding: 10,
                        borderRadius: 12,
                        cursor:
                          "pointer",
                        textAlign:
                          "left",

                        border:
                          selected
                            ? "1px solid rgba(192,132,252,0.38)"
                            : "1px solid rgba(255,255,255,0.07)",

                        background:
                          selected
                            ? "rgba(126,34,206,0.16)"
                            : "rgba(255,255,255,0.025)",

                        color: "#fff",
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius:
                            "50%",
                          overflow:
                            "hidden",
                          background:
                            "rgba(255,255,255,0.08)",
                          flexShrink: 0,
                          display:
                            "grid",
                          placeItems:
                            "center",
                          fontWeight:
                            900,
                        }}
                      >
                        {player.avatar ||
                        player.cardPhoto ? (
                          <img
                            src={
                              player.avatar ||
                              player.cardPhoto
                            }
                            alt=""
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "cover",
                            }}
                          />
                        ) : (
                          player
                            .name?.[0]
                        )}
                      </div>

                      <div>
                        <div
                          style={{
                            fontWeight:
                              850,
                          }}
                        >
                          {
                            player.name
                          }
                        </div>

                        <div
                          style={{
                            color:
                              "#8f849e",
                            fontSize:
                              11,
                          }}
                        >
                          {selected
                            ? "Selected"
                            : `Division ${
                                player.division ||
                                "—"
                              }`}
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              maxWidth: 400,
            }}
          >
            <label
              style={labelStyle}
            >
              TEAM NAME
            </label>

            <input
              value={
                draft.teamName
              }
              onChange={(e) =>
                setDraft(
                  (prev) => ({
                    ...prev,
                    teamName:
                      e.target.value,
                  })
                )
              }
              placeholder="Example: SBZA Ghost"
              style={inputStyle}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
              marginTop: 22,
            }}
          >
            <button
              type="button"
              onClick={
                createTournament
              }
              style={{
                padding:
                  "12px 20px",
                borderRadius: 12,
                border:
                  "1px solid rgba(192,132,252,0.40)",
                background:
                  "linear-gradient(135deg, rgba(109,40,217,0.90), rgba(147,51,234,0.90))",
                color: "#fff",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Create Tournament
            </button>
          </div>
        </div>
      )}

      {/* FILTER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "flex-end",
        }}
      >
        <div
          style={{
            minWidth: 220,
            position: "relative",
          }}
        >
          <ChevronDown
            size={16}
            style={{
              position: "absolute",
              right: 12,
              top: 13,
              pointerEvents:
                "none",
              color: "#9d91ad",
            }}
          />

          <select
            value={
              selectedDivision
            }
            onChange={(e) =>
              setSelectedDivision(
                e.target.value
              )
            }
            style={{
              ...inputStyle,
              appearance: "none",
              paddingRight: 35,
            }}
          >
            <option value="all">
              All Shadowborn Teams
            </option>

            {divisions.map(
              (division) => (
                <option
                  key={
                    division
                  }
                  value={
                    division
                  }
                >
                  Division{" "}
                  {division}
                </option>
              )
            )}

            <option value="custom">
              Custom Teams
            </option>
          </select>
        </div>
      </div>

      {/* OVERALL STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12,
        }}
      >
        <StatCard
          icon={
            <Trophy size={20} />
          }
          value={
            filteredTournaments.length
          }
          label="Tournament Appearances"
        />

        <StatCard
          icon={
            <Swords size={20} />
          }
          value={wins}
          label="Match Wins"
          accent="#4ade80"
        />

        <StatCard
          icon={<X size={20} />}
          value={losses}
          label="Match Losses"
          accent="#fb7185"
        />

        <StatCard
          icon={
            <Target size={20} />
          }
          value={`${winRate}%`}
          label="Match Win Rate"
        />

        <StatCard
          icon={
            <Medal size={20} />
          }
          value={bestPlacement}
          label="Best Placement"
          accent="#fbbf24"
        />
      </div>

      {/* TOURNAMENTS */}

      <div
        style={{
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            color: "#fff",
            fontWeight: 900,
            fontSize: 16,
            paddingLeft: 3,
          }}
        >
          Tournament History
        </div>

        {loading ? (
          <div
            style={{
              ...glassCard,
              padding: 30,
              textAlign: "center",
              color: "#968ba6",
            }}
          >
            Loading tournaments...
          </div>
        ) : filteredTournaments.length ===
          0 ? (
          <div
            style={{
              ...glassCard,
              padding: 35,
              textAlign: "center",
              color: "#968ba6",
            }}
          >
            No tournaments recorded yet.
          </div>
        ) : (
          filteredTournaments.map(
            (tournament) => {
              const tournamentMatches =
                matches.filter(
                  (match) =>
                    Number(
                      match.tournament_id
                    ) ===
                    Number(
                      tournament.id
                    )
                );

              const tournamentWins =
                tournamentMatches.filter(
                  (match) =>
                    match.result ===
                    "W"
                ).length;

              const tournamentLosses =
                tournamentMatches.filter(
                  (match) =>
                    match.result ===
                    "L"
                ).length;

              const isOpen =
                openTournamentId ===
                tournament.id;

              const active =
                tournament.status ===
                "active";

              return (
                <div
                  key={
                    tournament.id
                  }
                  style={{
                    ...glassCard,
                    overflow:
                      "hidden",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenTournamentId(
                        isOpen
                          ? null
                          : tournament.id
                      )
                    }
                    style={{
                      width: "100%",
                      padding:
                        "20px 22px",
                      border: "none",
                      background:
                        "transparent",
                      color: "#fff",
                      cursor:
                        "pointer",
                      textAlign:
                        "left",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap: 16,
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display:
                              "flex",
                            gap: 8,
                            alignItems:
                              "center",
                            flexWrap:
                              "wrap",
                            marginBottom:
                              8,
                          }}
                        >
                          <span
                            style={{
                              padding:
                                "5px 9px",
                              borderRadius:
                                999,
                              fontSize:
                                10,
                              fontWeight:
                                900,
                              letterSpacing:
                                0.5,

                              color:
                                active
                                  ? "#86efac"
                                  : "#e9d5ff",

                              background:
                                active
                                  ? "rgba(34,197,94,0.10)"
                                  : "rgba(147,51,234,0.12)",

                              border:
                                active
                                  ? "1px solid rgba(34,197,94,0.20)"
                                  : "1px solid rgba(192,132,252,0.18)",
                            }}
                          >
                            {active
                              ? "ACTIVE"
                              : "COMPLETED"}
                          </span>

                          <span
                            style={{
                              color:
                                "#81768f",
                              fontSize:
                                12,
                            }}
                          >
                            {formatDate(
                              tournament.tournament_date
                            )}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize:
                              20,
                            fontWeight:
                              950,
                          }}
                        >
                          {
                            tournament.tournament_name
                          }
                        </div>

                        <div
                          style={{
                            color:
                              "#9e93aa",
                            fontSize:
                              12,
                            marginTop:
                              5,
                          }}
                        >
                          {tournament.team_name ||
                            (tournament.division
                              ? `Division ${tournament.division}`
                              : "Custom Team")}

                          {" • "}

                          {tournament.tournament_type}

                          {" • "}

                          {
                            tournament.game_mode
                          }
                        </div>

                        <div
                          style={{
                            color:
                              "#756a82",
                            fontSize:
                              11,
                            marginTop:
                              4,
                          }}
                        >
                          {Array.isArray(
                            tournament.player_names
                          )
                            ? tournament.player_names.join(
                                " • "
                              )
                            : ""}
                        </div>
                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          gap: 22,
                          alignItems:
                            "center",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <div
                          style={{
                            textAlign:
                              "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize:
                                20,
                              fontWeight:
                                950,
                            }}
                          >
                            <span
                              style={{
                                color:
                                  "#4ade80",
                              }}
                            >
                              {
                                tournamentWins
                              }
                            </span>

                            {" - "}

                            <span
                              style={{
                                color:
                                  "#fb7185",
                              }}
                            >
                              {
                                tournamentLosses
                              }
                            </span>
                          </div>

                          <div
                            style={{
                              color:
                                "#746a81",
                              fontSize:
                                10,
                              marginTop:
                                3,
                            }}
                          >
                            MATCH RECORD
                          </div>
                        </div>

                        {!active && (
                          <div
                            style={{
                              textAlign:
                                "center",
                            }}
                          >
                            <div
                              style={{
                                color:
                                  "#fbbf24",
                                fontSize:
                                  20,
                                fontWeight:
                                  950,
                              }}
                            >
                              {
                                tournament.placement
                              }
                            </div>

                            <div
                              style={{
                                color:
                                  "#746a81",
                                fontSize:
                                  10,
                                marginTop:
                                  3,
                              }}
                            >
                              FINAL PLACE
                            </div>
                          </div>
                        )}

                        <ChevronDown
                          size={18}
                          style={{
                            transform:
                              isOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            transition:
                              "0.2s ease",
                            color:
                              "#a78bfa",
                          }}
                        />
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        borderTop:
                          "1px solid rgba(255,255,255,0.06)",
                        padding:
                          "18px 22px 22px",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap: 12,
                          flexWrap:
                            "wrap",
                          marginBottom:
                            14,
                        }}
                      >
                        <div
                          style={{
                            fontWeight:
                              900,
                          }}
                        >
                          Bracket Matches
                        </div>

                        {active && (
                          <button
                            type="button"
                            onClick={() => {
  setAddMatchTournamentId(
    tournament.id
  );

  resetMatchDraft(tournament);
}}
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              gap: 7,
                              padding:
                                "9px 12px",
                              borderRadius:
                                10,
                              border:
                                "1px solid rgba(192,132,252,0.25)",
                              background:
                                "rgba(126,34,206,0.12)",
                              color:
                                "#e9d5ff",
                              cursor:
                                "pointer",
                              fontWeight:
                                850,
                            }}
                          >
                            <Plus
                              size={
                                15
                              }
                            />
                            Add Match
                          </button>
                        )}
                      </div>

                      {tournamentMatches.length ===
                      0 ? (
                        <div
                          style={{
                            padding:
                              "18px",
                            borderRadius:
                              14,
                            background:
                              "rgba(255,255,255,0.02)",
                            border:
                              "1px solid rgba(255,255,255,0.05)",
                            color:
                              "#877c94",
                            textAlign:
                              "center",
                          }}
                        >
                          No bracket matches
                          recorded yet.
                        </div>
                      ) : (
                        <div
                          style={{
                            display:
                              "grid",
                            gap: 8,
                          }}
                        >
                          {tournamentMatches.map(
                            (
                              match,
                              index
                            ) => (
                              <div
                                key={
                                  match.id
                                }
                                style={{
                                  display:
                                    "grid",
                                  gridTemplateColumns:
                                    "50px minmax(160px,1fr) 90px 90px 40px",
                                  gap: 10,
                                  alignItems:
                                    "center",
                                  padding:
                                    "11px 12px",
                                  borderRadius:
                                    12,
                                  background:
                                    "rgba(255,255,255,0.025)",
                                  border:
                                    "1px solid rgba(255,255,255,0.05)",
                                }}
                              >
                                <div
                                  style={{
                                    color:
                                      "#766b83",
                                    fontSize:
                                      11,
                                  }}
                                >
                                  #
                                  {index +
                                    1}
                                </div>

                                <div>
                                  <span
                                    style={{
                                      color:
                                        match.result ===
                                        "W"
                                          ? "#4ade80"
                                          : "#fb7185",
                                      fontWeight:
                                        950,
                                      marginRight:
                                        10,
                                    }}
                                  >
                                    {
                                      match.result
                                    }
                                  </span>

                                 <div>
  <div>
    <span
      style={{
        fontWeight: 850,
      }}
    >
      vs {match.opponent}
    </span>
  </div>

  <div
    style={{
      color: "#776c84",
      fontSize: 10,
      marginTop: 3,
    }}
  >
    {match.bracket_round || "Bracket Match"}

    {Array.isArray(match.player_names) &&
      match.player_names.length > 0 && (
        <>
          {" • "}
          {match.player_names.join(" / ")}
        </>
      )}
  </div>
</div>
                                </div>

                                <div
                                  style={{
                                    color:
                                      "#978ca5",
                                    fontSize:
                                      11,
                                  }}
                                >
                                  SCORE
                                </div>

                                <div
                                  style={{
                                    fontWeight:
                                      950,
                                  }}
                                >
                                  {
                                    match.score_for
                                  }{" "}
                                  -{" "}
                                  {
                                    match.score_against
                                  }
                                </div>

                                <div>
                                  {canAdmin && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteMatch(
                                          match.id
                                        )
                                      }
                                      title="Delete match"
                                      style={{
                                        width:
                                          32,
                                        height:
                                          32,
                                        borderRadius:
                                          9,
                                        border:
                                          "1px solid rgba(251,113,133,0.18)",
                                        background:
                                          "rgba(251,113,133,0.06)",
                                        color:
                                          "#fb7185",
                                        cursor:
                                          "pointer",
                                        display:
                                          "grid",
                                        placeItems:
                                          "center",
                                      }}
                                    >
                                      <Trash2
                                        size={
                                          14
                                        }
                                      />
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {addMatchTournamentId ===
                        tournament.id &&
                        active && (
                          <div
                            style={{
                              marginTop:
                                15,
                              padding:
                                16,
                              borderRadius:
                                14,
                              background:
                                "rgba(126,34,206,0.055)",
                              border:
                                "1px solid rgba(192,132,252,0.12)",
                            }}
                          >
                            <div
                              style={{
                                fontWeight:
                                  900,
                                marginBottom:
                                  14,
                              }}
                            >
                              Add Bracket Match
                            </div>

                            <div
                              style={{
                                display:
                                  "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fit, minmax(150px, 1fr))",
                                gap: 12,
                              }}
                            >
                              <div>
                                <label
                                  style={
                                    labelStyle
                                  }
                                >
                                  OPPONENT
                                </label>

                                <input
                                  value={
                                    matchDraft.opponent
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setMatchDraft(
                                      (
                                        prev
                                      ) => ({
                                        ...prev,
                                        opponent:
                                          e
                                            .target
                                            .value,
                                      })
                                    )
                                  }
                                  placeholder="Opponent clan/team"
                                  style={
                                    inputStyle
                                  }
                                />
                              </div>

                              <div>
                                <label
                                  style={
                                    labelStyle
                                  }
                                >
                                  RESULT
                                </label>

                                <select
                                  value={
                                    matchDraft.result
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setMatchDraft(
                                      (
                                        prev
                                      ) => ({
                                        ...prev,
                                        result:
                                          e
                                            .target
                                            .value,
                                      })
                                    )
                                  }
                                  style={
                                    inputStyle
                                  }
                                >
                                  <option value="W">
                                    Win
                                  </option>

                                  <option value="L">
                                    Loss
                                  </option>
                                </select>
                              </div>

                              <div>
                                <label
                                  style={
                                    labelStyle
                                  }
                                >
                                  OUR SCORE
                                </label>

                                <input
                                  type="number"
                                  min="0"
                                  value={
                                    matchDraft.scoreFor
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setMatchDraft(
                                      (
                                        prev
                                      ) => ({
                                        ...prev,
                                        scoreFor:
                                          e
                                            .target
                                            .value,
                                      })
                                    )
                                  }
                                  style={
                                    inputStyle
                                  }
                                />
                              </div>

                              <div>
                                <label
                                  style={
                                    labelStyle
                                  }
                                >
                                  THEIR SCORE
                                </label>

                                <input
                                  type="number"
                                  min="0"
                                  value={
                                    matchDraft.scoreAgainst
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setMatchDraft(
                                      (
                                        prev
                                      ) => ({
                                        ...prev,
                                        scoreAgainst:
                                          e
                                            .target
                                            .value,
                                      })
                                    )
                                  }
                                  style={
                                    inputStyle
                                  }
                                />
                              </div>
                            </div>
<div
  style={{
    marginTop: 16,
  }}
>
  <label style={labelStyle}>
    PLAYERS IN THIS MATCH
  </label>

  <div
    style={{
      color: "#81768f",
      fontSize: 11,
      marginBottom: 10,
    }}
  >
    The tournament lineup is selected automatically.
    Change it only if a substitute played this match.
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(170px, 1fr))",
      gap: 8,
    }}
  >
    {players.map((player) => {
      const selected =
        matchDraft.playerIds.includes(
          Number(player.id)
        );

      return (
        <button
          type="button"
          key={player.id}
          onClick={() =>
            toggleMatchPlayer(player.id)
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: 9,
            borderRadius: 11,
            cursor: "pointer",
            textAlign: "left",

            border: selected
              ? "1px solid rgba(192,132,252,0.38)"
              : "1px solid rgba(255,255,255,0.07)",

            background: selected
              ? "rgba(126,34,206,0.16)"
              : "rgba(255,255,255,0.025)",

            color: "#fff",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              overflow: "hidden",
              background:
                "rgba(255,255,255,0.08)",
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
            }}
          >
            {player.avatar ||
            player.cardPhoto ? (
              <img
                src={
                  player.avatar ||
                  player.cardPhoto
                }
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              player.name?.[0]
            )}
          </div>

          <div>
            <div
              style={{
                fontWeight: 850,
                fontSize: 12,
              }}
            >
              {player.name}
            </div>

            <div
              style={{
                color: "#80758d",
                fontSize: 10,
              }}
            >
              {selected
                ? "Playing"
                : "Not selected"}
            </div>
          </div>
        </button>
      );
    })}
  </div>
</div>
                            <div
                              style={{
                                display:
                                  "flex",
                                justifyContent:
                                  "flex-end",
                                gap: 9,
                                marginTop:
                                  14,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setAddMatchTournamentId(
                                    null
                                  )
                                }
                                style={{
                                  padding:
                                    "9px 13px",
                                  borderRadius:
                                    10,
                                  border:
                                    "1px solid rgba(255,255,255,0.08)",
                                  background:
                                    "rgba(255,255,255,0.035)",
                                  color:
                                    "#c4b9cf",
                                  cursor:
                                    "pointer",
                                }}
                              >
                                Cancel
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  addMatch(
                                    tournament.id
                                  )
                                }
                                style={{
                                  padding:
                                    "9px 15px",
                                  borderRadius:
                                    10,
                                  border:
                                    "1px solid rgba(192,132,252,0.25)",
                                  background:
                                    "rgba(126,34,206,0.18)",
                                  color:
                                    "#fff",
                                  cursor:
                                    "pointer",
                                  fontWeight:
                                    900,
                                }}
                              >
                                Save Match
                              </button>
                            </div>
                          </div>
                        )}

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          flexWrap:
                            "wrap",
                          gap: 10,
                          marginTop:
                            18,
                          paddingTop:
                            17,
                          borderTop:
                            "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 8,
                            color:
                              active
                                ? "#86efac"
                                : "#c4b5fd",
                            fontSize:
                              12,
                            fontWeight:
                              850,
                          }}
                        >
                          {active ? (
                            <>
                              <Clock3
                                size={
                                  16
                                }
                              />
                              Tournament still
                              in progress
                            </>
                          ) : (
                            <>
                              <CheckCircle2
                                size={
                                  16
                                }
                              />
                              Tournament
                              completed •{" "}
                              {
                                tournament.placement
                              }
                            </>
                          )}
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            gap: 9,
                            flexWrap:
                              "wrap",
                          }}
                        >
                          {canAdmin &&
                            active && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFinishTournamentId(
                                    tournament.id
                                  );

                                  setFinishPlacement(
                                    "1st"
                                  );
                                }}
                                style={{
                                  display:
                                    "inline-flex",
                                  alignItems:
                                    "center",
                                  gap: 7,
                                  padding:
                                    "9px 13px",
                                  borderRadius:
                                    10,
                                  border:
                                    "1px solid rgba(251,191,36,0.22)",
                                  background:
                                    "rgba(251,191,36,0.07)",
                                  color:
                                    "#fbbf24",
                                  cursor:
                                    "pointer",
                                  fontWeight:
                                    900,
                                }}
                              >
                                <Flag
                                  size={
                                    15
                                  }
                                />
                                Finish Tournament
                              </button>
                            )}

                          {canAdmin &&
                            !active && (
                              <button
                                type="button"
                                onClick={() =>
                                  reopenTournament(
                                    tournament.id
                                  )
                                }
                                style={{
                                  padding:
                                    "9px 13px",
                                  borderRadius:
                                    10,
                                  border:
                                    "1px solid rgba(192,132,252,0.18)",
                                  background:
                                    "rgba(126,34,206,0.07)",
                                  color:
                                    "#d8b4fe",
                                  cursor:
                                    "pointer",
                                  fontWeight:
                                    850,
                                }}
                              >
                                Re-open
                              </button>
                            )}

                          {canAdmin && (
                            <button
                              type="button"
                              onClick={() =>
                                deleteTournament(
                                  tournament.id
                                )
                              }
                              style={{
                                display:
                                  "inline-flex",
                                alignItems:
                                  "center",
                                gap: 6,
                                padding:
                                  "9px 13px",
                                borderRadius:
                                  10,
                                border:
                                  "1px solid rgba(251,113,133,0.16)",
                                background:
                                  "rgba(251,113,133,0.05)",
                                color:
                                  "#fb7185",
                                cursor:
                                  "pointer",
                                fontWeight:
                                  850,
                              }}
                            >
                              <Trash2
                                size={
                                  14
                                }
                              />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>

                      {finishTournamentId ===
                        tournament.id &&
                        active && (
                          <div
                            style={{
                              marginTop:
                                15,
                              padding:
                                16,
                              borderRadius:
                                14,
                              border:
                                "1px solid rgba(251,191,36,0.17)",
                              background:
                                "rgba(251,191,36,0.04)",
                            }}
                          >
                            <div
                              style={{
                                fontWeight:
                                  900,
                                marginBottom:
                                  5,
                              }}
                            >
                              Complete Tournament
                            </div>

                            <div
                              style={{
                                color:
                                  "#8f849c",
                                fontSize:
                                  12,
                                marginBottom:
                                  14,
                              }}
                            >
                              Only enter
                              placement once
                              your bracket run
                              has officially
                              ended.
                            </div>

                            <div
                              style={{
                                display:
                                  "flex",
                                gap: 10,
                                alignItems:
                                  "flex-end",
                                flexWrap:
                                  "wrap",
                              }}
                            >
                              <div
                                style={{
                                  minWidth:
                                    180,
                                }}
                              >
                                <label
                                  style={
                                    labelStyle
                                  }
                                >
                                  FINAL PLACEMENT
                                </label>

                                <select
                                  value={
                                    finishPlacement
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setFinishPlacement(
                                      e
                                        .target
                                        .value
                                    )
                                  }
                                  style={
                                    inputStyle
                                  }
                                >
                                  <option value="1st">
                                    1st
                                  </option>

                                  <option value="2nd">
                                    2nd
                                  </option>

                                  <option value="3rd">
                                    3rd
                                  </option>

                                  <option value="4th">
                                    4th
                                  </option>

                                  <option value="5th-6th">
                                    5th-6th
                                  </option>

                                  <option value="7th-8th">
                                    7th-8th
                                  </option>

                                  <option value="9th-12th">
                                    9th-12th
                                  </option>

                                  <option value="13th-16th">
                                    13th-16th
                                  </option>
                                </select>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  finishTournament(
                                    tournament.id
                                  )
                                }
                                style={{
                                  padding:
                                    "12px 16px",
                                  borderRadius:
                                    10,
                                  border:
                                    "1px solid rgba(251,191,36,0.25)",
                                  background:
                                    "rgba(251,191,36,0.10)",
                                  color:
                                    "#fde68a",
                                  cursor:
                                    "pointer",
                                  fontWeight:
                                    900,
                                }}
                              >
                                Confirm Finish
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setFinishTournamentId(
                                    null
                                  )
                                }
                                style={{
                                  padding:
                                    "12px 14px",
                                  borderRadius:
                                    10,
                                  border:
                                    "1px solid rgba(255,255,255,0.08)",
                                  background:
                                    "rgba(255,255,255,0.03)",
                                  color:
                                    "#aaa0b5",
                                  cursor:
                                    "pointer",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              );
            }
          )
        )}
      </div>

      {/* PLAYER PERFORMANCE */}

      <div
        style={{
          ...glassCard,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding:
              "18px 20px",
            borderBottom:
              "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems:
              "center",
            gap: 9,
          }}
        >
          <Users
            size={18}
            color="#c084fc"
          />

          <div
            style={{
              fontWeight: 900,
              fontSize: 15,
            }}
          >
            Player Tournament
            Performance
          </div>
        </div>

        {visiblePlayerStats.length ===
        0 ? (
          <div
            style={{
              padding: 30,
              textAlign: "center",
              color: "#968ba6",
            }}
          >
            Player statistics will
            appear once tournaments
            are created.
          </div>
        ) : (
          <div
            style={{
              overflowX:
                "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                minWidth: 820,
              }}
            >
              <thead>
                <tr>
                  {[
                    "Player",
                    "Tournaments",
                    "Matches",
                    "Wins",
                    "Losses",
                    "W/L",
                    "Win Rate",
                    "Best Finish",
                  ].map(
                    (heading) => (
                      <th
                        key={
                          heading
                        }
                        style={{
                          padding:
                            "12px 16px",
                          textAlign:
                            "left",
                          color:
                            "#887c98",
                          fontSize:
                            11,
                          textTransform:
                            "uppercase",
                          borderBottom:
                            "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        {
                          heading
                        }
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {visiblePlayerStats.map(
                  (player) => (
                    <tr
                      key={
                        player.id
                      }
                    >
                      <td
                        style={{
                          padding:
                            "13px 16px",
                          borderBottom:
                            "1px solid rgba(255,255,255,0.045)",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius:
                                "50%",
                              overflow:
                                "hidden",
                              display:
                                "grid",
                              placeItems:
                                "center",
                              background:
                                "rgba(255,255,255,0.07)",
                              fontWeight:
                                900,
                            }}
                          >
                            {player.avatar ? (
                              <img
                                src={
                                  player.avatar
                                }
                                alt=""
                                style={{
                                  width:
                                    "100%",
                                  height:
                                    "100%",
                                  objectFit:
                                    "cover",
                                }}
                              />
                            ) : (
                              player
                                .name?.[0]
                            )}
                          </div>

                          <div>
                            <div
                              style={{
                                fontWeight:
                                  850,
                              }}
                            >
                              {
                                player.name
                              }
                            </div>

                            <div
                              style={{
                                color:
                                  "#786d86",
                                fontSize:
                                  11,
                              }}
                            >
                              {player.division
                                ? `Division ${player.division}`
                                : ""}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td
                        style={{
                          padding:
                            "13px 16px",
                          borderBottom:
                            "1px solid rgba(255,255,255,0.045)",
                        }}
                      >
                        {
                          player.appearances
                        }
                      </td>

                      <td
                        style={{
                          padding:
                            "13px 16px",
                          borderBottom:
                            "1px solid rgba(255,255,255,0.045)",
                        }}
                      >
                        {
                          player.played
                        }
                      </td>

                      <td
                        style={{
                          padding:
                            "13px 16px",
                          color:
                            "#4ade80",
                          fontWeight:
                            850,
                          borderBottom:
                            "1px solid rgba(255,255,255,0.045)",
                        }}
                      >
                        {
                          player.wins
                        }
                      </td>

                      <td
                        style={{
                          padding:
                            "13px 16px",
                          color:
                            "#fb7185",
                          fontWeight:
                            850,
                          borderBottom:
                            "1px solid rgba(255,255,255,0.045)",
                        }}
                      >
                        {
                          player.losses
                        }
                      </td>

                      <td
                        style={{
                          padding:
                            "13px 16px",
                          fontWeight:
                            850,
                          borderBottom:
                            "1px solid rgba(255,255,255,0.045)",
                        }}
                      >
                        {
                          player.wins
                        }{" "}
                        -{" "}
                        {
                          player.losses
                        }
                      </td>

                      <td
                        style={{
                          padding:
                            "13px 16px",
                          color:
                            player.winRate >=
                            60
                              ? "#4ade80"
                              : player.winRate <
                                40
                              ? "#fb7185"
                              : "#c084fc",
                          fontWeight:
                            950,
                          borderBottom:
                            "1px solid rgba(255,255,255,0.045)",
                        }}
                      >
                        {
                          player.winRate
                        }
                        %
                      </td>

                      <td
                        style={{
                          padding:
                            "13px 16px",
                          color:
                            "#fbbf24",
                          fontWeight:
                            900,
                          borderBottom:
                            "1px solid rgba(255,255,255,0.045)",
                        }}
                      >
                        {
                          player.bestFinish
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}