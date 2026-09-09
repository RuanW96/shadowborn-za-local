import { useState } from "react";
const COD_RANK_THEMES = {
  Bronze: {
    accent: "#f59e6b",
    border: "rgba(245,158,107,0.75)",
    glow: "rgba(180,83,9,0.42)",
    dark: "rgba(69,26,3,0.92)",
  },

  Silver: {
    accent: "#e2e8f0",
    border: "rgba(226,232,240,0.72)",
    glow: "rgba(148,163,184,0.38)",
    dark: "rgba(30,41,59,0.92)",
  },

  Gold: {
    accent: "#fde047",
    border: "rgba(250,204,21,0.80)",
    glow: "rgba(234,179,8,0.42)",
    dark: "rgba(66,45,3,0.92)",
  },

  Platinum: {
    accent: "#67e8f9",
    border: "rgba(34,211,238,0.82)",
    glow: "rgba(6,182,212,0.42)",
    dark: "rgba(8,51,68,0.92)",
  },

  Diamond: {
    accent: "#60a5fa",
    border: "rgba(59,130,246,0.85)",
    glow: "rgba(37,99,235,0.48)",
    dark: "rgba(10,31,68,0.94)",
  },

  Crimson: {
    accent: "#fb7185",
    border: "rgba(239,68,68,0.88)",
    glow: "rgba(220,38,38,0.48)",
    dark: "rgba(69,10,10,0.94)",
  },

  Iridescent: {
    accent: "#e879f9",
    border: "rgba(217,70,239,0.88)",
    glow: "rgba(168,85,247,0.52)",
    dark: "rgba(59,7,100,0.94)",
  },

  "Top 250": {
    accent: "#facc15",
    border: "rgba(250,204,21,0.95)",
    glow: "rgba(234,179,8,0.58)",
    dark: "rgba(54,38,4,0.96)",
  },

  Unranked: {
    accent: "#c084fc",
    border: "rgba(168,85,247,0.38)",
    glow: "rgba(126,34,206,0.28)",
    dark: "rgba(20,14,31,0.96)",
  },
};

function getCodRankTheme(codRank) {
  const rank = String(codRank || "").toLowerCase();

  if (rank.includes("top 250")) return COD_RANK_THEMES["Top 250"];
  if (rank.includes("iridescent")) return COD_RANK_THEMES.Iridescent;
  if (rank.includes("crimson")) return COD_RANK_THEMES.Crimson;
  if (rank.includes("diamond")) return COD_RANK_THEMES.Diamond;
  if (rank.includes("platinum")) return COD_RANK_THEMES.Platinum;
  if (rank.includes("gold")) return COD_RANK_THEMES.Gold;
  if (rank.includes("silver")) return COD_RANK_THEMES.Silver;
  if (rank.includes("bronze")) return COD_RANK_THEMES.Bronze;

  return COD_RANK_THEMES.Unranked;
}
export default function DivisionPlayerCard({
  player,
  divisionTheme,
  competitiveScore,
  winPercentage,
  rankBadgeUrl,
  isMobile = false,
  onOpenProfile,
}) {
  const [hovered, setHovered] = useState(false);

  const divisionNumber = Number(player.division || 0);
const codRankTheme = getCodRankTheme(player.codRank);

const displayCodRank = player.codRank || "Unranked";
  const fallbackInitials = String(player.name || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const playerArtwork =
    player.cardPhoto ||
    player.banner ||
    player.avatar ||
    "";

  return (
    <article
      onClick={() => onOpenProfile?.(player.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        minWidth: 0,
        overflow: "hidden",
        borderRadius: 22,
        cursor: "pointer",

        background:
          "linear-gradient(180deg, rgba(20,14,31,0.98), rgba(8,5,14,0.99))",

      border: `1px solid ${
  hovered
    ? codRankTheme.accent
    : codRankTheme.border
}`,

      boxShadow: hovered
  ? `0 18px 45px rgba(0,0,0,0.55), 0 0 30px ${codRankTheme.glow}`
  : `0 12px 28px rgba(0,0,0,0.38), 0 0 14px ${codRankTheme.glow}`, 

        transform: hovered
          ? "translateY(-7px) scale(1.012)"
          : "translateY(0) scale(1)",

        transition:
          "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
      }}
    >
      {/* Moving shine */}
      <div
        style={{
          position: "absolute",
          zIndex: 20,
          top: "-35%",
          left: hovered ? "125%" : "-55%",
          width: "34%",
          height: "170%",
          pointerEvents: "none",

          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent)",

          transform: "rotate(18deg)",
          transition: "left 650ms ease",
        }}
      />

      {/* Artwork section */}
      <div
        style={{
          position: "relative",
          height: isMobile ? 320 : 340,
          overflow: "hidden",

          background: playerArtwork
            ? `linear-gradient(
                to bottom,
                rgba(5,3,10,0.04),
                rgba(5,3,10,0.08) 43%,
                rgba(7,4,12,0.96) 100%
              ),
              url("${playerArtwork}") center/cover no-repeat`
            : `radial-gradient(
                circle at center,
                ${divisionTheme.glow},
                rgba(12,8,20,0.98) 65%
              )`,
        }}
      >
        {!playerArtwork ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",

              color: divisionTheme.accent,
              fontSize: 55,
              fontWeight: 1000,
              letterSpacing: 2,

              textShadow: `0 0 25px ${divisionTheme.glow}`,
            }}
          >
            {fallbackInitials}
          </div>
        ) : null}

        {/* Dark lower artwork fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",

            background:
              "linear-gradient(to bottom, transparent 42%, rgba(7,4,12,0.3) 62%, rgba(7,4,12,1) 100%)",
          }}
        />

        {/* Division badge */}
        <div
          style={{
            position: "absolute",
            zIndex: 4,
            top: 12,
            left: 12,

            padding: "7px 12px",
            borderRadius: 999,

            background: "rgba(8,5,14,0.86)",
            border: `1px solid ${divisionTheme.accent}`,

            color: divisionTheme.accent,
            fontSize: 11,
            fontWeight: 950,
            letterSpacing: 0.8,
            textTransform: "uppercase",

            backdropFilter: "blur(8px)",
          }}
        >
          Division {divisionNumber}
        </div>
{/* COD Rank plate */}
<div
  style={{
    position: "absolute",
    zIndex: 5,
    top: 12,
    right: 12,

    display: "flex",
    alignItems: "center",
    gap: 9,

    padding: "7px 11px",
    borderRadius: 12,

    background: `linear-gradient(
      135deg,
      ${codRankTheme.dark},
      rgba(5,5,10,0.88)
    )`,

    border: `1px solid ${codRankTheme.border}`,

    boxShadow: `0 0 18px ${codRankTheme.glow}`,

    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  }}
>
  {rankBadgeUrl ? (
    <img
      src={rankBadgeUrl}
      alt={displayCodRank}
      style={{
        width: 34,
        height: 34,
        objectFit: "contain",
        filter: `drop-shadow(0 0 8px ${codRankTheme.glow})`,
      }}
    />
  ) : null}

  <div>
    <div
      style={{
        color: codRankTheme.accent,
        fontSize: 8,
        fontWeight: 900,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        opacity: 0.78,
      }}
    >
      COD RANK
    </div>

    <div
      style={{
        color: codRankTheme.accent,
        fontSize: 13,
        fontWeight: 1000,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        textShadow: `0 0 12px ${codRankTheme.glow}`,
      }}
    >
      {displayCodRank}
    </div>
  </div>
</div>
        {/* Captain badge */}
        {player.isDivisionCaptain ? (
          <div
            style={{
              position: "absolute",
              zIndex: 4,
              top: 68,
              right: 12,

              padding: "7px 11px",
              borderRadius: 999,

              background: "rgba(25,18,5,0.9)",
              border: "1px solid rgba(250,204,21,0.78)",

              color: "#fde047",
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: 0.5,

              boxShadow: "0 0 18px rgba(250,204,21,0.16)",
              backdropFilter: "blur(8px)",
            }}
          >
            👑 TEAM CAPTAIN
          </div>
        ) : null}
      </div>

      {/* Permanent identity header */}
      <div
        style={{
          position: "relative",
          zIndex: 8,
          marginTop: -42,
          padding: "0 15px",
        }}
      >
        <div
          style={{
            padding: "18px 16px",
            borderRadius: 18,

           background: `linear-gradient(
  145deg,
  ${codRankTheme.dark},
  rgba(10,7,16,0.98)
)`,

border: `1px solid ${codRankTheme.border}`,

boxShadow: `0 12px 28px rgba(0,0,0,0.42),
  inset 0 0 22px ${codRankTheme.glow}`,
            
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: "#ffffff",
                  fontSize: isMobile ? 24 : 28,
                  fontWeight: 1000,
                  lineHeight: 1,
                  letterSpacing: 0.4,
                  textTransform: "uppercase",

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",

                  textShadow:
                    "0 2px 8px rgba(0,0,0,1), 0 0 16px rgba(168,85,247,0.42)",
                }}
              >
                {player.name}
              </div>

              <div
                style={{
                  marginTop: 7,
                  color: codRankTheme.accent,
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: 0.4,
                }}
              >
                {player.playStyle || "Role not selected"}

                {player.isDivisionCaptain
                  ? " • Captain"
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div
        style={{
          position: "relative",
          zIndex: 6,
          padding: "11px 15px 16px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          <PlayerStat
            label="CR"
            value={competitiveScore}
            accent={divisionTheme.accent}
          />

          <PlayerStat
            label="COD Rank"
            value={player.codRank || "Unranked"}
            accent={divisionTheme.accent}
          />

          <PlayerStat
            label="Record"
            value={`${player.wins || 0}-${player.losses || 0}`}
            accent={divisionTheme.accent}
          />

          <PlayerStat
            label="Win Rate"
            value={`${winPercentage}%`}
            accent={divisionTheme.accent}
          />

          <PlayerStat
            label="Tournaments"
            value={player.tournamentWins || 0}
            accent={divisionTheme.accent}
          />

          <PlayerStat
            label="All-Star Selections"
            value={player.legacyStats?.allStarSelections || 0}
            accent={divisionTheme.accent}
          />
        </div>
      </div>

      {/* Bottom glow */}
      <div
        style={{
          position: "absolute",
          left: "14%",
          right: "14%",
          bottom: -2,
          height: 5,

          borderRadius: 999,
          background: codRankTheme.accent,

          opacity: hovered ? 0.95 : 0.55,
          filter: `blur(5px) drop-shadow(0 0 8px ${codRankTheme.glow})`,
          transition: "opacity 220ms ease",
        }}
      />
    </article>
  );
}

function PlayerStat({ label, value, accent }) {
  return (
    <div
      style={{
        minWidth: 0,
        minHeight: 64,
        padding: "10px 11px",
        borderRadius: 13,

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",

        background:
          "linear-gradient(145deg, rgba(35,28,47,0.92), rgba(23,18,32,0.94))",

        border: "1px solid rgba(255,255,255,0.035)",
      }}
    >
      <span
        style={{
          color: accent,
          fontSize: 9,
          fontWeight: 950,
          letterSpacing: 0.55,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          marginTop: 4,
          color: "#ffffff",
          fontSize: 15,
          lineHeight: 1.15,

          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </strong>
    </div>
  );
}