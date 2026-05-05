export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { leaderboard } = req.body;

    if (!leaderboard || leaderboard.length === 0) {
      return res.status(400).json({ error: "No leaderboard data received" });
    }

    const webhookUrl = process.env.DISCORD_LEADERBOARD_WEBHOOK_URL;

    if (!webhookUrl) {
      return res.status(500).json({ error: "Webhook not configured" });
    }

    // Sort players by points
    const sorted = leaderboard
      .sort((a, b) => Number(b.points || 0) - Number(a.points || 0))
      .slice(0, 10);

    const description = sorted
      .map((player, index) => {
        const medal =
          index === 0 ? "🥇" :
          index === 1 ? "🥈" :
          index === 2 ? "🥉" :
          `#${index + 1}`;

        return `${medal} ${player.name} - ${player.points || 0} pts`;
      })
      .join("\n");

    const payload = {
      username: "Shadowborn ZA",
      embeds: [
        {
          title: "🔥 Leaderboard Update",
          description: description,
          color: 16711680,
          timestamp: new Date().toISOString()
        }
      ]
    };

    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!discordResponse.ok) {
      const text = await discordResponse.text();
      return res.status(500).json({ error: text });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}