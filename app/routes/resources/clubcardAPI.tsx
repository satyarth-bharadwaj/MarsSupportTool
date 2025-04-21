export async function clubcardDetails(
  token: string,
  dbValue: string | null,
  clubcard: string
): Promise<string> {
  try {
    const identityTokenUrl =
      dbValue === "PPE"
        ? "https://api-ppe.tesco.com/identity/v4/cardnumbers/clubcard/get-by-number"
        : "https://api.tesco.com/identity/v4/cardnumbers/clubcard/get-by-number";

    const accessToken = `Bearer ${token}`;
    const headers = new Headers();
    headers.append("Authorization", accessToken);
    headers.append("Content-Type", "application/json"); // Ensure Content-Type is set

    // Remove extra quotes from the clubcard number
    const trimClubcard = clubcard.replace(/^"(.*)"$/, "$1").trim();

    const body = JSON.stringify({
      clubcard_number: trimClubcard,
    });

    console.log("Request Body:", body); // Log the request body for debugging

    const identityResponse = await fetch(identityTokenUrl, {
      method: "POST",
      headers,
      body,
    });

    if (!identityResponse.ok) {
      const errorText = await identityResponse.text(); // Get the response text for more details
      throw new Error(
        `HTTP error! status: ${identityResponse.status}, response: ${errorText}`
      );
    }

    const jsonResponse = await identityResponse.json(); // Parse the JSON response
    console.log(JSON.stringify(jsonResponse, null, 2));
    return JSON.stringify(jsonResponse, null, 2);
  } catch (error) {
    console.error("An error occurred inside clubcardDetails:", error);
    return JSON.stringify(error, null, 2);
  }
}
