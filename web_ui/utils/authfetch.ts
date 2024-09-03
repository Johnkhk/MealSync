// // // // // // // // // utils/authFetch.ts
// // // // // // // // import { getSession } from "next-auth/react";

// // // // // // // // export async function authFetch(url: string, options: RequestInit = {}) {
// // // // // // // //   // Retrieve the session to get the token
// // // // // // // //   const session = await getSession();

// // // // // // // //   if (!session || !session.user?.token) {
// // // // // // // //     console.error(
// // // // // // // //       "No session or token found. User might not be authenticated."
// // // // // // // //     );
// // // // // // // //     throw new Error("Authentication required.");
// // // // // // // //   }

// // // // // // // //   // Set default headers with the token
// // // // // // // //   const headers = {
// // // // // // // //     "Content-Type": "application/json",
// // // // // // // //     Authorization: `Bearer ${session.user.token}`, // Add the Authorization header with the token
// // // // // // // //     ...options.headers,
// // // // // // // //   };

// // // // // // // //   // Merge default headers with any additional options
// // // // // // // //   const fetchOptions = {
// // // // // // // //     ...options,
// // // // // // // //     headers,
// // // // // // // //   };

// // // // // // // //   // Perform the fetch request with the merged options
// // // // // // // //   const response = await fetch(url, fetchOptions);

// // // // // // // //   // Check for errors and throw if needed
// // // // // // // //   if (!response.ok) {
// // // // // // // //     const errorMessage = `Failed to fetch: ${response.statusText}`;
// // // // // // // //     console.error(errorMessage);
// // // // // // // //     throw new Error(errorMessage);
// // // // // // // //   }

// // // // // // // //   return response;
// // // // // // // // }

// // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // import { useSession } from "next-auth/react";
// // // // // // // // import { useRouter } from "next/router";

// // // // // // // // export async function authFetch(url: string, options: RequestInit = {}) {
// // // // // // // //   const { data: session } = useSession();
// // // // // // // //   const router = useRouter();
// // // // // // // //   const [isRefreshing, setIsRefreshing] = useState(false);
// // // // // // // //   const [response, setResponse] = useState<Response | null>(null);

// // // // // // // //   const fetchWithAuth = async () => {
// // // // // // // //     if (!session) {
// // // // // // // //       router.push("/api/auth/signin");
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     try {
// // // // // // // //       const accessToken = session.user.token;

// // // // // // // //       const res = await fetch(url, {
// // // // // // // //         ...options,
// // // // // // // //         headers: {
// // // // // // // //           ...options.headers,
// // // // // // // //           Authorization: `Bearer ${accessToken}`,
// // // // // // // //         },
// // // // // // // //       });

// // // // // // // //       if (res.status === 401 && !isRefreshing) {
// // // // // // // //         // Token expired, refresh the token
// // // // // // // //         setIsRefreshing(true);
// // // // // // // //         const refreshRes = await fetch("/api/auth/refresh-token", {
// // // // // // // //           method: "POST",
// // // // // // // //           credentials: "include", // Make sure to include credentials for cookies
// // // // // // // //         });

// // // // // // // //         if (refreshRes.ok) {
// // // // // // // //           const data = await refreshRes.json();
// // // // // // // //           // Update the token in the session and retry the original request
// // // // // // // //           session.user.token = data.access_token; // Update token
// // // // // // // //           setIsRefreshing(false);
// // // // // // // //           return fetchWithAuth(); // Retry the original request
// // // // // // // //         } else {
// // // // // // // //           router.push("/api/auth/signin"); // Redirect to login if refresh fails
// // // // // // // //         }
// // // // // // // //       } else {
// // // // // // // //         setResponse(res);
// // // // // // // //       }
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Error in fetchWithAuth:", error);
// // // // // // // //       router.push("/api/auth/signin");
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   useEffect(() => {
// // // // // // // //     fetchWithAuth();
// // // // // // // //   }, [url]);

// // // // // // // //   return response;
// // // // // // // // }

// // // // // // // // hooks/useAuthFetch.ts
// // // // // // // import { useEffect, useState } from "react";
// // // // // // // import { useSession } from "next-auth/react";
// // // // // // // import { useRouter } from "next/navigation"; // Use the next/navigation router

// // // // // // // // Custom hook for authenticated fetching
// // // // // // // export function useAuthFetch(url: string, options: RequestInit = {}) {
// // // // // // //   const { data: session, status } = useSession(); // Get session data and loading status
// // // // // // //   const router = useRouter(); // Get router instance from next/navigation
// // // // // // //   const [isRefreshing, setIsRefreshing] = useState(false); // State for refreshing token
// // // // // // //   const [response, setResponse] = useState<Response | null>(null); // State for storing response

// // // // // // //   console.log("Session status:", status); // Log the session status
// // // // // // //   console.log("Trying to fetch with token:", session?.user?.token); // Log the current token

// // // // // // //   const fetchWithAuth = async () => {
// // // // // // //     if (status === "loading") {
// // // // // // //       // Wait until session status is resolved
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     if (!session) {
// // // // // // //       router.push("/api/auth/signin"); // Redirect to login if not authenticated
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     try {
// // // // // // //       const accessToken = session.user.token;

// // // // // // //       const res = await fetch(url, {
// // // // // // //         ...options,
// // // // // // //         headers: {
// // // // // // //           ...options.headers,
// // // // // // //           Authorization: `Bearer ${accessToken}`,
// // // // // // //         },
// // // // // // //       });

// // // // // // //       setResponse(res); // Set the response in the state
// // // // // // //     } catch (error) {
// // // // // // //       console.error("Error in fetchWithAuth:", error);
// // // // // // //       router.push("/api/auth/signin"); // Redirect to login on error
// // // // // // //     }
// // // // // // //   };

// // // // // // //   useEffect(() => {
// // // // // // //     fetchWithAuth(); // Run the fetch when the URL changes
// // // // // // //   }, [url, status]); // Dependency array includes session status

// // // // // // //   return response; // Return the response state
// // // // // // // }

// // // // // // // hooks/useAuthFetch.ts
// // // // // // import { useEffect, useState, useCallback } from "react";
// // // // // // import { useSession } from "next-auth/react";
// // // // // // import { useRouter } from "next/navigation";

// // // // // // // Custom hook for authenticated fetching
// // // // // // export function useAuthFetch(url: string, options: RequestInit = {}) {
// // // // // //   const { data: session, status } = useSession(); // Get session data and loading status
// // // // // //   const router = useRouter(); // Get router instance from next/navigation
// // // // // //   const [isRefreshing, setIsRefreshing] = useState(false); // State for refreshing token
// // // // // //   const [response, setResponse] = useState<Response | null>(null); // State for storing response
// // // // // //   const [error, setError] = useState<Error | null>(null); // State for storing error
// // // // // //   const [loading, setLoading] = useState<boolean>(true); // State to handle loading status

// // // // // //   console.log("Session status:", status); // Log the session status
// // // // // //   console.log("Trying to fetch with token:", session?.user?.token); // Log the current token

// // // // // //   const fetchWithAuth = useCallback(async () => {
// // // // // //     if (status === "loading") {
// // // // // //       // Wait until session status is resolved
// // // // // //       return;
// // // // // //     }

// // // // // //     if (!session) {
// // // // // //       router.push("/api/auth/signin"); // Redirect to login if not authenticated
// // // // // //       return;
// // // // // //     }

// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       const accessToken = session.user.token;

// // // // // //       const res = await fetch(url, {
// // // // // //         ...options,
// // // // // //         headers: {
// // // // // //           ...options.headers,
// // // // // //           Authorization: `Bearer ${accessToken}`,
// // // // // //         },
// // // // // //       });

// // // // // //       if (res.status === 401 && !isRefreshing) {
// // // // // //         // Token expired, refresh the token
// // // // // //         setIsRefreshing(true);
// // // // // //         const refreshRes = await fetch("/api/auth/refresh-token", {
// // // // // //           method: "POST",
// // // // // //           credentials: "include", // Include credentials for cookies
// // // // // //         });

// // // // // //         if (refreshRes.ok) {
// // // // // //           const data = await refreshRes.json();
// // // // // //           // Update the token in the session and retry the original request
// // // // // //           session.user.token = data.access_token; // Update token
// // // // // //           setIsRefreshing(false);
// // // // // //           return fetchWithAuth(); // Retry the original request
// // // // // //         } else {
// // // // // //           router.push("/api/auth/signin"); // Redirect to login if refresh fails
// // // // // //         }
// // // // // //       } else {
// // // // // //         setResponse(res);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       setError(error as Error); // Set error state
// // // // // //       router.push("/api/auth/signin"); // Redirect to login on error
// // // // // //     } finally {
// // // // // //       setLoading(false); // Set loading state to false after the fetch completes
// // // // // //     }
// // // // // //   }, [url, options, session, status, router, isRefreshing]);

// // // // // //   // Fetch data when the hook is first called or when the url changes
// // // // // //   useEffect(() => {
// // // // // //     fetchWithAuth();
// // // // // //   }, [fetchWithAuth]);

// // // // // //   return { response, error, loading, fetchWithAuth }; // Return response, error, loading state, and the fetch function
// // // // // // }

// // // // // import { useSession } from "next-auth/react";

// // // // // export function useAuthFetch(url: string, options: RequestInit = {}) {
// // // // //   const { data: session, status } = useSession(); // this can handle refreshing the token

// // // // //   const fetchWithAuth = async () => {
// // // // //     if (status === "loading") {
// // // // //       return; // Wait until session is resolved
// // // // //     }

// // // // //     if (!session || !session.user?.token) {
// // // // //       console.error(
// // // // //         "No session or token found. User might not be authenticated."
// // // // //       );
// // // // //       throw new Error("Authentication required.");
// // // // //     }

// // // // //     const headers = {
// // // // //       "Content-Type": "application/json",
// // // // //       Authorization: `Bearer ${session.user.token}`,
// // // // //       ...options.headers,
// // // // //     };

// // // // //     const fetchOptions = {
// // // // //       ...options,
// // // // //       headers,
// // // // //     };

// // // // //     const response = await fetch(url, fetchOptions);

// // // // //     if (!response.ok) {
// // // // //       const errorMessage = `Failed to fetch: ${response.statusText}`;
// // // // //       console.error(errorMessage);
// // // // //       throw new Error(errorMessage);
// // // // //     }

// // // // //     return response;
// // // // //   };

// // // // //   return fetchWithAuth;
// // // // // }

// // // // import { useEffect, useState } from "react";
// // // // import { useSession } from "next-auth/react";

// // // // export function useAuthFetch(url: string, options: RequestInit = {}) {
// // // //   const { data: session, status } = useSession(); // Get the session data and loading status
// // // //   const [response, setResponse] = useState<Response | null>(null); // State to store the response
// // // //   const [error, setError] = useState<Error | null>(null); // State to store any errors
// // // //   const [loading, setLoading] = useState<boolean>(true); // State to store loading status

// // // //   useEffect(() => {
// // // //     const fetchData = async () => {
// // // //       if (status === "loading") return; // Wait until session is resolved

// // // //       if (!session || !session.user?.token) {
// // // //         setError(new Error("Authentication required.")); // Set error if not authenticated
// // // //         console.error(
// // // //           "No session or token found. User might not be authenticated."
// // // //         );
// // // //         setLoading(false);
// // // //         return;
// // // //       }

// // // //       try {
// // // //         const headers = {
// // // //           "Content-Type": "application/json",
// // // //           Authorization: `Bearer ${session.user.token}`,
// // // //           ...options.headers,
// // // //         };

// // // //         const fetchOptions = {
// // // //           ...options,
// // // //           headers,
// // // //         };

// // // //         const res = await fetch(url, fetchOptions);

// // // //         if (!res.ok) {
// // // //           const errorMessage = `Failed to fetch: ${res.statusText}`;
// // // //           console.error(errorMessage);
// // // //           throw new Error(errorMessage);
// // // //         }

// // // //         setResponse(res); // Set the response state
// // // //       } catch (err) {
// // // //         setError(err as Error); // Set any caught errors
// // // //       } finally {
// // // //         setLoading(false); // Set loading to false after fetch completes
// // // //       }
// // // //     };

// // // //     fetchData(); // Call the fetch function when the hook is used
// // // //   }, [url, options, session, status]); // Dependencies: refetch if these change

// // // //   return { response, error, loading }; // Return the response, error, and loading state
// // // // }

// // // import { useEffect, useState } from "react";
// // // import { useSession } from "next-auth/react";

// // // export function useAuthFetch(url: string, options: RequestInit = {}) {
// // //   const { data: session, status } = useSession(); // Get the session data and loading status
// // //   const [response, setResponse] = useState<Response | null>(null); // State to store the response
// // //   const [error, setError] = useState<Error | null>(null); // State to store any errors
// // //   const [loading, setLoading] = useState<boolean>(true); // State to store loading status

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       if (status === "loading" || !session || !session.user?.token) {
// // //         // Don't fetch until session is fully loaded or if not authenticated
// // //         setLoading(false);
// // //         return;
// // //       }

// // //       try {
// // //         setLoading(true);
// // //         const headers = {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${session.user.token}`,
// // //           ...options.headers,
// // //         };

// // //         const fetchOptions = {
// // //           ...options,
// // //           headers,
// // //         };

// // //         const res = await fetch(url, fetchOptions);

// // //         if (!res.ok) {
// // //           const errorMessage = `Failed to fetch: ${res.statusText}`;
// // //           console.error(errorMessage);
// // //           throw new Error(errorMessage);
// // //         }

// // //         setResponse(res); // Set the response state
// // //       } catch (err) {
// // //         setError(err as Error); // Set any caught errors
// // //       } finally {
// // //         setLoading(false); // Set loading to false after fetch completes
// // //       }
// // //     };

// // //     fetchData(); // Call the fetch function when the hook is used
// // //   }, [url, options, session, status]); // Only run the effect when these dependencies change

// // //   return { response, error, loading }; // Return the response, error, and loading state
// // // }

// // import { useEffect, useState, useCallback } from "react";
// // import { useSession } from "next-auth/react";

// // export function useAuthFetch(url: string, options: RequestInit = {}) {
// //   const { data: session, status } = useSession(); // Get the session data and loading status
// //   const [response, setResponse] = useState<Response | null>(null); // State to store the response
// //   const [error, setError] = useState<Error | null>(null); // State to store any errors
// //   const [loading, setLoading] = useState<boolean>(true); // State to store loading status

// //   const fetchData = useCallback(async () => {
// //     if (status === "loading") return; // Wait until session is resolved

// //     if (!session || !session.user?.token) {
// //       setError(new Error("Authentication required.")); // Set error if not authenticated
// //       console.error(
// //         "No session or token found. User might not be authenticated."
// //       );
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       setLoading(true); // Set loading before fetch
// //       const headers = {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${session.user.token}`,
// //         ...options.headers,
// //       };

// //       const fetchOptions = {
// //         ...options,
// //         headers,
// //       };

// //       const res = await fetch(url, fetchOptions);

// //       if (!res.ok) {
// //         const errorMessage = `Failed to fetch: ${res.statusText}`;
// //         console.error(errorMessage);
// //         throw new Error(errorMessage);
// //       }

// //       setResponse(res); // Set the response state
// //     } catch (err) {
// //       setError(err as Error); // Set any caught errors
// //     } finally {
// //       setLoading(false); // Set loading to false after fetch completes
// //     }
// //   }, [url, options, session, status]); // Ensure dependencies are properly managed

// //   useEffect(() => {
// //     fetchData(); // Call fetchData function when the hook is used
// //   }, [fetchData]); // Dependency on fetchData to ensure it runs only once or when dependencies change

// //   return { response, error, loading }; // Return the response, error, and loading state
// // }

// import { useSession } from 'next-auth/react';

// export function useAuthFetch(session) {
//   return async (url, options = {}) => {
//     if (!session) {
//       throw new Error('No session available');
//     }

//     // Extract the token from the session
//     const token = session?.accessToken;

//     // Include the Authorization header with the token
//     const headers = {
//       ...options.headers,
//       Authorization: `Bearer ${token}`,
//     };

//     const response = await fetch(url, {
//       ...options,
//       headers,
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch');
//     }

//     return response.json();
//   };
// }

// import { useState } from 'react';

// export function useAuthFetch(session) {
//   const [loading, setLoading] = useState(false);

//   const fetchWithAuth = async (url, options = {}) => {
//     if (!session) {
//       throw new Error('No session available');
//     }

//     const token = session?.accessToken;
//     const headers = {
//       ...options.headers,
//       Authorization: `Bearer ${token}`,
//     };

//     setLoading(true); // Set loading to true before making the request

//     try {
//       const response = await fetch(url, {
//         ...options,
//         headers,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch');
//       }

//       return response.json();
//     } finally {
//       setLoading(false); // Set loading to false after the request completes
//     }
//   };

//   return { fetchWithAuth, loading };
// }

import { useState } from "react";

export function useAuthFetch(session: any) {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWithAuth = async (
    url: string,
    options: any = {}
  ): Promise<any> => {
    if (!session) {
      throw new Error("No session available");
    }

    // const token = session?.accessToken;
    const token = session.user.token;
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    setLoading(true); // Set loading to true before making the request

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      return response.json();
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return { fetchWithAuth, loading };
}
