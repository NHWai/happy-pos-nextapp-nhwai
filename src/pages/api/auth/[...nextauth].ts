import { config } from "@/config/config";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    }),
    // ...add more providers here
  ],
  secret: config.nextAuthSecret,
  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/signout",
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

export default NextAuth(authOptions);
