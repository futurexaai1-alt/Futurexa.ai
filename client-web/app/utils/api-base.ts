export function resolveApiBaseUrl(env: any): string {
  const apiBaseUrlRaw =
    typeof env?.API_BASE_URL === "string" && env.API_BASE_URL.length > 0
      ? env.API_BASE_URL.trim()
      : "";

  if (apiBaseUrlRaw) {
    return /^https?:\/\//i.test(apiBaseUrlRaw)
      ? apiBaseUrlRaw
      : `https://${apiBaseUrlRaw}`;
  }

  if (env?.API || (typeof env?.API_BASE_URL === "object" && env.API_BASE_URL)) {
    return "";
  }

  return "";
}
