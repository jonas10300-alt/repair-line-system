import { Client } from "@line/bot-sdk";
import Airtable from "airtable";

const client = new Client({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
});

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base("appIf9jfbOlwnL893");
const TABLE = "工務報修系統";
const GROUP_ID = "C00791030a5dcd267c91cbef2aff931a5"; // ← 你的群ID已填入

export default async function handler(req, res) {
  try {
    const event = req.body.events?.[0];

    // 只有有人新增報修時 Airtable 會觸發這區塊
    if (req.body.type === "webhook" && req.body.base === "appIf9jfbOlwnL893") {

      const record = req.body.record;
      const user = record["報修單位 / 人"];
      const loc  = record["報修地點(樓層+位置)"];
      const cat  = record["類別"];
      const desc = record["問題描述"];
      const time = record["報修日期"] ?? new Date().toLocaleString("zh-TW");

      await client.pushMessage(GROUP_ID,{
        type:"text",
        text: `📢 工務報修通知\n\n單位：${user}\n地點：${loc}\n類別：${cat}\n內容：${desc}\n時間：${time}`
      });

      return res.status(200).send("PUSHED");
    }

    return res.status(200).send("OK");
  } catch(err){
    console.error(err);
    return res.status(500).send("ERR");
  }
}
