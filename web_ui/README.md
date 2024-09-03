# Web UI

## Authentication

Authentication is handled on the client side using NextAuth.js. The authentication flow is as follows:

1. Entry Point for Authentication:

The entry point for the authentication flow is the file: web_ui/app/api/auth/[...nextauth]/route.ts. This file sets up NextAuth.js with the required providers (e.g., Google) and defines the callbacks for handling sign-in, JWT token management, and session management.

2. Sign-In with Providers:

When a user attempts to sign in, NextAuth.js interacts with the specified providers (such as Google) to handle the OAuth flow. The user's credentials are verified by the provider, and NextAuth.js receives an authentication response containing the user's profile and tokens.

3. JWT Token Management:

Upon successful sign-in, NextAuth.js uses the jwt callback to generate an access token (short-lived, typically 15 minutes) and a refresh token (longer-lived, typically 7 days). The access token is used to authenticate API requests, while the refresh token is used to generate new access tokens when the current one expires.

4. Session Management:

The session callback is used to map token data to the session object. This session object is available on the client side and includes user information and authentication tokens.

5. Route Protection with Middleware:

Route protection is handled using middleware.ts. The withAuth function from NextAuth.js is used to protect specific routes defined by a matcher pattern. If a user attempts to access a protected route without proper authentication, they are redirected to the sign-in page.

6. Automatic Token Refresh:

When the access token expires, NextAuth.js uses the refresh token to obtain a new access token without requiring the user to sign in again. This is handled automatically by the jwt callback, which checks the expiration and refreshes the token as needed.

7. Client-Side Authentication State:

On the client side, the useSession hook from NextAuth.js is used to access the current authentication state. This hook provides information on whether the user is authenticated and allows access to the user's session data.

8. Debugging and Security:

Debugging is enabled (debug: true) to log authentication-related events, which helps during development. The secret used for signing and verifying tokens is securely stored in environment variables (NEXTAUTH_SECRET).