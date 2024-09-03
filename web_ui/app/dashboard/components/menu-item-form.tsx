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
const customizationSchema = z.object({
  type: z
    .string()
    .min(1, { message: "Customization type is required." })
    .max(100),
  option: z
    .string()
    .min(1, { message: "Customization option is required." })
    .max(100),
  additionalPrice: z
    .number({ invalid_type_error: "Additional price must be a number." })
    .min(0, { message: "Additional price must be 0 or greater." })
    .optional(),
});

// Define the main form schema
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Item name must be at least 2 characters." })
    .max(255),
  description: z
    .string()
    .max(500, { message: "Description must not exceed 500 characters." })
    .optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number." })
    .min(0, { message: "Price must be 0 or greater." })
    .positive({ message: "Price must be a positive number." }),
  customizations: z.array(customizationSchema).optional(),
});

export function MenuItemForm() {
  // Define the form using useForm and zodResolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      customizations: [{ type: "", option: "", additionalPrice: 0 }],
    },
  });

  // Use useFieldArray to manage customizations dynamically
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customizations",
  });

  // Define the submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
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

  //   return (
  //     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
  //       {/* Item Name */}
  //       <div className="flex flex-col">
  //         <label className="mb-2 font-medium">Item Name:</label>
  //         <input
  //           type="text"
  //           {...form.register("name")}
  //           className="p-2 border border-gray-300 rounded"
  //         />
  //         {form.formState.errors.name && (
  //           <p className="text-red-500 text-sm">
  //             {form.formState.errors.name.message}
  //           </p>
  //         )}
  //       </div>

  //       {/* Description */}
  //       <div className="flex flex-col">
  //         <label className="mb-2 font-medium">Description:</label>
  //         <textarea
  //           {...form.register("description")}
  //           className="p-2 border border-gray-300 rounded"
  //         />
  //         {form.formState.errors.description && (
  //           <p className="text-red-500 text-sm">
  //             {form.formState.errors.description.message}
  //           </p>
  //         )}
  //       </div>

  //       {/* Price */}
  //       <div className="flex flex-col">
  //         <label className="mb-2 font-medium">Price:</label>
  //         <input
  //           type="number"
  //           {...form.register("price", { valueAsNumber: true })}
  //           className="p-2 border border-gray-300 rounded"
  //         />
  //         {form.formState.errors.price && (
  //           <p className="text-red-500 text-sm">
  //             {form.formState.errors.price.message}
  //           </p>
  //         )}
  //       </div>

  //       {/* Customizations */}
  //       <div>
  //         <h3 className="text-lg font-semibold mb-2">Customizations</h3>
  //         {fields.map((field, index) => (
  //           <div
  //             key={field.id}
  //             className="mb-4 p-4 border border-gray-200 rounded"
  //           >
  //             <div className="flex flex-col mb-2">
  //               <label className="font-medium">Type:</label>
  //               <input
  //                 type="text"
  //                 {...form.register(`customizations.${index}.type`)}
  //                 className="p-2 border border-gray-300 rounded"
  //               />
  //               {form.formState.errors.customizations?.[index]?.type && (
  //                 <p className="text-red-500 text-sm">
  //                   {form.formState.errors.customizations[index]?.type?.message}
  //                 </p>
  //               )}
  //             </div>
  //             <div className="flex flex-col mb-2">
  //               <label className="font-medium">Option:</label>
  //               <input
  //                 type="text"
  //                 {...form.register(`customizations.${index}.option`)}
  //                 className="p-2 border border-gray-300 rounded"
  //               />
  //               {form.formState.errors.customizations?.[index]?.option && (
  //                 <p className="text-red-500 text-sm">
  //                   {form.formState.errors.customizations[index]?.option?.message}
  //                 </p>
  //               )}
  //             </div>
  //             <div className="flex flex-col mb-2">
  //               <label className="font-medium">Additional Price:</label>
  //               <input
  //                 type="number"
  //                 {...form.register(`customizations.${index}.additionalPrice`, {
  //                   valueAsNumber: true,
  //                 })}
  //                 className="p-2 border border-gray-300 rounded"
  //               />
  //               {form.formState.errors.customizations?.[index]
  //                 ?.additionalPrice && (
  //                 <p className="text-red-500 text-sm">
  //                   {
  //                     form.formState.errors.customizations[index]?.additionalPrice
  //                       ?.message
  //                   }
  //                 </p>
  //               )}
  //             </div>
  //             <button
  //               type="button"
  //               onClick={() => remove(index)}
  //               className="text-red-500 text-sm"
  //             >
  //               Remove Customization
  //             </button>
  //           </div>
  //         ))}
  //         <button
  //           type="button"
  //           onClick={() => append({ type: "", option: "", additionalPrice: 0 })}
  //           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
  //         >
  //           Add Customization
  //         </button>
  //       </div>

  //       {/* Submit Button */}
  //       <button
  //         type="submit"
  //         className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
  //       >
  //         Add Menu Item
  //       </button>
  //     </form>
  //   );
}
