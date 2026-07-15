export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      title = "Shadowborn ZA Competitive Rankings",
      smgLeaderboard = [],
      arLeaderboard = [],
      noPreferencePlayers = [],
    } = req.body;

    if (
      smgLeaderboard.length === 0 &&
      arLeaderboard.length === 0 &&
      noPreferencePlayers.length === 0
    ) {
      return res.status(400).json({
        error: "No leaderboard data received",
      });
    }

    const webhookUrl =
      process.env.DISCORD_LEADERBOARD_WEBHOOK_URL;

    if (!webhookUrl) {
      return res.status(500).json({
        error: "Webhook not configured",
      });
    }

    const formatLeaderboard = (playerList) =>
      playerList
        .slice(0, 10)
        .map((player, index) => {
          const medal =
            index === 0
              ? "🥇"
              : index === 1
              ? "🥈"
              : index === 2
              ? "🥉"
              : index === 3
              ? "🏅"
              : `#${index + 1}`;

          const cr = Number(player.cr || 0);

          return `${medal} **${player.name}** — **${cr} CR**`;
        })
        .join("\n");

    const embeds = [];

    if (smgLeaderboard.length > 0) {
      embeds.push({
        title: "⚡ SMG Leaderboard",
        description: formatLeaderboard(smgLeaderboard),
        color: 0x22c55e,
      });
    }

    if (arLeaderboard.length > 0) {
      embeds.push({
        title: "🎯 AR Leaderboard",
        description: formatLeaderboard(arLeaderboard),
        color: 0xa855f7,
      });
    }

    if (noPreferencePlayers.length > 0) {
      const noPreferenceDescription =
        noPreferencePlayers
          .map((player) => {
            const cr = Number(player.cr || 0);
            return `• **${player.name}** — ${cr} CR`;
          })
          .join("\n");

      embeds.push({
        title: "❔ No Preferred Weapon Selected",
        description: noPreferenceDescription,
        color: 0xfacc15,
      });
    }

    if (embeds.length > 0) {
      embeds[0] = {
        ...embeds[0],
        author: {
          name: title,
        },
        thumbnail: {
          url: "https://shadowborn-za-local.vercel.app/shadowborn-za-logo.jpg",
        },
      };
    }

    const lastEmbedIndex = embeds.length - 1;

    embeds[lastEmbedIndex] = {
      ...embeds[lastEmbedIndex],
      footer: {
        text: "Shadowborn ZA • Competitive Rating",
      },
      timestamp: new Date().toISOString(),
    };

    const payload = {
      username: "Shadowborn ZA",
      embeds,
    };

    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!discordResponse.ok) {
      const text = await discordResponse.text();

      return res.status(500).json({
        error: text,
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}