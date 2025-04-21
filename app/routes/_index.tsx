import { redirect } from "@remix-run/react";
import { databaseCookie } from "~/session.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const db = "PPE";

//return redirect("https://loginppe.ourtesco.com/oidc/2/.well-known/openid-configuration", {

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await databaseCookie.serialize(db),
    },
  });
};
export default function layout() {
  return <></>;
}



// import { redirect } from "@remix-run/node";

// export const loader = async () => {
//   const params = new URLSearchParams({
//     client_id: "7ffa7930-0afd-013d-cdd0-6a772dfb7ea337548",
//     response_type: "code",
//     scope: "openid email profile",
//     redirect_uri: "https://mst.w-pp-mars-green-1189.bg1189-ppe.k8s.ln2.tpc.tesco.org/dashboard",
//   });

//   return redirect(`https://loginppe.ourtesco.com/oidc/2/auth?${params.toString()}`);
  

// };
// export default function layout() {
//   return <></>
// };
