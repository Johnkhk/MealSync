"use client";

import { useFieldArray, Control } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { menuItemFormSchema } from "./add-menu-item-form";

interface CustomizationGroupProps {
  groupIndex: number;
  control: Control<z.infer<typeof menuItemFormSchema>>;
  removeGroup: (index: number) => void;
}

const CustomizationGroup = ({
  groupIndex,
  control,
  removeGroup,
}: CustomizationGroupProps) => {
  const {
    fields: options,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `customizationGroups.${groupIndex}.options`,
  });

  return (
    <div key={groupIndex} className="mb-4 p-4 border rounded-md">
      <FormField
        control={control}
        name={`customizationGroups.${groupIndex}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Group Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g Choose your size" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`customizationGroups.${groupIndex}.max_selections`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max Selections</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter max selections"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Dynamic Options */}
      <div className="mt-4">
        <h4 className="text-md font-semibold">Options</h4>
        {options.map((option, optionIndex) => (
          <div key={option.id} className="flex items-center space-x-2">
            <FormField
              control={control}
              name={`customizationGroups.${groupIndex}.options.${optionIndex}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Option Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter option name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`customizationGroups.${groupIndex}.options.${optionIndex}.additional_price`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Additional Price</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter additional price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Remove Option Button */}
            <Button
              onClick={() => removeOption(optionIndex)}
              className="ml-2"
              variant="destructive"
            >
              Remove
            </Button>
          </div>
        ))}

        {/* Add Option Button */}
        <Button
          onClick={() => appendOption({ name: "", additional_price: "" })}
          className="mt-2"
        >
          Add Option
        </Button>
      </div>

      {/* Remove Customization Group */}
      <Button onClick={() => removeGroup(groupIndex)} className="mt-2">
        Remove Group
      </Button>
    </div>
  );
};

export default CustomizationGroup;
