// // // "use client";

// // // import { Restaurant } from "@/app/client_models/restaurant";
// // // import { Badge } from "@/components/ui/badge";
// // // import { Button } from "@/components/ui/button";
// // // import {
// // //   Card,
// // //   CardContent,
// // //   CardDescription,
// // //   CardHeader,
// // //   CardTitle,
// // // } from "@/components/ui/card";
// // // import {
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableHead,
// // //   TableHeader,
// // //   TableRow,
// // // } from "@/components/ui/table";
// // // import { CirclePlus } from "lucide-react";
// // // import { useSession } from "next-auth/react";
// // // import Link from "next/link";
// // // import { useEffect, useState } from "react";

// // // export default function RestaurantList() {
// // //   const { data: session, status } = useSession(); // Use status to check if session is loading
// // //   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
// // //   const [loading, setLoading] = useState<boolean>(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   useEffect(() => {
// // //     // Only fetch data if the session is authenticated
// // //     if (status !== "authenticated" || !session) return;

// // //     const fetchData = async () => {
// // //       setLoading(true); // Start loading
// // //       setError(null); // Clear any previous errors

// // //       try {
// // //         const response = await fetch(
// // //           `${process.env.NEXT_PUBLIC_API_URL}/restaurants`,
// // //           {
// // //             method: "GET",
// // //             headers: {
// // //               Authorization: `Bearer ${session.user.token}`, // Attach the token from the session
// // //             },
// // //           }
// // //         );

// // //         if (!response.ok) {
// // //           throw new Error(
// // //             `Failed to fetch restaurants: ${response.statusText}`
// // //           );
// // //         }

// // //         const data = await response.json();
// // //         setRestaurants(data.restaurants);
// // //       } catch (err: any) {
// // //         setError(err.message); // Set error if request fails
// // //       } finally {
// // //         setLoading(false); // End loading
// // //       }
// // //     };

// // //     fetchData();
// // //   }, [status, session]); // Only run effect when session becomes available

// // //   const handleAddRestaurant = async () => {
// // //     if (!session) return; // Ensure the session is available

// // //     try {
// // //       setLoading(true); // Start loading
// // //       setError(null); // Clear any previous errors

// // //       const response = await fetch(
// // //         `${process.env.NEXT_PUBLIC_API_URL}/restaurants`,
// // //         {
// // //           method: "POST",
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //             Authorization: `Bearer ${session.user.token}`, // Attach the token from the session
// // //           },
// // //           body: JSON.stringify({
// // //             name: "New Restaurant", // Replace with actual restaurant data
// // //             location: "New Location", // Replace with actual restaurant data
// // //           }),
// // //         }
// // //       );

// // //       if (!response.ok) {
// // //         throw new Error(`Failed to add restaurant: ${response.statusText}`);
// // //       }

// // //       const newRestaurant = await response.json();
// // //       setRestaurants((prev) => [...prev, newRestaurant]); // Add new restaurant to the list
// // //     } catch (err: any) {
// // //       setError(err.message); // Set error if request fails
// // //     } finally {
// // //       setLoading(false); // End loading
// // //     }
// // //   };

// // //   if (status === "loading" || loading) return <p>Loading...</p>; // Show loading state while fetching session or data
// // //   if (error) return <p>Error: {error}</p>; // Display error message

// // //   return (
// // //     <Card>
// // //       <CardHeader className="px-7">
// // //         <CardTitle>Restaurants</CardTitle>
// // //         <CardDescription>Manage your restaurants.</CardDescription>
// // //       </CardHeader>
// // //       <CardContent>
// // //         <Table>
// // //           <TableHeader>
// // //             <TableRow>
// // //               <TableHead>Restaurant Name</TableHead>
// // //               <TableHead>Location</TableHead>
// // //               <TableHead className="hidden md:table-cell">Date Added</TableHead>
// // //               <TableHead className="text-right">Edit Menu</TableHead>
// // //             </TableRow>
// // //           </TableHeader>
// // //           <TableBody>
// // //             {restaurants.map((restaurant) => (
// // //               <TableRow key={restaurant.id}>
// // //                 <TableCell>
// // //                   <div className="font-medium">{restaurant.name}</div>
// // //                   <div className="hidden text-sm text-muted-foreground md:inline">
// // //                     {restaurant.email}
// // //                   </div>
// // //                 </TableCell>
// // //                 <TableCell className="hidden md:table-cell">
// // //                   {restaurant.location}
// // //                 </TableCell>
// // //                 <TableCell className="hidden md:table-cell">
// // //                   {restaurant.created_at}
// // //                 </TableCell>
// // //                 <TableCell className="text-right">
// // //                   <Link href={`/dashboard/restaurants/${restaurant.id}`}>
// // //                     <Button variant="secondary" size="sm">
// // //                       Edit Menu
// // //                     </Button>
// // //                   </Link>
// // //                 </TableCell>
// // //               </TableRow>
// // //             ))}
// // //             <TableRow>
// // //               <TableCell colSpan={4} className="text-center">
// // //                 <Button
// // //                   className="flex space-x-16"
// // //                   onClick={handleAddRestaurant}
// // //                 >
// // //                   <CirclePlus />
// // //                   <p>Add a new restaurant</p>
// // //                 </Button>
// // //               </TableCell>
// // //             </TableRow>
// // //           </TableBody>
// // //         </Table>
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // }

// // "use client";

// // import { Restaurant } from "@/app/client_models/restaurant";
// // import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { CirclePlus } from "lucide-react";
// // import { useSession } from "next-auth/react";
// // import Link from "next/link";
// // import { useEffect, useState } from "react";
// // import CreateRestaurantForm from "../forms/create-restauraunt-form";

// // export default function RestaurantList() {
// //   const { data: session, status } = useSession(); // Use status to check if session is loading
// //   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [showForm, setShowForm] = useState<boolean>(false); // State to control form visibility

// //   useEffect(() => {
// //     // Only fetch data if the session is authenticated
// //     if (status !== "authenticated" || !session) return;

// //     const fetchData = async () => {
// //       setLoading(true); // Start loading
// //       setError(null); // Clear any previous errors

// //       try {
// //         const response = await fetch(
// //           `${process.env.NEXT_PUBLIC_API_URL}/restaurants`,
// //           {
// //             method: "GET",
// //             headers: {
// //               Authorization: `Bearer ${session.user.token}`, // Attach the token from the session
// //             },
// //           }
// //         );

// //         if (!response.ok) {
// //           throw new Error(
// //             `Failed to fetch restaurants: ${response.statusText}`
// //           );
// //         }

// //         const data = await response.json();
// //         setRestaurants(data.restaurants);
// //       } catch (err: any) {
// //         setError(err.message); // Set error if request fails
// //       } finally {
// //         setLoading(false); // End loading
// //       }
// //     };

// //     fetchData();
// //   }, [status, session]); // Only run effect when session becomes available

// //   const handleToggleForm = () => {
// //     setShowForm((prev) => !prev); // Toggle the form's visibility
// //   };

// //   if (status === "loading" || loading) return <p>Loading...</p>; // Show loading state while fetching session or data
// //   if (error) return <p>Error: {error}</p>; // Display error message

// //   return (
// //     <Card>
// //       <CardHeader className="px-7">
// //         <CardTitle>Restaurants</CardTitle>
// //         <CardDescription>Manage your restaurants.</CardDescription>
// //       </CardHeader>
// //       <CardContent>
// //         <Table>
// //           <TableHeader>
// //             <TableRow>
// //               <TableHead>Restaurant Name</TableHead>
// //               <TableHead>Location</TableHead>
// //               <TableHead className="hidden md:table-cell">Date Added</TableHead>
// //               <TableHead className="text-right">Edit Menu</TableHead>
// //             </TableRow>
// //           </TableHeader>
// //           <TableBody>
// //             {restaurants.map((restaurant) => (
// //               <TableRow key={restaurant.id}>
// //                 <TableCell>
// //                   <div className="font-medium">{restaurant.name}</div>
// //                   <div className="hidden text-sm text-muted-foreground md:inline">
// //                     {restaurant.email}
// //                   </div>
// //                 </TableCell>
// //                 <TableCell className="hidden md:table-cell">
// //                   {restaurant.location}
// //                 </TableCell>
// //                 <TableCell className="hidden md:table-cell">
// //                   {restaurant.created_at}
// //                 </TableCell>
// //                 <TableCell className="text-right">
// //                   <Link href={`/dashboard/restaurants/${restaurant.id}`}>
// //                     <Button variant="secondary" size="sm">
// //                       Edit Menu
// //                     </Button>
// //                   </Link>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //             <TableRow>
// //               <TableCell colSpan={4} className="text-center">
// //                 <Button className="flex space-x-16" onClick={handleToggleForm}>
// //                   <CirclePlus />
// //                   <p>Add a new restaurant</p>
// //                 </Button>
// //               </TableCell>
// //             </TableRow>
// //           </TableBody>
// //         </Table>

// //         {/* Conditionally render the form based on state */}
// //         {showForm && (
// //           <div className="mt-4">
// //             <CreateRestaurantForm />
// //           </div>
// //         )}
// //       </CardContent>
// //     </Card>
// //   );
// // }

// "use client";

// import { Restaurant } from "@/app/client_models/restaurant";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { CirclePlus } from "lucide-react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import CreateRestaurantForm from "./CreateRestaurantForm"; // Import the form component

// export default function RestaurantList() {
//   const { data: session, status } = useSession(); // Use status to check if session is loading
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showForm, setShowForm] = useState<boolean>(false); // State to control form visibility

//   const fetchRestaurants = async () => {
//     if (status !== "authenticated" || !session) return;

//     setLoading(true); // Start loading
//     setError(null); // Clear any previous errors

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/restaurants`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${session.user.token}`, // Attach the token from the session
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch restaurants: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setRestaurants(data.restaurants);
//     } catch (err: any) {
//       setError(err.message); // Set error if request fails
//     } finally {
//       setLoading(false); // End loading
//     }
//   };

//   useEffect(() => {
//     fetchRestaurants(); // Fetch the restaurant list when the component mounts or session becomes available
//   }, [status, session]);

//   const handleToggleForm = () => {
//     setShowForm((prev) => !prev); // Toggle the form's visibility
//   };

//   const handleFormSuccess = () => {
//     // Callback function to be called when the form submission is successful
//     fetchRestaurants(); // Re-fetch the restaurant list
//     setShowForm(false); // Optionally hide the form after success
//   };

//   if (status === "loading" || loading) return <p>Loading...</p>; // Show loading state while fetching session or data
//   if (error) return <p>Error: {error}</p>; // Display error message

//   return (
//     <Card>
//       <CardHeader className="px-7">
//         <CardTitle>Restaurants</CardTitle>
//         <CardDescription>Manage your restaurants.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Restaurant Name</TableHead>
//               <TableHead>Location</TableHead>
//               <TableHead className="hidden md:table-cell">Date Added</TableHead>
//               <TableHead className="text-right">Edit Menu</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {restaurants.map((restaurant) => (
//               <TableRow key={restaurant.id}>
//                 <TableCell>
//                   <div className="font-medium">{restaurant.name}</div>
//                   <div className="hidden text-sm text-muted-foreground md:inline">
//                     {restaurant.email}
//                   </div>
//                 </TableCell>
//                 <TableCell className="hidden md:table-cell">
//                   {restaurant.location}
//                 </TableCell>
//                 <TableCell className="hidden md:table-cell">
//                   {restaurant.created_at}
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <Link href={`/dashboard/restaurants/${restaurant.id}`}>
//                     <Button variant="secondary" size="sm">
//                       Edit Menu
//                     </Button>
//                   </Link>
//                 </TableCell>
//               </TableRow>
//             ))}
//             <TableRow>
//               <TableCell colSpan={4} className="text-center">
//                 <Button className="flex space-x-16" onClick={handleToggleForm}>
//                   <CirclePlus />
//                   <p>Add a new restaurant</p>
//                 </Button>
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>

//         {/* Conditionally render the form based on state */}
//         {showForm && (
//           <div className="mt-4">
//             <CreateRestaurantForm onSuccess={handleFormSuccess} />
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { Restaurant } from "@/app/client_models/restaurant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CreateRestaurantForm from "../forms/create-restauraunt-form";

export default function RestaurantList() {
  const { data: session, status } = useSession(); // Use status to check if session is loading
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false); // State to control form visibility

  const fetchRestaurants = async () => {
    if (status !== "authenticated" || !session) return;

    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurants`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.token}`, // Attach the token from the session
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch restaurants: ${response.statusText}`);
      }

      const data = await response.json();
      setRestaurants(data.restaurants);
    } catch (err: any) {
      setError(err.message); // Set error if request fails
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchRestaurants(); // Fetch the restaurant list when the component mounts or session becomes available
  }, [status, session]);

  const handleToggleForm = () => {
    setShowForm((prev) => !prev); // Toggle the form's visibility
  };

  const handleFormSuccess = () => {
    // Callback function to be called when the form submission is successful
    fetchRestaurants(); // Re-fetch the restaurant list
    setShowForm(false); // Optionally hide the form after success
  };

  if (status === "loading" || loading) return <p>Loading...</p>; // Show loading state while fetching session or data
  if (error) return <p>Error: {error}</p>; // Display error message

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Restaurants</CardTitle>
        <CardDescription>Manage your restaurants.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Restaurant Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="hidden md:table-cell">Date Added</TableHead>
              <TableHead className="text-right">Edit Menu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restaurants &&
              restaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell>
                    <div className="font-medium">{restaurant.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {restaurant.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {restaurant.location}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {restaurant.created_at}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/restaurants/${restaurant.id}`}>
                      <Button variant="secondary" size="sm">
                        Edit Menu
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                <Button className="flex space-x-16" onClick={handleToggleForm}>
                  <CirclePlus />
                  <p>Add a new restaurant</p>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Conditionally render the form based on state */}
        {showForm && (
          <div className="mt-4">
            <CreateRestaurantForm onSuccess={handleFormSuccess} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
