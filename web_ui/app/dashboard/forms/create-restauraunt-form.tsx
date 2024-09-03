"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the restaurant form schema
const restaurantFormSchema = z.object({
  name: z.string().min(1, { message: "Restaurant name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  website: z.string().url({ message: "Invalid website URL" }),
});

export default function CreateRestaurantForm({ onSuccess }) {
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof restaurantFormSchema>>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      name: "",
      location: "",
      phoneNumber: "",
      email: "",
      website: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof restaurantFormSchema>) => {
    if (!session || !session.user) {
      form.setError("name", { message: "User is not logged in" });
      return;
    }

    const token = session.user.token;
    if (!token) {
      form.setError("name", { message: "User is not logged in" });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurants`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            location: values.location,
            phone_number: values.phoneNumber,
            email: values.email,
            website: values.website,
          }),
        }
      );

      if (response.ok) {
        form.reset(); // Reset form fields
        onSuccess(); // Call the onSuccess callback to inform the parent of success
        alert("Restaurant added successfully!");
      } else {
        const errorText = await response.text();
        form.setError("name", {
          message: `Failed to add restaurant: ${errorText}`,
        });
      }
    } catch (error: any) {
      form.setError("name", { message: `Error: ${error.message}` });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter restaurant name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input type="url" placeholder="Enter website URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Restaurant</Button>
      </form>
    </Form>
  );
}
