"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

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

// Define the customization schema
const categoryFormSchema = z.object({
  category_name: z
    .string()
    .min(1, { message: "Name of category is required" })
    .max(100),
});

const form = useForm<z.infer<typeof categoryFormSchema>>({
  resolver: zodResolver(categoryFormSchema),
  defaultValues: {
    category_name: "",
  },
});

function onSubmit(values: z.infer<typeof categoryFormSchema>) {
  // Handle form submission
  console.log(values);
}

export function CategoryForm() {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="category_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
