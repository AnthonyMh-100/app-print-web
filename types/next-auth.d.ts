import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    username?: string | null;
    kind?: "owner" | "customer";
  }

  interface Session {
    user: {
      username?: string | null;
      kind?: "owner" | "customer";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string | null;
    kind?: "owner" | "customer";
    userId?: string | null;
  }
}