import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { checkUserLoggedIn } from "../login/route";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 🔑 Your login logic here (DB check, API call, etc.)
        const userLoggedIn = await checkUserLoggedIn(
          credentials?.email || "",
          credentials?.password || ""
        );
        return userLoggedIn;
        // if (credentials?.email === "test@test.com" && credentials?.password === "1234") {
        //   return { id: "1", name: "Test User", email: credentials.email };
        // }
        // return null; // ❌ failed login
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      console.log("🟢 JWT callback before:", token, user);
      // When user logs in for the first time
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name,
          email: token.email,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
