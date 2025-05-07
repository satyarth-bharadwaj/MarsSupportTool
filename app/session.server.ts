import { createCookie } from "@remix-run/node";

import { createCookieSessionStorage } from "@remix-run/node";

export const databaseCookie = createCookie("db", {
  maxAge: 60 * 60,
  path: "/",
  sameSite: "lax",
});
export const CredentialsCookie = createCookie("cred", {
  maxAge: 60 * 60,
  path: "/",
  sameSite: "lax",
});
export const credNeeded = createCookie("need", {
  maxAge: 60 * 60,
  path: "/",
  sameSite: "lax",
});


export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    maxAge: 60 * 1,
    secrets: ["/session"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
