/** Derives WebSocket URL from the same origin as `NEXT_PUBLIC_API_URL` (REST base ends with `/api`). */
export function getWebSocketUrl(): string {
  const api =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:8000/api";
  const trimmed = api.replace(/\/$/, "");
  const withoutApi = trimmed.replace(/\/api\/?$/i, "");
  const isHttps = /^https:/i.test(withoutApi);
  const wsScheme = isHttps ? "wss" : "ws";
  const rest = withoutApi.replace(/^https?:\/\//i, "");
  return `${wsScheme}://${rest}/ws`;
}
