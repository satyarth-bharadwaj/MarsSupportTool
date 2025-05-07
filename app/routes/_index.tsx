import { redirect } from "@remix-run/node";
import { databaseCookie } from "~/session.server";

export const loader = async () => {
  // Set the database cookie first
  const db = "PPE";
  
  // Prepare OIDC authentication parameters
  const clientId = process.env.CLIENT_ID || "";
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: "openid email profile",
    redirect_uri: "https://mst.w-pp-mars-green-1189.bg1189-ppe.k8s.ln2.tpc.tesco.org/dashboard",
    prompt: "login"
  });
  
  // Redirect to OIDC provider with cookie set
  return redirect(`https://loginppe.ourtesco.com/oidc/2/auth?${params.toString()}`, {
    headers: {
      "Set-Cookie": await databaseCookie.serialize(db),
    },
  });
};

export default function Layout() {
  return <></>;
}


// import { redirect } from "@remix-run/react";
// import { databaseCookie } from "~/session.server";
// import type { LoaderFunction } from "@remix-run/node";

// export const loader: LoaderFunction = async () => {
//   const db = "PPE";

//   return redirect("/dashboard", {
//     headers: {
//       "Set-Cookie": await databaseCookie.serialize(db),
//     },
//   });
// };
// export default function layout() {
//   return <></>;
// }