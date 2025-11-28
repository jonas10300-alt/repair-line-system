import { Client } from "@line/bot-sdk";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).send("LINE webhook OK");
    }

    const client = new Client({
      channelAccessToken: process.env.LINE_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET
    });

    const event = req.body?.events?.[0];
    if (!event) return res.status(200).send("NO EVENT");

    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "報修已收到，等待工務處理！"
    });

    return res.status(200).send("SUCCESS");
  } catch (err) {
    console.error("WebHook ERROR:", err);
    return res.status(500).send(err.toString());
  }
}
