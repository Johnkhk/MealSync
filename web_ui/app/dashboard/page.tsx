// import AddRestaurant from "./components/add-restauraunt";

// export default function PortalPage() {
//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Portal</h1>
//       <p>Manage your restaurant here.</p>
//       <AddRestaurant />
//     </div>
//   );
// }

// mark as client component
"use client";

// importing necessary functions
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import CreateRestaurantForm from "./forms/create-restauraunt-form";
import RestaurantPortal from "./components/restaurant-portal";
import { Dashboard } from "./components/menu-editor";
import RestaurantList from "./components/restaurant-list";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  // extracting data from usesession as session
  return (
    // <div className="container mx-auto p-4">
    //   <h1 className="text-2xl font-bold mb-4">Manage your restaurant here.</h1>
    //   <p>Manage your restaurant here.</p>
    //   <RestaurantPortal />
    //   <button
    //     className="bg-red-600 py-2 px-6 rounded-md"
    //     onClick={() => signOut()}
    //   >
    //     Sign out
    //   </button>
    // </div>
    // <RestaurantList />
    <div className="flex flex-col h-full p-20 ">
      <Link href="/dashboard/restaurants">
        <Card className="flex flex-col items-center justify-center p-10">
          <h3>Manage Resturants</h3>
        </Card>
      </Link>
    </div>
  );
}
