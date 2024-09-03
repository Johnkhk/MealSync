// import { MenuCategory, MenuItem } from "@/app/client_models/restaurant";
// import { Button } from "@/components/ui/button";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function CategoryView({ category }: { category: MenuCategory }) {
//   const { data: session, status } = useSession();
//   const [menuItemsLoading, setMenuItemsLoading] = useState<boolean>(false);
//   const [menuItemsFetchError, setMenuItemsFetchError] = useState<string | null>(
//     null
//   );
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

//   const [deleteCategoryLoading, setDeleteCategoryLoading] =
//     useState<boolean>(false);
//   const [deleteCategoryError, setDeleteCategoryError] = useState<string | null>(
//     null
//   );

//   const fetchMenuItems = async () => {
//     if (status !== "authenticated" || !session) return;
//     setMenuItemsLoading(true);
//     setMenuItemsFetchError(null);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/menu-items?category_id=${category.id}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${session.user.token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch categories: ${response.statusText}`);
//       }

//       const data: MenuItem[] = await response.json();
//       setMenuItems(data);
//     } catch (err: any) {
//       setMenuItemsFetchError(err.message);
//     } finally {
//       setMenuItemsLoading(false);
//     }
//   };

//   //   useEffect(() => {
//   //     fetchMenuItems();
//   //   }, [status, session]);

//   const deleteCategory = async () => {
//     if (status !== "authenticated" || !session) return;
//     setDeleteCategoryLoading(true);
//     setDeleteCategoryError(null);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/categories/${category.id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${session.user.token}`,
//           },
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`Failed to delete category: ${response.statusText}`);
//       }
//     } catch (err: any) {
//       setDeleteCategoryError(err.message);
//     } finally {
//       setDeleteCategoryLoading(false);
//     }
//   };

//   return (
//     <div className="h-full w-full">
//       <h1>{category.name}</h1>
//       <Button onClick={deleteCategory}>Delete Category</Button>
//     </div>
//   );
// }

import { MenuCategory, MenuItem } from "@/app/client_models/restaurant";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateMenuItemForm from "./add-menu-item-form";

export default function CategoryView({
  category,
  onDeleteCategory,
}: {
  category: MenuCategory;
  onDeleteCategory: (id: number) => void;
}) {
  const { data: session, status } = useSession();
  const [menuItemsLoading, setMenuItemsLoading] = useState<boolean>(false);
  const [menuItemsFetchError, setMenuItemsFetchError] = useState<string | null>(
    null
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [deleteCategoryLoading, setDeleteCategoryLoading] = useState(false);
  const [deleteCategoryError, setDeleteCategoryError] = useState<string | null>(
    null
  );
  const fetchMenuItems = async () => {
    if (status !== "authenticated" || !session) return;
    setMenuItemsLoading(true);
    setMenuItemsFetchError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/menu-items?category_id=${category.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch menu items for ${category.name}: ${response.statusText}`
        );
      }

      const data: MenuItem[] = await response.json();
      setMenuItems(data);
    } catch (err: any) {
      setMenuItemsFetchError(err.message);
    } finally {
      setMenuItemsLoading(false);
    }
  };

  //   useEffect(() => {
  //     fetchMenuItems();
  //   }, [status, session]);

  const deleteCategory = async () => {
    if (status !== "authenticated" || !session) return;
    setDeleteCategoryLoading(true);
    setDeleteCategoryError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${category.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.statusText}`);
      }
      onDeleteCategory(category.id); // Notify parent of successful deletion
    } catch (err: any) {
      setDeleteCategoryError(err.message);
    } finally {
      setDeleteCategoryLoading(false);
    }
  };

  return (
    <div className="h-full w-full">
      <h1>{category.name}</h1>
      {deleteCategoryError && (
        <p className="text-red-500">{deleteCategoryError}</p>
      )}
      <CreateMenuItemForm
        onSuccess={() => {
          console.log("AYAYAYA");
        }}
      />
      <Button onClick={deleteCategory} disabled={deleteCategoryLoading}>
        {deleteCategoryLoading ? "Deleting..." : "Delete Category"}
      </Button>
    </div>
  );
}
