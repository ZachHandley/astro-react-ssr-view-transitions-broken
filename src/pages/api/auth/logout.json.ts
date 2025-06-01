import type { APIRoute } from "astro";

export interface LogoutResponse {
  success: boolean;
  warning?: string;
}

export const POST: APIRoute = async ({ cookies, session }) => {
  cookies.delete("crossmint-jwt", { path: "/" });
  cookies.delete("crossmint-refresh-token", { path: "/" });

  // Clear Astro session if available
  if (session) {
    // Get user ID from session if exists (for logging purposes)
    const user = await session.get("user");
    if (user) {
      console.log(`Logging out user: ${user.id}`);
    }
    session.delete("user");

    // Clear all session data
    session.destroy();
  }

  return new Response(JSON.stringify({ success: true } as LogoutResponse), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
