"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomizationGroup from "./customization-group";

export const menuItemFormSchema = z.object({
  name: z.string().min(1, { message: "Menu item name is required" }),
  description: z.string().optional(),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Invalid price format" }),
  customizationGroups: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Group name is required" }),
        max_selections: z
          .number()
          .min(1, { message: "At least one selection is required" }),
        options: z
          .array(
            z.object({
              name: z.string().min(1, { message: "Option name is required" }),
              additional_price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
                message: "Invalid price format",
              }),
            })
          )
          .min(1, { message: "At least one option is required" }),
      })
    )
    .optional(),
});

export default function CreateMenuItemForm({ onSuccess }) {
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof menuItemFormSchema>>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      customizationGroups: [],
    },
    mode: "onSubmit", // Validate only on submit
  });

  const {
    fields: customizationGroups,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({
    control: form.control,
    name: "customizationGroups",
  });

  const onSubmit = async (values: z.infer<typeof menuItemFormSchema>) => {
    // Authentication and form submission logic
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Menu Item Fields */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Menu Item Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter menu item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Customization Groups */}
        <div>
          <h3 className="text-lg font-semibold">Customization Groups</h3>
          {customizationGroups.map((group, groupIndex) => (
            <CustomizationGroup
              key={group.id}
              groupIndex={groupIndex}
              control={form.control}
              removeGroup={removeGroup}
            />
          ))}
          <Button
            onClick={() =>
              appendGroup({ name: "", max_selections: 1, options: [] })
            }
          >
            Add Customization Group
          </Button>
        </div>

        {/* Button to submit the form */}
        <Button type="submit">Add Menu Item</Button>
      </form>
    </Form>
  );
}
