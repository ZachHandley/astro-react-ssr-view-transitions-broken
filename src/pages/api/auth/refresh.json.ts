import type { APIRoute } from "astro";
import { createCrossmint, CrossmintAuth } from "@crossmint/server-sdk";
import { CROSSMINT_API_SERVER_KEY } from "astro:env/server";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check both cookies and request body for refresh token
    let jwt = cookies.get("crossmint-jwt")?.value;
    let refreshToken = cookies.get("crossmint-refresh-token")?.value;

    const crossmint = createCrossmint({
      apiKey: CROSSMINT_API_SERVER_KEY,
    });

    const crossmintAuth = CrossmintAuth.from(crossmint, {
      cookieOptions: {
        httpOnly: true,
        domain: import.meta.env.SITE.replace("http://", ".").replace(
          `:6942`,
          ""
        ),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      },
    });

    // If we have a refreshToken from the body, use it directly
    if (refreshToken && jwt) {
      const session = await crossmintAuth.getSession({
        jwt,
        refreshToken,
      });

      const userData = await crossmintAuth.getUser(session.userId);

      return new Response(JSON.stringify({ session, userData }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      // Otherwise use the built-in handler
      const response = await crossmintAuth.handleCustomRefresh(request);
      return response as Response;
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to refresh session" }),
      {
        status: 401,
      }
    );
  }
};
