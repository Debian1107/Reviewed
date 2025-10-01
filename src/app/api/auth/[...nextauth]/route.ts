import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // your login logic
        return { id: "1", name: "Test User", email: credentials?.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // 👈 redirect here instead of /api/auth/error
    error: "/login", // optional: redirect errors here too
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
