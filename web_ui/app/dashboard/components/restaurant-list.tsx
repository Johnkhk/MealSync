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

export default function RestaurantList() {
  const { data: session, status } = useSession(); // Use status to check if session is loading
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch data if the session is authenticated
    if (status !== "authenticated" || !session) return;

    const fetchData = async () => {
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
          throw new Error(
            `Failed to fetch restaurants: ${response.statusText}`
          );
        }

        const data = await response.json();
        setRestaurants(data.restaurants);
      } catch (err: any) {
        setError(err.message); // Set error if request fails
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [status, session]); // Only run effect when session becomes available

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
            {restaurants.map((restaurant) => (
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
                <Button className="flex spaxe-x-16" onClick={}>
                  <CirclePlus />
                  <p>Add a new restaurant</p>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
