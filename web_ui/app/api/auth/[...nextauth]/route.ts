import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt, { Secret } from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }: any) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider_id: profile?.sub,
              email: user.email,
              role: "owner",
              provider: "google",
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "Failed to add or retrieve user from the database:",
            errorText
          );
          return false;
        }

        const userDataResp = await response.json();
        user.id = userDataResp.user.id;
        console.log("User successfully added or retrieved from the database.");
        return true;
      } catch (error) {
        console.error(
          "Error adding or retrieving user from the database:",
          error
        );
        return false;
      }
    },

    async jwt({ token, user }: any) {
      // Set initial token values when user signs in
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.accessToken = jwt.sign(
          { sub: user.id, email: user.email },
          process.env.NEXTAUTH_SECRET ?? "",
          { expiresIn: "15m" } // Access token expires in 15 minutes
          // { expiresIn: "10s" } // Access token expires in 15 minutes
        );

        // Generate initial refresh token with 7 days expiry
        token.refreshToken = jwt.sign(
          { sub: user.id, email: user.email },
          process.env.NEXTAUTH_SECRET ?? "",
          { expiresIn: "7d" } // Refresh token expires in 7 days
        );
      }

      // Decode the access token to check its expiry
      const decodedAccessToken: any = jwt.decode(token.accessToken);

      // Check if the access token has expired
      const isAccessTokenExpired =
        decodedAccessToken?.exp && Date.now() >= decodedAccessToken.exp * 1000;

      if (isAccessTokenExpired) {
        console.log("Access token expired, attempting to refresh...");
        try {
          // Validate and decode the refresh token
          jwt.verify(token.refreshToken, process.env.NEXTAUTH_SECRET as Secret);

          // If the refresh token is valid, generate a new access token
          token.accessToken = jwt.sign(
            { sub: token.sub, email: token.email },
            process.env.NEXTAUTH_SECRET ?? "",
            { expiresIn: "15m" } // Access token expires in 15 minutes
            // { expiresIn: "10s" } // Access token expires in 15 minutes
          );

          // Optionally, generate a new refresh token
          token.refreshToken = jwt.sign(
            { sub: token.sub, email: token.email },
            process.env.NEXTAUTH_SECRET ?? "",
            { expiresIn: "7d" } // Refresh token expires in 7 days
          );
        } catch (error) {
          console.error("Failed to refresh access token:", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.token = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export { handler as GET, handler as POST };
