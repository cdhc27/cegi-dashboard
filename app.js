const REFRESH_MS = 5000;
const $ = (id) => document.getElementById(id);
const format = (value, digits=2) => {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString("pt-BR", {minimumFractionDigits: digits, maximumFractionDigits: digits}) : "—";
};
function setText(id, value) { $(id).textContent = value; }
function money(value) { return Number.isFinite(Number(value)) ? "R$ " + format(value, 2) : "—"; }

async function refresh() {
  try {
    const response = await fetch("/.netlify/functions/telemetry", {cache:"no-store"});
    if (!response.ok) throw new Error("Não foi possível consultar os dados.");
    const data = await response.json();
    if (!data.ok) throw new Error(data.message || "Dados indisponíveis.");

    setText("voltage", format(data.V0, 1));
    setText("current", format(data.V1, 3));
    setText("power", format(data.V2, 1));
    setText("totalKwh", format(data.V3, 3));
    setText("cost", money(data.V4));
    setText("rate", format(data.V8, 2));
    setText("limit", money(data.V9));
    setText("todayKwh", format(data.V13, 2));
    setText("dailyChange", (Number(data.V14) > 0 ? "+" : "") + format(data.V14, 1) + "%");
    setText("referenceKwh", format(data.V16, 2));

    const pct = Number(data.V14);
    const width = Number.isFinite(pct) ? Math.max(0, Math.min(100, Math.abs(pct) / 100 * 100)) : 0;
    $("comparisonBar").style.width = width + "%";
    setText("comparisonCaption", Number.isFinite(pct) ? (pct > 0 ? "Consumo acima da referência" : pct < 0 ? "Consumo abaixo da referência" : "Consumo igual à referência") : "Aguardando leitura");

    $("connectionDot").className = "live-dot online";
    setText("connectionText", "SISTEMA ONLINE");
    setText("statusLabel", "Monitoramento ativo");
    setText("lastUpdated", new Date().toLocaleTimeString("pt-BR"));
    $("disclaimer").textContent = "Atualização automática a cada 5 segundos · Dados fornecidos pelo dispositivo CEGI.";
  } catch (error) {
    $("connectionDot").className = "live-dot offline";
    setText("connectionText", "SEM CONEXÃO");
    setText("statusLabel", "Aguardando conexão com o dispositivo");
    $("disclaimer").textContent = "Não foi possível atualizar os dados. A página tentará novamente automaticamente.";
    console.warn(error);
  }
}
refresh();
setInterval(refresh, REFRESH_MS);
