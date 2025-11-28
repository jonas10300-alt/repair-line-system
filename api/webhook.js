import { Client, middleware } from "@line/bot-sdk";

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new Client(config);

export default async function handler(req, res) {
  try {
    const event = req.body.events?.[0];
    if (!event) return res.status(200).end();

    // 如果輸入 "ID" → 傳回群組ID
    if (event.type === "message" && event.message.type === "text" && event.message.text === "ID") {
      const groupId = event.source.groupId;
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: `群組 ID:\n${groupId}`
      });
      return res.status(200).send("OK");
    }

    return res.status(200).send("No Action");
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.toString());
  }
}
