import { getOAuthState } from "better-auth/api";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins/custom-session";
import { genericOAuth } from "better-auth/plugins/generic-oauth";
import { eq } from "drizzle-orm";
import { db } from "./db";
import * as schema from "@/db/schema";

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    twitch: {
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
    },
  },
  plugins: [
    nextCookies(),
    customSession(async ({ user, session }) => {
      const [row] = await db
        .select({ role: schema.user.role, needsRoleSelection: schema.user.needsRoleSelection })
        .from(schema.user)
        .where(eq(schema.user.id, user.id))
        .limit(1);
      return {
        user: {
          ...user,
          role: row?.role ?? "sub",
          needsRoleSelection: row?.needsRoleSelection ?? false,
        },
        session,
      };
    }),
    genericOAuth({
      config: [
        {
          providerId: "kick",
          clientId: process.env.KICK_CLIENT_ID!,
          clientSecret: process.env.KICK_CLIENT_SECRET!,
          authorizationUrl: "https://id.kick.com/oauth/authorize",
          tokenUrl: "https://id.kick.com/oauth/token",
          scopes: ["user:read"],
          pkce: true,
          getUserInfo: async (tokens) => {
            const res = await fetch("https://api.kick.com/public/v1/users", {
              headers: { Authorization: `Bearer ${tokens.accessToken}` },
            });
            if (!res.ok) return null;
            const data = await res.json();
            const user = Array.isArray(data) ? data[0] : data;
            if (!user?.id) return null;
            return {
              id: String(user.id),
              name: user.username ?? user.name ?? user.slug ?? "Kick User",
              email: user.email ?? `${user.id}@kick.placeholder`,
              image: user.profile_pic ?? user.avatar ?? undefined,
              emailVerified: Boolean(user.email),
            };
          },
        },
      ],
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET!,
  basePath: "/api/auth",
  trustedOrigins: [baseURL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "sub",
        input: true,
      },
      needsRoleSelection: {
        type: "boolean",
        required: true,
        defaultValue: false,
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          if (!ctx) return { data: user };
          const isOAuthCallback =
            ctx.path === "/callback/:id" ||
            (typeof ctx.path === "string" && ctx.path.includes("callback"));
          if (!isOAuthCallback) return { data: user };

          const state = (await getOAuthState()) as { role?: string } | null;
          const role = state?.role;
          if (role === "streamer" || role === "sub") {
            return {
              data: {
                ...user,
                role,
                needsRoleSelection: false,
              },
            };
          }
          return {
            data: {
              ...user,
              needsRoleSelection: true,
            },
          };
        },
      },
    },
  },
});
