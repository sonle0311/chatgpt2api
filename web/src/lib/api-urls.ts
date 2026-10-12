/** Use the API server, not the image-storage/public-image URL in settings. */
export function getApiUrls(apiUrl: string, browserOrigin: string) {
  const service = (apiUrl.trim() || browserOrigin.trim()).replace(/\/+$/, "");
  return {
    service,
    openAI: service ? `${service}/v1` : "",
    swagger: service ? `${service}/docs` : "",
    schema: service ? `${service}/openapi.json` : "",
  };
}
