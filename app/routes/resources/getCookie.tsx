export default async function getCookieValue(
  cookieString: string | null
): Promise<string | null> {
  if (!cookieString) return null;
  const cookiePairs = cookieString.split(";");
  for (const pair of cookiePairs) {
    const [key, value] = pair.trim().split("=");
    if (key === "db") return value;
  }
  return null;
}
export async function getCredCookieValue(
  cookieString: string | null
): Promise<string | null> {
  if (!cookieString) return null;
  const cookiePairs = cookieString.split(";");
  for (const pair of cookiePairs) {
    const [key, value] = pair.trim().split("=");
    if (key === "cred") return value;
  }
  return null;
}
export async function getCredneed(
  cookieString: string | null
): Promise<string | null> {
  if (!cookieString) return null;
  const cookiePairs = cookieString.split(";");
  for (const pair of cookiePairs) {
    const [key, value] = pair.trim().split("=");
    if (key === "need") return value;
  }
  return null;
}
