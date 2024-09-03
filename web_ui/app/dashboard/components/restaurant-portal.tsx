import { useState } from "react";
import CreateRestaurantForm from "../forms/create-restauraunt-form";
import RestaurantsByOwner from "./restaurant-list";

export default function RestaurantPortal() {
  // State to manage the visibility of the CreateRestaurantForm
  const [showForm, setShowForm] = useState(false);

  // Function to toggle the visibility of the form
  const toggleForm = () => setShowForm((prev) => !prev);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {/* Button to toggle the form */}
      <button
        onClick={toggleForm}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {showForm ? "Cancel" : "Add Restaurant"}
      </button>

      {/* Conditionally render the form based on showForm state */}
      {showForm && <CreateRestaurantForm />}
      <RestaurantsByOwner />
    </div>
  );
}
