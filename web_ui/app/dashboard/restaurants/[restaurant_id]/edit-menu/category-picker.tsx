"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { MenuCategory } from "@/app/client_models/restaurant";
import CategoryView from "./category-view";

export default function Component() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split("/").filter((segment) => segment);
  const restaurantId = parseInt(pathSegments[2], 10);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<MenuCategory | null>(
    null
  );

  // Fetch categories function
  const fetchCategories = async () => {
    if (status !== "authenticated" || !session) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories?restaurant_id=${restaurantId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data: MenuCategory[] = await response.json();
      setCategories(data);

      // Default to the first category if there's no active category
      if (data.length > 0 && !activeCategory) {
        setActiveCategory(data[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [status, session]);

  // Update active category if the list changes and no category is currently active
  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const handleAddCategory = async () => {
    if (!session || !session.user) {
      alert("You must be logged in to add a category.");
      return;
    }

    const token = session.user.token;
    if (!token) {
      alert("You must be logged in to add a category.");
      return;
    }

    const newCategoryName = prompt("Enter new category name:");
    if (newCategoryName) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
              name: newCategoryName,
            }),
          }
        );

        if (response.ok) {
          const createdCategory: MenuCategory = await response.json();
          setCategories((prevCategories) => [
            ...(prevCategories || []), // Ensure prevCategories is an array
            createdCategory,
          ]);

          if (!activeCategory) {
            setActiveCategory(createdCategory); // Set new category as active if no active category
          }
        } else {
          console.error("Failed to add category:", response?.statusText);
        }
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleCategoryClick = (category: MenuCategory) => {
    setActiveCategory(category);
  };

  const handleDeleteCategory = (deletedCategoryId: number) => {
    setCategories((prevCategories) => {
      const updatedCategories = prevCategories.filter(
        (category) => category.id !== deletedCategoryId
      );

      // If the deleted category was the active one, reset the active category
      if (activeCategory?.id === deletedCategoryId) {
        setActiveCategory(
          updatedCategories.length > 0 ? updatedCategories[0] : null
        );
      }

      return updatedCategories;
    });
  };

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Categories</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="flex flex-col gap-4 text-sm text-muted-foreground">
          {/* Render categories dynamically */}
          {categories &&
            categories.map((category) => (
              <a
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`cursor-pointer ${
                  activeCategory?.id === category.id
                    ? "font-semibold text-primary"
                    : ""
                }`}
              >
                {category.name}
              </a>
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

        {/* Display CategoryView for the active category */}
        {activeCategory && (
          <div className="category-viewer p-4 border-l">
            <CategoryView
              category={activeCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>
        )}
      </div>
    </main>
  );
}
