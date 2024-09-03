// // middleware.ts (or middleware.js)

// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   callbacks: {
//     authorized: ({ token }) => {
//       //   console.log("Middleware hit! Checking token:", token);
//       // Log the presence of the token and return true or false based on the token's existence
//       return !!token;
//     },
//   },
// });

// // Apply middleware to these paths
// export const config = {
//   matcher: ["/dashboard/:path*"], // Match all routes under /dashboard
// };

// middleware.ts

import { withAuth } from "next-auth/middleware";
import jwt from "jsonwebtoken";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      if (!token) {
        return false; // No token, not authorized
      }

      // Check if access token is expired
      const isAccessTokenExpired =
        typeof token.accessTokenExpires === "number" &&
        Date.now() >= token.accessTokenExpires;

      if (isAccessTokenExpired) {
        // Attempt to refresh the token if access token is expired
        try {
          const refreshToken = token.refreshToken; // Get refresh token from session
          if (!refreshToken) {
            return false; // No refresh token, not authorized
          }

          // Verify the refresh token
          jwt.verify(
            refreshToken as string,
            process.env.NEXTAUTH_SECRET as string
          );

          // If valid, allow access (or you can trigger a server-side refresh here)
          return true; // Token is valid, proceed
        } catch (error) {
          console.error("Refresh token expired or invalid:", error);
          return false; // Refresh token is expired or invalid, not authorized
        }
      }

      // If access token is valid, proceed
      return true;
    },
  },
});

// Apply middleware to these paths
export const config = {
  matcher: ["/dashboard/:path*"], // Match all routes under /dashboard
};
