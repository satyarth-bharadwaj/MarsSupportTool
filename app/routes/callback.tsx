// import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
// import { getSession, commitSession } from "~/session.server";

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   const url = new URL(request.url);
//   const code = url.searchParams.get("code");

//   if (!code) return redirect("/error");

//   const tokenRes = await fetch("https://YOUR_DOMAIN/oidc/2/token", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       grant_type: "authorization_code",
//       code,
//       redirect_uri: "https://mst.w-pp-mars-green-1189.bg1189-ppe.k8s.ln2.tpc.tesco.org/dashboard",
//       client_id: "7ffa7930-0afd-013d-cdd0-6a772dfb7ea337548",
//       client_secret: "3b18b45d10c092e9c0eb5c5c1c49ca13b75bcad864a72b85213ea6e9e416918c",
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
