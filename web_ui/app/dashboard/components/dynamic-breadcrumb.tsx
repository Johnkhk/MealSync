"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SlashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function DynamicBreadcrumb() {
  const pathname = usePathname(); // Get the current path using usePathname

  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Remove the first segment if it's "dashboard" to avoid double counting
  const dynamicSegments =
    pathSegments[0] === "dashboard" ? pathSegments.slice(1) : pathSegments;

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {/* Static Home or Dashboard link */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dynamically generate breadcrumb items and separators */}
        {dynamicSegments.map((segment, index) => {
          // Construct the path up to the current segment
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

          // Convert segment name to title case for display
          const segmentName = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              {index === dynamicSegments.length - 1 ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{segmentName}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                // Other segments: Render as links
                <BreadcrumbItem>
                  <BreadcrumbLink href={href}>{segmentName}</BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
