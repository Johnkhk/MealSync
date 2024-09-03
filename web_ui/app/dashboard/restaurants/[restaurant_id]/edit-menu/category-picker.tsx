"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PlusIcon } from "lucide-react"; // Import the PlusIcon
import Link from "next/link";
import { useAuthFetch } from "@/utils/authfetch";
import { usePathname } from "next/navigation";

export default function Component() {
  const pathname = usePathname(); // Get the current path using usePathname
  const pathSegments = pathname.split("/").filter((segment) => segment);
  const restaurantId = pathSegments[2];
  //   const okok = useAuthFetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}/categories/?restaurant_id=${restaurantId}`,
  //     {
  //       method: "GET",
  //     }
  //   );
  const [categories, setCategories] = useState([
    "Appetizers",
    "Entrees",
    "Desserts",
    "Drinks",
    "Specials",
  ]);

  const [activeCategory, setActiveCategory] = useState("General");

  // Function to handle adding a new category
  const handleAddCategory = () => {
    console.log("newCategory");
    const newCategory = prompt("Enter new category name:");
    if (newCategory) {
      try {
        console.log("restaurantIsssssssssd:", restaurantId);
        // Make a POST request to add the new category
        const response = useAuthFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
              name: newCategory,
            }),
          }
        );

        if (response && response.ok) {
          setCategories([...categories, newCategory]); // Update the category list on success
        } else {
          console.error("Failed to add category:", response?.statusText);
        }
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Categories</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="flex flex-col gap-4 text-sm text-muted-foreground">
          {/* Render categories dynamically */}
          {categories.map((category) => (
            <Link
              href="#"
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`${
                activeCategory === category ? "font-semibold text-primary" : ""
              }`}
            >
              {category}
            </Link>
          ))}

          {/* Add Category Button at the bottom */}
          <Button
            onClick={handleAddCategory}
            className="self-start mt-4 flex items-center gap-1 px-2 py-1 text-sm"
          >
            <PlusIcon size={18} />
            Add Category
          </Button>
        </nav>
      </div>
    </main>
  );
}
