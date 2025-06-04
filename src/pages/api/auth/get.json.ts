import type { APIRoute } from "astro";
import { createCrossmint, CrossmintAuth } from "@crossmint/server-sdk";
import { CROSSMINT_API_SERVER_KEY } from "astro:env/server";

export const POST: APIRoute = async ({ request, cookies, session }) => {
  try {
    // Check both cookies and request body for refresh token
    const sessionUser = await session?.get("user");
    const sessionSession = await session?.get("session");
    let jwt = cookies.get("crossmint-jwt")?.value;
    let refreshToken = cookies.get("crossmint-refresh-token")?.value;

    if (sessionUser && sessionSession && jwt && refreshToken) {
      return new Response(JSON.stringify({ user: sessionUser, session: sessionSession }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const crossmint = createCrossmint({
      apiKey: CROSSMINT_API_SERVER_KEY,
    });

    const crossmintAuth = CrossmintAuth.from(crossmint, {
      cookieOptions: {
        httpOnly: true,
      },
    });

    // If we have a refreshToken from the body, use it directly
    if (refreshToken && jwt) {
      const foundSession = await crossmintAuth.getSession({
        jwt,
        refreshToken,
      });

      const user = await crossmintAuth.getUser(foundSession.userId);

      return new Response(JSON.stringify({ session: foundSession, user }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    return new Response(JSON.stringify({ error: "No session found" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error refreshing session:", error);
    return new Response(
      JSON.stringify({ error: "Failed to refresh session" }),
      {
        status: 500,
      }
    );
  }
};
