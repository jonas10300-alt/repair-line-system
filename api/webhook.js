import express from "express";
import { Client, middleware } from "@line/bot-sdk";

const app = express();

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new Client(config);

// Webhook 接收
app.post("/api/webhook", middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error("Webhook Error:", err);
      res.status(500).end();
    });
});

// 處理訊息
function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") return;

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: "報修系統已連線成功！"
  });
}

app.listen(3000, () => console.log("Webhook server running"));
export default app;
