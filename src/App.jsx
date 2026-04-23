import { useMemo, useState } from "react";
import { Trophy, Users, Swords, Plus, Crown, Target } from "lucide-react";

const initialPlayers = [
  { id: 1, name: "The Fudgeman", points: 165, emblem: "TF", tournamentWins: 1, avatar: "" },
  { id: 2, name: "Bulletstorm", points: 145, emblem: "BS", tournamentWins: 1, avatar: "" },
  { id: 3, name: "Thirdstriker", points: 131, emblem: "TS", tournamentWins: 0, avatar: "" },
  { id: 4, name: "Toxicmuffin", points: 115, emblem: "TM", tournamentWins: 0, avatar: "" },
  { id: 5, name: "Stifler", points: 82, emblem: "ST", tournamentWins: 0, avatar: "" },
  { id: 6, name: "Dreamzz", points: 81, emblem: "DZ", tournamentWins: 0, avatar: "" },
  { id: 7, name: "Botzzy", points: 50, emblem: "BZ", tournamentWins: 0, avatar: "" },
  { id: 8, name: "Gallie", points: 47, emblem: "GA", tournamentWins: 0, avatar: "" },
  { id: 9, name: "Jeanre", points: 40, emblem: "JR", tournamentWins: 0, avatar: "" },
  { id: 10, name: "STG", points: 32, emblem: "SG", tournamentWins: 0, avatar: "" },
  { id: 11, name: "Dwain", points: 20, emblem: "DW", tournamentWins: 0, avatar: "" },
  { id: 12, name: "DancyRaptor", points: 20, emblem: "DR", tournamentWins: 0, avatar: "" },
  { id: 13, name: "Dennis", points: 20, emblem: "DE", tournamentWins: 0, avatar: "" },
  { id: 14, name: "UncleCyril", points: 10, emblem: "UC", tournamentWins: 0, avatar: "" },
  { id: 15, name: "Nico", points: 0, emblem: "NI", tournamentWins: 0, avatar: "" },
  { id: 16, name: "AJ", points: 0, emblem: "AJ", tournamentWins: 0, avatar: "" },
  { id: 17, name: "Jaundre", points: 0, emblem: "JA", tournamentWins: 0, avatar: "" },
];

const initialTeams = [
  { id: 1, name: "Shadow Team 1", members: ["The Fudgeman"] },
  { id: 2, name: "Shadow Team 2", members: ["Bulletstorm"] },
  { id: 3, name: "Shadow Team 3", members: ["Thirdstriker"] },
  { id: 4, name: "Shadow Team 4", members: ["Toxicmuffin"] },
  { id: 5, name: "Shadow Team 5", members: ["Stifler"] },
  { id: 6, name: "Shadow Team 6", members: ["Dreamzz"] },
];

function emptyMatch(id, label) {
  return { id, label, teamA: "", teamB: "", scoreA: "", scoreB: "" };
}

function getWinner(match) {
  const a = Number(match.scoreA);
  const b = Number(match.scoreB);
  if (!match.teamA || !match.teamB || match.scoreA === "" || match.scoreB === "") return "";
  if (Number.isNaN(a) || Number.isNaN(b) || a === b) return "";
  return a > b ? match.teamA : match.teamB;
}

function getLoser(match) {
  const winner = getWinner(match);
  if (!winner) return "";
  return winner === match.teamA ? match.teamB : match.teamA;
}

function inputStyle() {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #3b2a57",
    background: "#140c24",
    color: "white",
    boxSizing: "border-box",
  };
}

function cardStyle() {
  return {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };
}

function badgeStyle(bg = "rgba(255,255,255,0.08)", color = "white") {
  return {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background: bg,
    color,
    fontSize: 12,
    fontWeight: 700,
  };
}

function MatchCard({ match, onChange }) {
  const winner = getWinner(match);

  return (
    <div style={cardStyle()}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 12, alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 800 }}>{match.label}</div>
          <div style={{ color: "#cfc4e8", fontSize: 13 }}>
            {match.teamA || "TBD"} vs {match.teamB || "TBD"}
          </div>
        </div>
        <div style={badgeStyle()}>
          {winner ? `Winner: ${winner}` : "Pending"}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, marginBottom: 6 }}>{match.teamA || "Team A"}</div>
          <input
            type="number"
            value={match.scoreA}
            disabled={!match.teamA || !match.teamB}
            onChange={(e) => onChange(match.id, "scoreA", e.target.value)}
            style={inputStyle()}
          />
        </div>
        <div>
          <div style={{ fontSize: 13, marginBottom: 6 }}>{match.teamB || "Team B"}</div>
          <input
            type="number"
            value={match.scoreB}
            disabled={!match.teamA || !match.teamB}
            onChange={(e) => onChange(match.id, "scoreB", e.target.value)}
            style={inputStyle()}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [clanName, setClanName] = useState("Shadowborn ZA");
  const [tagline, setTagline] = useState("Victory awaits in the shadows");
  const [logoUrl, setLogoUrl] = useState("/shadowborn-za-logo.jpg");
  const [format, setFormat] = useState("2v2");
  const [tournamentName, setTournamentName] = useState("Shadowborn ZA Tournament");
  const [players, setPlayers] = useState(initialPlayers);
  const [teams, setTeams] = useState(initialTeams);
  const [newPlayer, setNewPlayer] = useState({ name: "", points: 0, emblem: "", tournamentWins: 0, avatar: "" });

  const [matches, setMatches] = useState({
    playIn1: emptyMatch("playIn1", "Play-In 1"),
    playIn2: emptyMatch("playIn2", "Play-In 2"),
    semi1: emptyMatch("semi1", "Winners Semi 1"),
    semi2: emptyMatch("semi2", "Winners Semi 2"),
    winnersFinal: emptyMatch("winnersFinal", "Winners Final"),
    losersSemi: emptyMatch("losersSemi", "Losers Semi"),
    losersFinal: emptyMatch("losersFinal", "Losers Final"),
    grandFinal: emptyMatch("grandFinal", "Grand Final"),
  });

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name)),
    [players]
  );

  const neededPlayers = format === "1v1" ? 1 : format === "2v2" ? 2 : 4;

  const validTeams = useMemo(
    () => teams.filter((team) => team.members.filter(Boolean).length >= neededPlayers),
    [teams, neededPlayers]
  );

  function applyBracket(base) {
    const next = JSON.parse(JSON.stringify(base));
    const teamNames = validTeams.map((t) => t.name);

    next.playIn1.teamA = teamNames[2] || "";
    next.playIn1.teamB = teamNames[5] || "";
    next.playIn2.teamA = teamNames[3] || "";
    next.playIn2.teamB = teamNames[4] || "";

    next.semi1.teamA = teamNames[0] || "";
    next.semi1.teamB = getWinner(next.playIn1);
    next.semi2.teamA = teamNames[1] || "";
    next.semi2.teamB = getWinner(next.playIn2);

    next.winnersFinal.teamA = getWinner(next.semi1);
    next.winnersFinal.teamB = getWinner(next.semi2);

    next.losersSemi.teamA = getLoser(next.semi1);
    next.losersSemi.teamB = getLoser(next.semi2);

    next.losersFinal.teamA = getWinner(next.losersSemi);
    next.losersFinal.teamB = getLoser(next.winnersFinal);

    next.grandFinal.teamA = getWinner(next.winnersFinal);
    next.grandFinal.teamB = getWinner(next.losersFinal);

    return next;
  }

  function updateMatch(id, field, value) {
    setMatches((prev) => applyBracket({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  function resetTournament() {
    setMatches(
      applyBracket({
        playIn1: emptyMatch("playIn1", "Play-In 1"),
        playIn2: emptyMatch("playIn2", "Play-In 2"),
        semi1: emptyMatch("semi1", "Winners Semi 1"),
        semi2: emptyMatch("semi2", "Winners Semi 2"),
        winnersFinal: emptyMatch("winnersFinal", "Winners Final"),
        losersSemi: emptyMatch("losersSemi", "Losers Semi"),
        losersFinal: emptyMatch("losersFinal", "Losers Final"),
        grandFinal: emptyMatch("grandFinal", "Grand Final"),
      })
    );
  }

  function updatePlayer(id, field, value) {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]:
                field === "points" || field === "tournamentWins"
                  ? Number(value) || 0
                  : value,
            }
          : p
      )
    );
  }

  function addPlayer() {
    if (!newPlayer.name.trim()) return;
    setPlayers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newPlayer.name.trim(),
        points: Number(newPlayer.points) || 0,
        emblem: newPlayer.emblem || newPlayer.name.slice(0, 2).toUpperCase(),
        tournamentWins: Number(newPlayer.tournamentWins) || 0,
        avatar: newPlayer.avatar || "",
      },
    ]);
    setNewPlayer({ name: "", points: 0, emblem: "", tournamentWins: 0, avatar: "" });
  }

  function updateTeam(id, field, value) {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }

  function addTeam() {
    setTeams((prev) => [...prev, { id: Date.now(), name: `Shadow Team ${prev.length + 1}`, members: [""] }]);
  }

  const champion = getWinner(matches.grandFinal);

  const appBg = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(168,85,247,0.35), transparent 25%), linear-gradient(135deg, #0a0612, #12091d 55%, #1f1036)",
    color: "white",
    fontFamily: "Arial, sans-serif",
  };

  const buttonBase = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  };

  return (
    <div style={appBg}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: 20 }}>
        <div style={{ ...cardStyle(), padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <span style={badgeStyle()}><Trophy size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />Clan Hub</span>
                <span style={badgeStyle()}><Target size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />Leaderboards</span>
                <span style={badgeStyle()}><Swords size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />Tournaments</span>
              </div>
              <h1 style={{ margin: 0, fontSize: 42 }}>{clanName}</h1>
              <div style={{ color: "#d6c8ef", marginTop: 8 }}>{tagline}</div>
            </div>

            <div style={{ width: 120, height: 120, borderRadius: 24, overflow: "hidden", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Shadowborn ZA"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div style={{ fontWeight: 900, fontSize: 28 }}>SZ</div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          {["dashboard", "leaderboard", "players", "teams", "tournament"].map((name) => (
            <button
              key={name}
              onClick={() => setTab(name)}
              style={{
                ...buttonBase,
                background: tab === name ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(255,255,255,0.06)",
              }}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>

        {tab === "dashboard" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
              <div style={cardStyle()}><Users /> <div style={{ marginTop: 12, color: "#cfc4e8" }}>Total Players</div><div style={{ fontSize: 32, fontWeight: 900 }}>{players.length}</div></div>
              <div style={cardStyle()}><Swords /> <div style={{ marginTop: 12, color: "#cfc4e8" }}>Usable Teams</div><div style={{ fontSize: 32, fontWeight: 900 }}>{validTeams.length}</div></div>
              <div style={cardStyle()}><Target /> <div style={{ marginTop: 12, color: "#cfc4e8" }}>Format</div><div style={{ fontSize: 32, fontWeight: 900 }}>{format}</div></div>
              <div style={cardStyle()}><Crown /> <div style={{ marginTop: 12, color: "#cfc4e8" }}>Champion</div><div style={{ fontSize: 24, fontWeight: 900 }}>{champion || "TBD"}</div></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
              <div style={cardStyle()}>
                <h2 style={{ marginTop: 0 }}>Top Leaderboard</h2>
                {sortedPlayers.slice(0, 5).map((player, i) => (
                  <div key={player.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: "rgba(0,0,0,0.18)", borderRadius: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>
                        {player.avatar ? <img src={player.avatar} alt={player.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} /> : player.emblem}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800 }}>#{i + 1} {player.name}</div>
                        <div style={{ color: "#cfc4e8", fontSize: 13 }}>
                          {player.points} points • {player.tournamentWins} tournament wins
                        </div>
                      </div>
                    </div>
                    <div style={badgeStyle("rgba(250,204,21,0.16)", "#fff3a3")}>🏆 {player.tournamentWins}</div>
                  </div>
                ))}
              </div>

              <div style={cardStyle()}>
                <h2 style={{ marginTop: 0 }}>Branding</h2>
                <div style={{ marginBottom: 10 }}>Clan Name</div>
                <input value={clanName} onChange={(e) => setClanName(e.target.value)} style={{ ...inputStyle(), marginBottom: 12 }} />
                <div style={{ marginBottom: 10 }}>Tagline</div>
                <input value={tagline} onChange={(e) => setTagline(e.target.value)} style={{ ...inputStyle(), marginBottom: 12 }} />
                <div style={{ marginBottom: 10 }}>Logo Path</div>
                <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} style={inputStyle()} />
              </div>
            </div>
          </>
        )}

        {tab === "leaderboard" && (
          <div style={cardStyle()}>
            <h2 style={{ marginTop: 0 }}>Shadowborn ZA Leaderboard</h2>
            {sortedPlayers.map((player, i) => (
              <div key={player.id} style={{ display: "grid", gridTemplateColumns: "70px 1.2fr 140px 140px", gap: 12, padding: 12, borderRadius: 14, background: "rgba(0,0,0,0.18)", marginBottom: 10, alignItems: "center" }}>
                <div style={{ fontWeight: 900, fontSize: 22 }}>#{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 800 }}>{player.name}</div>
                  <div style={{ color: "#cfc4e8", fontSize: 13 }}>Emblem: {player.emblem}</div>
                </div>
                <input type="number" value={player.points} onChange={(e) => updatePlayer(player.id, "points", e.target.value)} style={inputStyle()} />
                <input type="number" value={player.tournamentWins} onChange={(e) => updatePlayer(player.id, "tournamentWins", e.target.value)} style={inputStyle()} />
              </div>
            ))}
          </div>
        )}

        {tab === "players" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr", gap: 16 }}>
            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Player Profiles</h2>
              {players.map((player) => (
                <div key={player.id} style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr", gap: 12, padding: 12, borderRadius: 16, background: "rgba(0,0,0,0.18)", marginBottom: 12 }}>
                  <div>
                    <div style={{ width: 74, height: 74, borderRadius: 20, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, overflow: "hidden" }}>
                      {player.avatar ? <img src={player.avatar} alt={player.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : player.emblem}
                    </div>
                    <div style={{ marginTop: 8, ...badgeStyle() }}>{player.points} pts</div>
                    <div style={{ marginTop: 6, ...badgeStyle("rgba(250,204,21,0.16)", "#fff3a3") }}>🏆 {player.tournamentWins}</div>
                  </div>
                  <div>
                    <div style={{ marginBottom: 6 }}>Name</div>
                    <input value={player.name} onChange={(e) => updatePlayer(player.id, "name", e.target.value)} style={{ ...inputStyle(), marginBottom: 10 }} />
                    <div style={{ marginBottom: 6 }}>Emblem</div>
                    <input value={player.emblem} onChange={(e) => updatePlayer(player.id, "emblem", e.target.value)} style={{ ...inputStyle(), marginBottom: 10 }} />
                    <div style={{ marginBottom: 6 }}>Tournament Wins</div>
                    <input type="number" value={player.tournamentWins} onChange={(e) => updatePlayer(player.id, "tournamentWins", e.target.value)} style={inputStyle()} />
                  </div>
                  <div>
                    <div style={{ marginBottom: 6 }}>Profile Image URL</div>
                    <input value={player.avatar} onChange={(e) => updatePlayer(player.id, "avatar", e.target.value)} style={inputStyle()} />
                  </div>
                </div>
              ))}
            </div>

            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Add New Player</h2>
              <div style={{ marginBottom: 6 }}>Name</div>
              <input value={newPlayer.name} onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })} style={{ ...inputStyle(), marginBottom: 10 }} />
              <div style={{ marginBottom: 6 }}>Starting Points</div>
              <input type="number" value={newPlayer.points} onChange={(e) => setNewPlayer({ ...newPlayer, points: e.target.value })} style={{ ...inputStyle(), marginBottom: 10 }} />
              <div style={{ marginBottom: 6 }}>Emblem</div>
              <input value={newPlayer.emblem} onChange={(e) => setNewPlayer({ ...newPlayer, emblem: e.target.value })} style={{ ...inputStyle(), marginBottom: 10 }} />
              <div style={{ marginBottom: 6 }}>Tournament Wins</div>
              <input type="number" value={newPlayer.tournamentWins} onChange={(e) => setNewPlayer({ ...newPlayer, tournamentWins: e.target.value })} style={{ ...inputStyle(), marginBottom: 10 }} />
              <div style={{ marginBottom: 6 }}>Profile Image URL</div>
              <input value={newPlayer.avatar} onChange={(e) => setNewPlayer({ ...newPlayer, avatar: e.target.value })} style={{ ...inputStyle(), marginBottom: 14 }} />
              <button onClick={addPlayer} style={{ ...buttonBase, width: "100%", background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                <Plus size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                Add Player
              </button>
            </div>
          </div>
        )}

        {tab === "teams" && (
          <div style={cardStyle()}>
            <h2 style={{ marginTop: 0 }}>Team Builder</h2>
            <div style={{ marginBottom: 16, color: "#cfc4e8" }}>
              Current format: {format} • Required players per team: {neededPlayers}
            </div>

            {teams.map((team) => (
              <div key={team.id} style={{ padding: 12, borderRadius: 16, background: "rgba(0,0,0,0.18)", marginBottom: 12 }}>
                <div style={{ marginBottom: 8, fontWeight: 800 }}>Team</div>
                <input
                  value={team.name}
                  onChange={(e) => updateTeam(team.id, "name", e.target.value)}
                  style={{ ...inputStyle(), marginBottom: 10 }}
                />
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    value={team.members[i] || ""}
                    onChange={(e) => {
                      const next = [...team.members];
                      next[i] = e.target.value;
                      updateTeam(team.id, "members", next);
                    }}
                    placeholder={`Member ${i + 1}`}
                    style={{ ...inputStyle(), marginBottom: 8 }}
                  />
                ))}
              </div>
            ))}

            <button onClick={addTeam} style={{ ...buttonBase }}>
              <Plus size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
              Add Team
            </button>
          </div>
        )}

        {tab === "tournament" && (
          <>
            <div style={{ ...cardStyle(), marginBottom: 16 }}>
              <h2 style={{ marginTop: 0 }}>Live Tournament Control</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 12, alignItems: "end" }}>
                <div>
                  <div style={{ marginBottom: 6 }}>Tournament Name</div>
                  <input value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} style={inputStyle()} />
                </div>
                <button onClick={() => setFormat("1v1")} style={{ ...buttonBase, background: format === "1v1" ? "#7c3aed" : "rgba(255,255,255,0.06)" }}>1v1</button>
                <button onClick={() => setFormat("2v2")} style={{ ...buttonBase, background: format === "2v2" ? "#7c3aed" : "rgba(255,255,255,0.06)" }}>2v2</button>
                <button onClick={() => setFormat("4v4")} style={{ ...buttonBase, background: format === "4v4" ? "#7c3aed" : "rgba(255,255,255,0.06)" }}>4v4</button>
              </div>
              <div style={{ marginTop: 12 }}>
                <button onClick={resetTournament} style={buttonBase}>Reset Bracket</button>
              </div>
            </div>

            <div style={{ ...cardStyle(), marginBottom: 16 }}>
              <h2 style={{ marginTop: 0 }}>{tournamentName}</h2>
              <div style={{ color: "#cfc4e8", marginBottom: 12 }}>
                Valid teams for {format}: {validTeams.length}
              </div>
              {validTeams.length < 6 ? (
                <div style={{ padding: 20, borderRadius: 16, background: "rgba(0,0,0,0.18)", color: "#d9cfee" }}>
                  You need at least 6 valid teams for this bracket layout.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 10 }}>Play-In Round</div>
                    <MatchCard match={matches.playIn1} onChange={updateMatch} />
                    <div style={{ height: 12 }} />
                    <MatchCard match={matches.playIn2} onChange={updateMatch} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 10 }}>Winners Bracket</div>
                    <MatchCard match={matches.semi1} onChange={updateMatch} />
                    <div style={{ height: 12 }} />
                    <MatchCard match={matches.semi2} onChange={updateMatch} />
                    <div style={{ height: 12 }} />
                    <MatchCard match={matches.winnersFinal} onChange={updateMatch} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 10 }}>Losers Bracket</div>
                    <MatchCard match={matches.losersSemi} onChange={updateMatch} />
                    <div style={{ height: 12 }} />
                    <MatchCard match={matches.losersFinal} onChange={updateMatch} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 10 }}>Grand Final</div>
                    <MatchCard match={matches.grandFinal} onChange={updateMatch} />
                    <div style={{ height: 12 }} />
                    <div style={cardStyle()}>
                      <Trophy size={28} color="#fde68a" />
                      <div style={{ marginTop: 10, color: "#cfc4e8" }}>Champion</div>
                      <div style={{ fontSize: 28, fontWeight: 900 }}>{champion || "TBD"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
