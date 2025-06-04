import { envField } from "astro/config";

export const env = {
  schema: {
    CROSSMINT_API_KEY: envField.string({
      context: "client",
      access: "public",
      default:
        "YOUR_API_KEY",
    }),
    CROSSMINT_API_SERVER_KEY: envField.string({
      context: "server",
      access: "public",
      default:
        "YOUR_SERVER_KEY",
    }),
  },
};
