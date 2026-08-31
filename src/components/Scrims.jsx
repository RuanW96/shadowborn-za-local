import { useEffect, useMemo, useState } from "react";
import {
  Swords,
  Plus,
  X,
  Users,
  Target,
  Trophy,
  Trash2,
  ChevronDown,
  Clock3,
  CheckCircle2,
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

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(`${date}T12:00:00`);

  return parsed.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontSize: 25,
            fontWeight: 950,
          }}
        >
          {value}
        </div>

        <div
          style={{
            color: "#968ba6",
            fontSize: 12,
            marginTop: 5,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

export default function Scrims({
  players = [],
  loggedInPlayer,
  canAdmin,
  storageRowId = 999,
}) {
  const [scrims, setScrims] = useState([]);
  const [maps, setMaps] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);

  const [openScrimId, setOpenScrimId] = useState(null);

  const [addMapScrimId, setAddMapScrimId] = useState(null);

  const [selectedDivision, setSelectedDivision] =
    useState("all");

  const [draft, setDraft] = useState({
    scrimDate: new Date().toISOString().slice(0, 10),
    opponentClan: "",
    lineupType: "division",
    division: "",
    teamName: "",
    playerIds: [],
  });

  const [mapDraft, setMapDraft] = useState({
    gameMode: "Hardpoint",
    mapName: "",
    result: "W",
    scoreFor: "",
    scoreAgainst: "",
    playerIds: [],
  });

  const divisions = useMemo(() => {
    const values = players
      .map((player) => Number(player.division || 0))
      .filter((division) => division > 0);

    return [...new Set(values)].sort((a, b) => a - b);
  }, [players]);

  async function loadData() {
    setLoading(true);

    const [scrimResponse, mapResponse] =
      await Promise.all([
        supabase
          .from("shadowborn_scrims")
          .select("*")
          .eq("storage_row_id", storageRowId)
          .order("scrim_date", { ascending: false })
          .order("created_at", { ascending: false }),

        supabase
          .from("shadowborn_scrim_maps")
          .select("*")
          .eq("storage_row_id", storageRowId)
          .order("map_number", { ascending: true }),
      ]);

    if (scrimResponse.error) {
      alert(
        "Scrims could not load.\n\n" +
          scrimResponse.error.message
      );
    }

    if (mapResponse.error) {
      alert(
        "Scrim maps could not load.\n\n" +
          mapResponse.error.message
      );
    }

    setScrims(scrimResponse.data || []);
    setMaps(mapResponse.data || []);

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
          Number(player.division || 0) ===
          Number(draft.division)
      );
    }

    return players;
  }, [players, draft.lineupType, draft.division]);

  function togglePlayer(playerId) {
    const id = Number(playerId);

    setDraft((prev) => ({
      ...prev,

      playerIds: prev.playerIds.includes(id)
        ? prev.playerIds.filter(
            (selectedId) => selectedId !== id
          )
        : [...prev.playerIds, id],
    }));
  }

  function toggleMapPlayer(playerId) {
    const id = Number(playerId);

    setMapDraft((prev) => ({
      ...prev,

      playerIds: prev.playerIds.includes(id)
        ? prev.playerIds.filter(
            (selectedId) => selectedId !== id
          )
        : [...prev.playerIds, id],
    }));
  }

  function resetDraft() {
    setDraft({
      scrimDate: new Date().toISOString().slice(0, 10),
      opponentClan: "",
      lineupType: "division",
      division: "",
      teamName: "",
      playerIds: [],
    });
  }

  function resetMapDraft(scrim) {
    setMapDraft({
      gameMode: "Hardpoint",
      mapName: "",
      result: "W",
      scoreFor: "",
      scoreAgainst: "",

      playerIds: Array.isArray(scrim?.player_ids)
        ? scrim.player_ids.map(Number)
        : [],
    });
  }

  async function createScrim() {
    if (!loggedInPlayer) {
      alert("You must be logged in.");

      return;
    }

    if (!draft.opponentClan.trim()) {
      alert("Please enter the opponent clan.");

      return;
    }

    if (
      draft.lineupType === "division" &&
      !draft.division
    ) {
      alert("Please select a division.");

      return;
    }

    if (draft.playerIds.length === 0) {
      alert("Please select your scrim lineup.");

      return;
    }

    const selectedPlayers = players.filter((player) =>
      draft.playerIds.includes(Number(player.id))
    );

    const payload = {
      storage_row_id: storageRowId,

      scrim_date: draft.scrimDate,

      opponent_clan: draft.opponentClan.trim(),

      division:
        draft.lineupType === "division"
          ? Number(draft.division)
          : null,

      lineup_type: draft.lineupType,

      team_name: draft.teamName.trim() || null,

      player_ids: selectedPlayers.map((player) =>
        Number(player.id)
      ),

      player_names: selectedPlayers.map(
        (player) => player.name
      ),

      status: "active",

      submitted_by_id: Number(loggedInPlayer.id),

      submitted_by_name: loggedInPlayer.name,
    };

    const { error } = await supabase
      .from("shadowborn_scrims")
      .insert(payload);

    if (error) {
      alert(
        "Scrim could not be created.\n\n" +
          error.message
      );

      return;
    }

    resetDraft();

    setShowCreate(false);

    await loadData();
  }

  async function addMap(scrim) {
    if (!mapDraft.mapName.trim()) {
      alert("Please enter the map name.");

      return;
    }

    if (mapDraft.playerIds.length === 0) {
      alert("Please select who played this map.");

      return;
    }

    const selectedPlayers = players.filter((player) =>
      mapDraft.playerIds.includes(Number(player.id))
    );

    const existingMaps = maps.filter(
      (map) => Number(map.scrim_id) === Number(scrim.id)
    );

    const payload = {
      storage_row_id: storageRowId,

      scrim_id: scrim.id,

      map_number: existingMaps.length + 1,

      game_mode: mapDraft.gameMode,

      map_name: mapDraft.mapName.trim(),

      result: mapDraft.result,

      score_for: Number(mapDraft.scoreFor) || 0,

      score_against:
        Number(mapDraft.scoreAgainst) || 0,

      player_ids: selectedPlayers.map((player) =>
        Number(player.id)
      ),

      player_names: selectedPlayers.map(
        (player) => player.name
      ),

      submitted_by_id: Number(loggedInPlayer.id),

      submitted_by_name: loggedInPlayer.name,
    };

    const { error } = await supabase
      .from("shadowborn_scrim_maps")
      .insert(payload);

    if (error) {
      alert(
        "Scrim map could not be saved.\n\n" +
          error.message
      );

      return;
    }

    setAddMapScrimId(null);

    await loadData();
  }

  async function finishScrim(scrimId) {
    if (!canAdmin) return;

    const { error } = await supabase
      .from("shadowborn_scrims")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", scrimId)
      .eq("storage_row_id", storageRowId);

    if (error) {
      alert(
        "Scrim could not be completed.\n\n" +
          error.message
      );

      return;
    }

    await loadData();
  }

  async function reopenScrim(scrimId) {
    if (!canAdmin) return;

    const confirmed = window.confirm(
      "Re-open this scrim?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("shadowborn_scrims")
      .update({
        status: "active",
        completed_at: null,
      })
      .eq("id", scrimId)
      .eq("storage_row_id", storageRowId);

    if (error) {
      alert(error.message);

      return;
    }

    await loadData();
  }

  async function deleteMap(mapId) {
    if (!canAdmin) return;

    const confirmed = window.confirm(
      "Delete this scrim map?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("shadowborn_scrim_maps")
      .delete()
      .eq("id", mapId)
      .eq("storage_row_id", storageRowId);

    if (error) {
      alert(error.message);

      return;
    }

    await loadData();
  }

  async function deleteScrim(scrimId) {
    if (!canAdmin) return;

    const confirmed = window.confirm(
      "Delete this entire scrim and all its maps?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("shadowborn_scrims")
      .delete()
      .eq("id", scrimId)
      .eq("storage_row_id", storageRowId);

    if (error) {
      alert(error.message);

      return;
    }

    await loadData();
  }

  const filteredScrims = useMemo(() => {
    if (selectedDivision === "all") {
      return scrims;
    }

    if (selectedDivision === "custom") {
      return scrims.filter((scrim) => !scrim.division);
    }

    return scrims.filter(
      (scrim) =>
        Number(scrim.division) ===
        Number(selectedDivision)
    );
  }, [scrims, selectedDivision]);

  const filteredScrimIds = useMemo(
    () =>
      new Set(
        filteredScrims.map((scrim) => Number(scrim.id))
      ),

    [filteredScrims]
  );

  const filteredMaps = useMemo(
    () =>
      maps.filter((map) =>
        filteredScrimIds.has(Number(map.scrim_id))
      ),

    [maps, filteredScrimIds]
  );

  const wins = filteredMaps.filter(
    (map) => map.result === "W"
  ).length;

  const losses = filteredMaps.filter(
    (map) => map.result === "L"
  ).length;

  const totalMaps = wins + losses;

  const mapWinRate =
    totalMaps > 0
      ? Math.round((wins / totalMaps) * 100)
      : 0;

  const completedScrims = filteredScrims.filter(
    (scrim) => scrim.status === "completed"
  ).length;

  const playerStats = useMemo(() => {
    return players
      .map((player) => {
        const playerId = Number(player.id);

        const playerMaps = maps.filter(
          (map) =>
            Array.isArray(map.player_ids) &&
            map.player_ids
              .map(Number)
              .includes(playerId)
        );

        const playerScrimIds = new Set(
          playerMaps.map((map) => Number(map.scrim_id))
        );

        const playerWins = playerMaps.filter(
          (map) => map.result === "W"
        ).length;

        const playerLosses = playerMaps.filter(
          (map) => map.result === "L"
        ).length;

        const played = playerWins + playerLosses;

        return {
          id: player.id,
          name: player.name,

          avatar:
            player.avatar ||
            player.cardPhoto ||
            "",

          division: Number(player.division || 0),

          scrims: playerScrimIds.size,

          maps: played,

          wins: playerWins,

          losses: playerLosses,

          winRate:
            played > 0
              ? Math.round(
                  (playerWins / played) * 100
                )
              : 0,
        };
      })
      .filter((player) => player.maps > 0)
      .sort(
        (a, b) =>
          b.winRate - a.winRate ||
          b.maps - a.maps
      );
  }, [players, maps]);

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
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                color: "#c084fc",
                fontWeight: 900,
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              <Swords size={17} />

              TEAM PRACTICE
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(25px,4vw,36px)",
              }}
            >
              Scrims
            </h1>

            <div
              style={{
                color: "#a99db9",
                marginTop: 8,
              }}
            >
              Track Shadowborn ZA scrim sessions,
              map performance and individual player
              records.
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCreate((prev) => !prev)
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
              : "Create Scrim"}
          </button>
        </div>
      </div>

      {/* CREATE SCRIM */}

      {showCreate && (
        <div
          style={{
            ...glassCard,
            padding: 22,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Create Scrim
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(200px,1fr))",
              gap: 14,
            }}
          >
            <div>
              <label style={labelStyle}>
                DATE
              </label>

              <input
                type="date"
                value={draft.scrimDate}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    scrimDate: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                OPPONENT CLAN
              </label>

              <input
                value={draft.opponentClan}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    opponentClan:
                      e.target.value,
                  }))
                }
                placeholder="Example: LMZA"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                TEAM NAME
              </label>

              <input
                value={draft.teamName}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    teamName: e.target.value,
                  }))
                }
                placeholder="Example: SBZA Main"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <label style={labelStyle}>
              LINEUP TYPE
            </label>

            <div
              style={{
                display: "flex",
                gap: 9,
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    lineupType: "division",
                    playerIds: [],
                  }))
                }
              >
                Division Team
              </button>

              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    lineupType: "custom",
                    division: "",
                    playerIds: [],
                  }))
                }
              >
                Custom Lineup
              </button>
            </div>
          </div>

          {draft.lineupType === "division" && (
            <div
              style={{
                marginTop: 15,
                maxWidth: 280,
              }}
            >
              <label style={labelStyle}>
                DIVISION
              </label>

              <select
                value={draft.division}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    division: e.target.value,
                    playerIds: [],
                  }))
                }
                style={inputStyle}
              >
                <option value="">
                  Select division
                </option>

                {divisions.map((division) => (
                  <option
                    key={division}
                    value={division}
                  >
                    Division {division}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <label style={labelStyle}>
              SCRIM LINEUP
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(170px,1fr))",
                gap: 8,
              }}
            >
              {availablePlayers.map((player) => {
                const selected =
                  draft.playerIds.includes(
                    Number(player.id)
                  );

                return (
                  <button
                    type="button"
                    key={player.id}
                    onClick={() =>
                      togglePlayer(player.id)
                    }
                    style={{
                      padding: 10,
                      borderRadius: 11,
                      cursor: "pointer",
                      color: "#fff",

                      background: selected
                        ? "rgba(126,34,206,0.16)"
                        : "rgba(255,255,255,0.025)",

                      border: selected
                        ? "1px solid rgba(192,132,252,0.38)"
                        : "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {player.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <button
              type="button"
              onClick={createScrim}
              style={{
                padding: "12px 18px",
                borderRadius: 11,
                border:
                  "1px solid rgba(192,132,252,0.35)",
                background:
                  "rgba(126,34,206,0.20)",
                color: "#fff",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Create Scrim
            </button>
          </div>
        </div>
      )}

      {/* FILTER */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
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
              pointerEvents: "none",
            }}
          />

          <select
            value={selectedDivision}
            onChange={(e) =>
              setSelectedDivision(e.target.value)
            }
            style={inputStyle}
          >
            <option value="all">
              All Shadowborn Teams
            </option>

            {divisions.map((division) => (
              <option
                key={division}
                value={division}
              >
                Division {division}
              </option>
            ))}

            <option value="custom">
              Custom Teams
            </option>
          </select>
        </div>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(170px,1fr))",
          gap: 12,
        }}
      >
        <StatCard
          icon={<Swords size={20} />}
          value={filteredScrims.length}
          label="Scrim Sessions"
        />

        <StatCard
          icon={<Trophy size={20} />}
          value={completedScrims}
          label="Completed Scrims"
        />

        <StatCard
          icon={<Target size={20} />}
          value={wins}
          label="Map Wins"
          accent="#4ade80"
        />

        <StatCard
          icon={<X size={20} />}
          value={losses}
          label="Map Losses"
          accent="#fb7185"
        />

        <StatCard
          icon={<Target size={20} />}
          value={`${mapWinRate}%`}
          label="Map Win Rate"
        />
      </div>

      {/* SCRIM HISTORY */}

      <div
        style={{
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 16,
          }}
        >
          Scrim History
        </div>

        {loading ? (
          <div
            style={{
              ...glassCard,
              padding: 30,
              textAlign: "center",
            }}
          >
            Loading scrims...
          </div>
        ) : filteredScrims.length === 0 ? (
          <div
            style={{
              ...glassCard,
              padding: 35,
              textAlign: "center",
              color: "#968ba6",
            }}
          >
            No scrims recorded yet.
          </div>
        ) : (
          filteredScrims.map((scrim) => {
            const scrimMaps = maps.filter(
              (map) =>
                Number(map.scrim_id) ===
                Number(scrim.id)
            );

            const scrimWins = scrimMaps.filter(
              (map) => map.result === "W"
            ).length;

            const scrimLosses = scrimMaps.filter(
              (map) => map.result === "L"
            ).length;

            const isOpen =
              openScrimId === scrim.id;

            const active =
              scrim.status === "active";

            return (
              <div
                key={scrim.id}
                style={{
                  ...glassCard,
                  overflow: "hidden",
                }}
              >
                <button
  type="button"
  onClick={() =>
    setOpenScrimId(
      isOpen ? null : scrim.id
    )
  }
  style={{
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#fff",
    padding: "20px 22px",
    textAlign: "left",
    cursor: "pointer",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 18,
      flexWrap: "wrap",
    }}
  >
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            padding: "5px 9px",
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 0.5,

            color: active
              ? "#86efac"
              : "#e9d5ff",

            background: active
              ? "rgba(34,197,94,0.10)"
              : "rgba(147,51,234,0.12)",

            border: active
              ? "1px solid rgba(34,197,94,0.20)"
              : "1px solid rgba(192,132,252,0.18)",
          }}
        >
          {active ? "ACTIVE" : "COMPLETED"}
        </span>

        <span
          style={{
            color: "#81768f",
            fontSize: 12,
          }}
        >
          {formatDate(scrim.scrim_date)}
        </span>
      </div>

      <div
        style={{
          fontSize: 20,
          fontWeight: 950,
        }}
      >
        vs {scrim.opponent_clan}
      </div>

      <div
        style={{
          color: "#9e93aa",
          fontSize: 12,
          marginTop: 5,
        }}
      >
        {scrim.team_name ||
          (scrim.division
            ? `Division ${scrim.division}`
            : "Custom Team")}

        {" • "}

        {scrimMaps.length} Map
        {scrimMaps.length === 1 ? "" : "s"}
      </div>

      <div
        style={{
          color: "#756a82",
          fontSize: 11,
          marginTop: 4,
        }}
      >
        {Array.isArray(scrim.player_names)
          ? scrim.player_names.join(" • ")
          : ""}
      </div>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 950,
          }}
        >
          <span style={{ color: "#4ade80" }}>
            {scrimWins}
          </span>

          {" - "}

          <span style={{ color: "#fb7185" }}>
            {scrimLosses}
          </span>
        </div>

        <div
          style={{
            color: "#746a81",
            fontSize: 10,
            marginTop: 3,
          }}
        >
          MAP RECORD
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 950,
            color: "#c084fc",
          }}
        >
          {scrimMaps.length > 0
            ? Math.round(
                (scrimWins /
                  scrimMaps.length) *
                  100
              )
            : 0}
          %
        </div>

        <div
          style={{
            color: "#746a81",
            fontSize: 10,
            marginTop: 3,
          }}
        >
          MAP WIN RATE
        </div>
      </div>

      <ChevronDown
        size={18}
        style={{
          transform: isOpen
            ? "rotate(180deg)"
            : "rotate(0deg)",
          transition: "0.2s ease",
          color: "#a78bfa",
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
                      padding: "18px 22px",
                    }}
                  >
                    {scrimMaps.map((map) => (
                      <div
                        key={map.id}
                        style={{
                          padding: 12,
                          marginBottom: 8,
                          borderRadius: 12,
                          border:
                            "1px solid rgba(255,255,255,0.05)",
                          background:
                            "rgba(255,255,255,0.025)",
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div>
                            <strong
                              style={{
                                color:
                                  map.result === "W"
                                    ? "#4ade80"
                                    : "#fb7185",
                              }}
                            >
                              {map.result}
                            </strong>

                            {" • "}

                            {map.game_mode}

                            {" • "}

                            {map.map_name}
                          </div>

                          <div
                            style={{
                              fontSize: 10,
                              color: "#766b83",
                              marginTop: 4,
                            }}
                          >
                            {Array.isArray(
                              map.player_names
                            )
                              ? map.player_names.join(
                                  " / "
                                )
                              : ""}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 14,
                            alignItems: "center",
                          }}
                        >
                          <strong>
                            {map.score_for} -{" "}
                            {map.score_against}
                          </strong>

                          {canAdmin && (
                            <button
                              onClick={() =>
                                deleteMap(map.id)
                              }
                              style={{
                                color: "#fb7185",
                                background:
                                  "transparent",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {active && (
                      <button
                        type="button"
                        onClick={() => {
                          setAddMapScrimId(scrim.id);

                          resetMapDraft(scrim);
                        }}
                        style={{
                          padding: "9px 13px",
                          marginTop: 8,
                          borderRadius: 10,
                          border:
                            "1px solid rgba(192,132,252,0.25)",
                          background:
                            "rgba(126,34,206,0.12)",
                          color: "#e9d5ff",
                          cursor: "pointer",
                        }}
                      >
                        + Add Map
                      </button>
                    )}

                    {addMapScrimId === scrim.id &&
                      active && (
                        <div
                          style={{
                            marginTop: 15,
                            padding: 16,
                            borderRadius: 14,
                            background:
                              "rgba(126,34,206,0.055)",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit,minmax(150px,1fr))",
                              gap: 12,
                            }}
                          >
                            <div>
                              <label style={labelStyle}>
                                MODE
                              </label>

                              <select
                                value={mapDraft.gameMode}
                                onChange={(e) =>
                                  setMapDraft((prev) => ({
                                    ...prev,
                                    gameMode:
                                      e.target.value,
                                  }))
                                }
                                style={inputStyle}
                              >
                                <option value="Hardpoint">
                                  Hardpoint
                                </option>

                                <option value="SND">
                                  SND
                                </option>

                                <option value="Overload">
                                  Overload
                                </option>
                              </select>
                            </div>

                            <div>
                              <label style={labelStyle}>
                                MAP
                              </label>

                              <input
                                value={mapDraft.mapName}
                                onChange={(e) =>
                                  setMapDraft((prev) => ({
                                    ...prev,
                                    mapName:
                                      e.target.value,
                                  }))
                                }
                                placeholder="Map name"
                                style={inputStyle}
                              />
                            </div>

                            <div>
                              <label style={labelStyle}>
                                RESULT
                              </label>

                              <select
                                value={mapDraft.result}
                                onChange={(e) =>
                                  setMapDraft((prev) => ({
                                    ...prev,
                                    result:
                                      e.target.value,
                                  }))
                                }
                                style={inputStyle}
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
                              <label style={labelStyle}>
                                OUR SCORE
                              </label>

                              <input
                                type="number"
                                value={mapDraft.scoreFor}
                                onChange={(e) =>
                                  setMapDraft((prev) => ({
                                    ...prev,
                                    scoreFor:
                                      e.target.value,
                                  }))
                                }
                                style={inputStyle}
                              />
                            </div>

                            <div>
                              <label style={labelStyle}>
                                THEIR SCORE
                              </label>

                              <input
                                type="number"
                                value={
                                  mapDraft.scoreAgainst
                                }
                                onChange={(e) =>
                                  setMapDraft((prev) => ({
                                    ...prev,
                                    scoreAgainst:
                                      e.target.value,
                                  }))
                                }
                                style={inputStyle}
                              />
                            </div>
                          </div>

                          <div
                            style={{
                              marginTop: 15,
                            }}
                          >
                            <label style={labelStyle}>
                              PLAYERS IN THIS MAP
                            </label>

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fit,minmax(160px,1fr))",
                                gap: 8,
                              }}
                            >
                              {players.map((player) => {
                                const selected =
                                  mapDraft.playerIds.includes(
                                    Number(player.id)
                                  );

                                return (
                                  <button
                                    type="button"
                                    key={player.id}
                                    onClick={() =>
                                      toggleMapPlayer(
                                        player.id
                                      )
                                    }
                                    style={{
                                      padding: 9,
                                      borderRadius: 10,
                                      cursor: "pointer",

                                      color: "#fff",

                                      background: selected
                                        ? "rgba(126,34,206,0.16)"
                                        : "rgba(255,255,255,0.025)",

                                      border: selected
                                        ? "1px solid rgba(192,132,252,0.38)"
                                        : "1px solid rgba(255,255,255,0.07)",
                                    }}
                                  >
                                    {player.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div
                            style={{
                              marginTop: 15,
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 8,
                            }}
                          >
                            <button
  type="button"
  onClick={() =>
    setAddMapScrimId(null)
  }
  style={{
    padding: "10px 14px",
    borderRadius: 10,
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.035)",
    color: "#c4b9cf",
    cursor: "pointer",
    fontWeight: 850,
  }}
>
  Cancel
</button>

<button
  type="button"
  onClick={() => addMap(scrim)}
  style={{
    padding: "10px 16px",
    borderRadius: 10,
    border:
      "1px solid rgba(192,132,252,0.28)",
    background:
      "rgba(126,34,206,0.18)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 900,
  }}
>
  Save Map
</button>
                          </div>
                        </div>
                      )}

                    <div
                      style={{
                        marginTop: 18,
                        paddingTop: 16,
                        borderTop:
                          "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        justifyContent:
                          "space-between",
                      }}
                    >
                      <div>
                        {active ? (
                          <>
                            <Clock3 size={15} /> Active
                            Scrim
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={15} />{" "}
                            Completed Scrim
                          </>
                        )}
                      </div>

                     {canAdmin && (
  <div
    style={{
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
    }}
  >
    {active ? (
      <button
        type="button"
        onClick={() =>
          finishScrim(scrim.id)
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "9px 13px",
          borderRadius: 10,
          border:
            "1px solid rgba(192,132,252,0.24)",
          background:
            "rgba(126,34,206,0.11)",
          color: "#e9d5ff",
          cursor: "pointer",
          fontWeight: 900,
        }}
      >
        <Flag size={14} />
        Finish Scrim
      </button>
    ) : (
      <button
        type="button"
        onClick={() =>
          reopenScrim(scrim.id)
        }
        style={{
          padding: "9px 13px",
          borderRadius: 10,
          border:
            "1px solid rgba(192,132,252,0.18)",
          background:
            "rgba(126,34,206,0.07)",
          color: "#d8b4fe",
          cursor: "pointer",
          fontWeight: 850,
        }}
      >
        Re-open
      </button>
    )}

    <button
      type="button"
      onClick={() =>
        deleteScrim(scrim.id)
      }
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "9px 13px",
        borderRadius: 10,
        border:
          "1px solid rgba(251,113,133,0.16)",
        background:
          "rgba(251,113,133,0.05)",
        color: "#fb7185",
        cursor: "pointer",
        fontWeight: 850,
      }}
    >
      <Trash2 size={14} />
      Delete
    </button>
  </div>
)}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* PLAYER STATS */}

      <div
        style={{
          ...glassCard,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            borderBottom:
              "1px solid rgba(255,255,255,0.07)",
            fontWeight: 900,
          }}
        >
          <Users size={17} /> Player Scrim Performance
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 750,
            }}
          >
            <thead>
              <tr>
                {[
                  "Player",
                  "Scrims",
                  "Maps",
                  "Wins",
                  "Losses",
                  "W/L",
                  "Win Rate",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: 13,
                      textAlign: "left",
                      fontSize: 11,
                      color: "#887c98",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {playerStats.map((player) => (
                <tr key={player.id}>
                 <td
  style={{
    padding: "13px 16px",
    borderBottom:
      "1px solid rgba(255,255,255,0.045)",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        background:
          "rgba(255,255,255,0.07)",
        fontWeight: 900,
        flexShrink: 0,
      }}
    >
      {player.avatar ? (
        <img
          src={player.avatar}
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
        }}
      >
        {player.name}
      </div>

      <div
        style={{
          color: "#786d86",
          fontSize: 11,
        }}
      >
        {player.division
          ? `Division ${player.division}`
          : ""}
      </div>
    </div>
  </div>
</td>

                  <td>{player.scrims}</td>

                  <td>{player.maps}</td>

                  <td style={{ color: "#4ade80" }}>
                    {player.wins}
                  </td>

                  <td style={{ color: "#fb7185" }}>
                    {player.losses}
                  </td>

                  <td>
                    {player.wins} - {player.losses}
                  </td>

                  <td
                    style={{
                      color:
                        player.winRate >= 60
                          ? "#4ade80"
                          : player.winRate < 40
                          ? "#fb7185"
                          : "#c084fc",
                    }}
                  >
                    {player.winRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}