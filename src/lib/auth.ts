import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import { redisDB } from "./db";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

export const authOptions = {
  adapter: UpstashRedisAdapter(redisDB),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = (await redisDB.get(`user:${token.id}`)) as User | null

      if(!dbUser) {
        token.id = user.id
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image
      }
    },
    redirect() {
        return '/dashboard'
    }
  },
} satisfies NextAuthOptions;

export function getSession(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiResponse, NextApiRequest]
    | []
) {
  return getServerSession(...args, authOptions);
}