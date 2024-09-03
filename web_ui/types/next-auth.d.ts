// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessTokenExpires: number;
      refreshToken: string;
      token?: string; // Add token to the Session user for accessing JWT
      id?: string;
      internalUserId?: string;
    };
  }
}
