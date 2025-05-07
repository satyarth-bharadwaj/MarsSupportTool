// import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
// import { getSession, commitSession } from "~/session.server";
// import dotenv from "dotenv";
// dotenv.config();

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   const url = new URL(request.url);
//   const code = url.searchParams.get("code");

//   if (!code) return redirect("/error");

//   // Validate environment variables
//   const clientId = process.env.CLIENT_ID;
//   const clientSecret = process.env.CLIENT_SECRET;

//   if (!clientId || !clientSecret) {
//     console.error("Environment variables CLIENT_ID or CLIENT_SECRET are not defined.");
//     return json({ error: "Server configuration error" }, { status: 500 });
//   }

//   const tokenRes = await fetch("https://YOUR_DOMAIN/oidc/2/token", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       grant_type: "authorization_code",
//       code,
//       redirect_uri: "https://mst.w-pp-mars-green-1189.bg1189-ppe.k8s.ln2.tpc.tesco.org/dashboard",
//       client_id: clientId,
//       client_secret: clientSecret,
//     }),
//   });

//   const tokenData = await tokenRes.json();

//   if (!tokenData.access_token) {
//     return json({ error: "Token exchange failed" }, { status: 401 });
//   }

//   // Store token in session
//   const session = await getSession(request.headers.get("Cookie"));
//   session.set("access_token", tokenData.access_token);

//   return redirect("/", {
//     headers: {
//       "Set-Cookie": await commitSession(session),
//     },
//   });
// };
