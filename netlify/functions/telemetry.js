const PINS = ["V0","V1","V2","V3","V4","V8","V9","V13","V14","V16"];

exports.handler = async function () {
  const token = process.env.BLYNK_AUTH_TOKEN;
  const region = process.env.BLYNK_BASE_URL || "https://blynk.cloud";
  if (!token) {
    return { statusCode: 503, headers: cors(), body: JSON.stringify({ok:false,message:"A integração ainda não foi configurada."}) };
  }

  try {
    const values = await Promise.all(PINS.map(async (pin) => {
      const url = `${region}/external/api/get?token=${encodeURIComponent(token)}&${pin}`;
      const response = await fetch(url, { headers: { "Accept": "text/plain" } });
      if (!response.ok) throw new Error(`Blynk respondeu ${response.status} para ${pin}`);
      const raw = (await response.text()).trim();
      const value = Number(raw.replace(/^["']|["']$/g, ""));
      if (!Number.isFinite(value)) throw new Error(`Valor inválido recebido em ${pin}`);
      return [pin, value];
    }));

    return {
      statusCode: 200,
      headers: { ...cors(), "Cache-Control": "no-store" },
      body: JSON.stringify({ ok:true, updatedAt:new Date().toISOString(), ...Object.fromEntries(values) })
    };
  } catch (error) {
    return { statusCode: 502, headers: cors(), body: JSON.stringify({ok:false,message:"Não foi possível obter os dados do Blynk."}) };
  }
};

function cors() {
  return { "Content-Type":"application/json", "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"Content-Type" };
}
