import { Client } from "@line/bot-sdk";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Only POST allowed" });
    }

    const client = new Client({
      channelAccessToken: process.env.LINE_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET
    });

    const event = req.body?.events?.[0]; 
    if (!event) return res.status(200).send("OK");

    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "報修已收到！"
    });

    return res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.toString() });
  }
}
