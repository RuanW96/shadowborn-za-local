export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "post-discord-callout is live"
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const webhook = process.env.DISCORD_CALLOUT_WEBHOOK_URL;

    if (!webhook) {
      return res.status(500).json({
        error: "Missing webhook URL"
      });
    }

    const body = req.body || {};

    const challenger = body.challenger || "Unknown";
    const challenged = body.challenged || "Unknown";

    const discordBody = {
      embeds: [
        {
          title: "⚔️ SHADOWBORN CALLOUT ⚔️",
          description:
            `🔥 **${challenger}** has called out **${challenged}**!\n\n` +
            `💀 Accept the challenge or forfeit your honour.`,
          color: 16724787
        }
      ]
    };

    const discordRes = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(discordBody)
    });

    if (!discordRes.ok) {
      return res.status(500).json({
        error: "Discord webhook failed"
      });
    }

    return res.status(200).json({
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}