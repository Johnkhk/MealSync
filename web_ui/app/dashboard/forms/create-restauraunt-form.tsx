"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { authFetch } from "@/utils/authfetch";

export default function CreateRestaurantForm() {
  const { data: session } = useSession(); // Fetch the logged-in user session
  const [name, setName] = useState("asdasd");
  const [location, setLocation] = useState("asdad");
  const [phoneNumber, setPhoneNumber] = useState("asdasd");
  const [email, setEmail] = useState("asdas@asdasd.com");
  const [website, setWebsite] = useState("https://aa.com"); // Add state for website
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if session exists and get the logged-in user's ID
    if (!session || !session.user) {
      setMessage("User is not logged in");
      return;
    }

    const token = session.user.token;
    if (!token) {
      setMessage("User is not logged in");
      return;
    }

    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurants`,
        {
          method: "POST",
          body: JSON.stringify({
            name,
            location,
            phone_number: phoneNumber,
            email,
            website, // Include website in the submission
          }),
        },
        token
      );

      if (response.ok) {
        setMessage("Restaurant added successfully!");
        // Optionally reset the form fields or close the form
        setName("");
        setLocation("");
        setPhoneNumber("");
        setEmail("");
        setWebsite(""); // Reset website field
      } else {
        const errorText = await response.text();
        setMessage(`Failed to add restaurant: ${errorText}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Restaurant Name"
        required
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="url"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        placeholder="Website"
        className="p-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Restaurant
      </button>
      {message && <p className="text-red-500">{message}</p>}
    </form>
  );
}
