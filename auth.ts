import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { getBusiness } from "@/lib/business";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        username: {},
        password: {},
        kind: {},
      },
      authorize: async (credentials) => {
        const { username, password, kind } = credentials ?? {};

        if (typeof username !== "string" || typeof password !== "string")
          return null;

        if (kind === "owner") {
          const business = await getBusiness();

          if (!business?.passwordHash) return null;
          if (business.email !== username) return null;

          const isValidPassword = await verifyPassword(
            password,
            business.passwordHash,
          );

          if (!isValidPassword) return null;

          return {
            id: "owner",
            name: business.ownerName ?? business.name,
            email: business.email,
            kind: "owner",
          };
        }

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return null;

        const {
          id,
          name,
          email,
          username: userUsername,
          password: hashedPassword,
        } = user;

        if (!hashedPassword) return null;

        const isValidPassword = await verifyPassword(password, hashedPassword);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: String(id),
          name,
          email,
          username: userUsername,
          kind: "customer",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.kind) {
        token.kind = user.kind;
      }

      if (user?.username) {
        token.username = user.username;
      }

      if (user?.kind === "owner") {
        token.userId = "owner";
      } else if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true },
        });
        token.userId = dbUser ? String(dbUser.id) : null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.userId === "string") {
          session.user.id = token.userId;
        }
        if (typeof token.username === "string") {
          session.user.username = token.username;
        }
        if (token.kind === "owner" || token.kind === "customer") {
          session.user.kind = token.kind;
        }
      }
      return session;
    },
    signIn: async ({ user, account }) => {
      const { name, email, image } = user || {};
      const { provider } = account || {};

      if (typeof email !== "string" || typeof account?.provider !== "string")
        return false;

      const userInfo = await prisma.user.findUnique({
        where: { email, name, provider },
      });

      if (userInfo) return true;

      await prisma.user.create({
        data: {
          name,
          email,
          image,
          provider: account!.provider,
        },
      });

      return true;
    },
  },
});
