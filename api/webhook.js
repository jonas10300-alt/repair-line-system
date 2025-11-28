import { Client } from "@line/bot-sdk";
import Airtable from "airtable";

// Airtable Base
const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base("appIf9jfbOlwnL893");
const TABLE = "工務報修系統";

// LINE Bot Config
const client = new Client({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
});

// ★★ 你的工務 LINE 群組ID ★★
const GROUP_ID = "C00791030a5dcd267c91cbef2aff931a5";

export default async function handler(req, res) {
  try {
    const event = req.body.events?.[0];
    if (!event) return res.status(200).end();

    // 若輸入「ID」則回傳GroupID（保留測試功能）
    if (event.message?.text === "ID") {
      return reply(event.replyToken, `群組ID：\n${GROUP_ID}`);
    }

    // 接收 Airtable 送出的webhook資料
    if (event.type === "message" && event.message.type === "text") {

      // === 文字輸入模式報修（僅測試用）===
      const text = event.message.text.split("\n");
      if (text.length >= 4){
        const [user, loc, cat, desc] = text;

        await base(TABLE).create({
          "報修單位 / 人": user,
          "報修地點(樓層+位置)": loc,
          "類別": cat,
          "問題描述": desc,
          "報修日期": new Date().toLocaleString("zh-TW"),
          "狀態": "待處理"
        });

        await push(`📢 新報修受理\n單位：${user}\n地點：${loc}\n類別：${cat}\n內容：${desc}`);
        return reply(event.replyToken, "報修已收到並已通知工務單位！");
      }
    }

    return res.status(200).send("OK");
  } 
  catch (e) {
    console.log("ERROR>>", e);
    return res.status(500).send("ERR");
  }
}

// ===== 送訊息給群組 =====
function push(msg){
  return client.pushMessage(GROUP_ID, { type:"text", text:msg });
}

// ===== 回覆訊息給個人 =====
function reply(token, msg){
  return client.replyMessage(token, { type:"text", text:msg });
}
