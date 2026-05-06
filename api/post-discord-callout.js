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

    const challenger = body.challengerName || body.challenger || "Unknown";
const challenged = body.challengedName || body.challenged || "Unknown";

    const discordBody = {
      embeds: [
  {
    title: "☠️ SHADOWBORN CHALLENGE ISSUED ☠️",
    description:
      `🔥 **${challengerName}** has publicly called out **${challengedName}**!\n\n` +
      `⚔️ A ranked duel has been demanded.\n` +
      `💀 Accept the challenge... or let the clan witness your silence.\n\n` +
      `🩸 Reputation is on the line.`,
    color: 0xff0000,
    thumbnail: {
      url: "https://shadowborn-za-local.vercel.app/logo.png"
    },
    image: {
      url: "https://media.tenor.com/6ZUs58774IgAAAAC/fire.gif"
    },
    footer: {
      text: "Shadowborn ZA • Fear the Call-out System"
    }
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