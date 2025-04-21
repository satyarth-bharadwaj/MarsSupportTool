export async function getCustomerUUID(
  clubcard: string,
  dbValue: string | null,
  token: string
): Promise<string> {
  try {
    const identityTokenUrl =
      dbValue === "PPE"
        ? "https://api-ppe.tesco.com/identity/v4/cardnumbers/clubcard/get-by-number"
        : "https://api.tesco.com/identity/v4/cardnumbers/clubcard/get-by-number";

    const body = {
      clubcard_number: clubcard,
    };

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", token);

    const identityResponse = await fetch(identityTokenUrl, {
      method: "GET",
      headers,
      body: JSON.stringify(body),
    });

    if (!identityResponse.ok) {
      throw new Error(`HTTP error! status: ${identityResponse.status}`);
    }

    const jsonresponse = await identityResponse.json();
    return jsonresponse.access_token;
  } catch (error) {
    console.error("An error occurred inside generateClubcardToken:", error);
    return JSON.stringify(error, null, 2);
  }
}
