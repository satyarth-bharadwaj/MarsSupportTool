export async function generateIdentityToken(
  credentials: string,
  dbValue: string | null
): Promise<string> {
  try {
    const identityTokenUrl =
      dbValue === "PPE"
        ? "https://api-ppe.tesco.com/identity/v4/issue-token/token"
        : "https://api.tesco.com/identity/v4/issue-token/token";

    const identityToken = `Basic ${credentials}`;
    const body = { grant_type: "client_credentials", scope: "service" };
    const headers = new Headers();
    headers.append("Authorization", identityToken);
    headers.append("Content-Type", "application/json");

    const identityResponse = await fetch(identityTokenUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const jsonresponse = await identityResponse.json();
    return jsonresponse.access_token;
  } catch (error) {
    console.error("An error occurred inside tokenGenrator:", error);
    return JSON.stringify(error, null, 2);
  }
}

export async function generateIdentityResponse(
  credentials: string,
  dbValue: string | null
): Promise<{ access_token: string; expires_in: number }> {
  try {
    const identityTokenUrl =
      dbValue === "PPE"
        ? "https://api-ppe.tesco.com/identity/v4/issue-token/token"
        : "https://api.tesco.com/identity/v4/issue-token/token";

    const identityToken = `Basic ${credentials}`;
    const body = { grant_type: "client_credentials", scope: "service" };

    const headers = new Headers();
    headers.append("Authorization", identityToken);
    headers.append("Content-Type", "application/json");

    const identityResponse = await fetch(identityTokenUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const jsonResponse = await identityResponse.json();

    if (!identityResponse.ok) {
      throw new Error(JSON.stringify(jsonResponse));
    }

    return jsonResponse as { access_token: string; expires_in: number };
  } catch (error) {
    console.error("An error occurred inside generateIdentityResponse:", error);
    throw error;
  }
}

export async function generateCustomerToken(
  credentials: string,
  Clubcard: string,
  dbValue: string | null
): Promise<string> {
  try {
    const identityTokenUrl =
      dbValue === "PPE"
        ? "https://api-ppe.tesco.com/identity/v3/api/auth/oauth/v2/token"
        : "https://api.tesco.com/identity/v3/api/auth/oauth/v2/token";

    const body = {
      client_id: credentials,
      grant_type: "clubcard",
      clubcard: Clubcard,
    };

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const identityResponse = await fetch(identityTokenUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!identityResponse.ok) {
      throw new Error(`HTTP error! status: ${identityResponse.status}`);
    }

    const jsonresponse = await identityResponse.json();
    return jsonresponse.access_token;
  } catch (error) {
    console.error("An error occurred inside generateCustomerToken:", error);
    return JSON.stringify(error, null, 2);
  }
}

// export async function generateClubcardToken(
//   credentials: string,
//   dbValue: string | null
// ): Promise<string> {
//   try {
//     const identityTokenUrl =
//       dbValue === "PPE"
//         ? "https://api-ppe.tesco.com/identity/v3/api/auth/oauth/v2/token"
//         : "https://api.tesco.com/identity/v3/api/auth/oauth/v2/token";

//     const headers = {
//       "Content-Type": "application/json",
//       traceId: "test-admin-token",
//     };

//     console.log("URL:", identityTokenUrl);
//     console.log("Headers:", headers);
//     console.log("Body:", body);

//     const identityResponse = await fetch(identityTokenUrl, {
//       method: "POST",
//       headers,
//       body,
//     });

//     if (!identityResponse.ok) {
//       throw new Error(`HTTP error! status: ${identityResponse.status}`);
//     }

//     const jsonResponse = await identityResponse.json();
//     return jsonResponse.access_token;
//   } catch (error) {
//     console.error("An error occurred inside generateCustomerToken:", error);
//     return JSON.stringify(error, null, 2);
//   }
// }
