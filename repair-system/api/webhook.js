import fetch from "node-fetch";
export default async function handler(req, res) {
  try {
    const event = req.body.events?.[0];
    if (!event) return res.sendStatus(200);

    const text = event.message?.text || "";
    const s = text.split("@");

    // ⚠ LINE 填寫格式：報修@單位/人@地點@問題@聯絡方式@緊急程度
    if (!text.startsWith("報修@")) {
      return res.status(200).send("格式需為：報修@單位@地點@問題@聯絡@緊急");
    }

    const fields = {
      "報修日期": new Date().toLocaleString("zh-TW"),
      "報修單位 / 人": s[1] || "",
      "報修地點(樓層+位置)": s[2] || "",
      "問題描述": s[3] || "",
      "聯絡方式 (單位+分機)": s[4] || "",
      "緊急程度 (選填)": s[5] || "",
      "狀態 (工務填寫)": "待處理"
    };

    await fetch(`https://api.airtable.com/v0/${process.env.BASE_ID}/${encodeURIComponent(process.env.TABLE_NAME)}`,{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${process.env.AIRTABLE_TOKEN}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({ fields })
    });

    return res.status(200).send("報修已記錄");
  } catch(e){
    return res.status(500).send("寫入失敗");
  }
}
