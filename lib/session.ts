import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { Adapter, AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { SessionInterface, UserProfile } from "@/common.types";
import { createUser, getUser } from "./actions";
import { create } from "domain";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          iss: "grafbase",
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secret
      );
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodeToken = jsonwebtoken.verify(token!, secret) as JWT;
      return decodeToken;
    },
  },
  theme: {
    colorScheme: "light",
    logo: "/logo.png",
  },
  callbacks: {
    async session({ session }) {
      const email = session?.user?.email as string;

      try {
        const data = (await getUser(email)) as { user?: UserProfile };

        const newSessions = {
          ...session,
          user: {
            ...session.user,
            ...data.user,
          },
        };

        return newSessions;
      } catch (error) {
        console.log("Error retrieving user data", error);
        return session;
      }
    },
    // async signIn({ user }: { user: AdapterUser | User }) {
    //   // Problem is here going inside catch block;
    //   try {
    //     const userExists = await getUser(user?.email as string) as {
    //       user?: UserProfile;
    //     };
    //     console.log(userExists, 'userExists'); 
    //     if (!userExists.user) {
    //       await createUser(
    //         user.name as string,
    //         user.email as string,
    //         user.image as string
    //       );
    //     }

    //     return true;
    //   } catch (error: any) {
    //     console.log(error.message, "Error in catch");
    //     return false;
    //   }
    // },
  },
};

export const getCurrentUser = async () => {
  const session = (await getServerSession(authOptions)) as SessionInterface;
  return session;
};
