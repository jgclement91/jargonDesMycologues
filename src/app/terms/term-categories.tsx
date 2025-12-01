"use client";

import { useMediaQuery } from "usehooks-ts";
import { useState } from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCategoryDetails } from "../constants/categories";

import "./term-categories.css";

type Props = {
  categories: string[];
};

const TermCategoriesDesktop = ({ categories }: Props) => {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex pl-4 gap-8 self-center">
        {categories.map((categoryName: string) => {
          const category = getCategoryDetails(categoryName);

          if (!category) {
            return <></>;
          }

          return (
            <Tooltip key={categoryName}>
              <TooltipTrigger asChild>
                <div
                  tabIndex={0}
                  className="inline-block focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded content-center"
                >
                  <Image
                    className="min-w-[55px]"
                    alt={category.text}
                    src={category.icon}
                    width={category.dimensions.width}
                    height={category.dimensions.height}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                <p>{category.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

const TermCategoriesMobile = ({ categories }: Props) => {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  const handleTooltipToggle = (categoryName: string) => {
    setOpenTooltip((prev) => (prev === categoryName ? null : categoryName));
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex pl-4 gap-8 self-center">
        {categories.map((categoryName: string) => {
          const category = getCategoryDetails(categoryName);

          if (!category) {
            return <></>;
          }

          const isOpen = openTooltip === categoryName;

          return (
            <Tooltip
              key={categoryName}
              open={isOpen}
              onOpenChange={(open) => {
                if (!open && isOpen) {
                  setOpenTooltip(null);
                }
              }}
            >
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTooltipToggle(categoryName)}
                  className="inline-block focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded content-center bg-transparent border-0 p-0 cursor-pointer"
                  aria-label={category.text}
                >
                  <Image
                    className="min-w-[55px]"
                    alt={category.text}
                    src={category.icon}
                    width={category.dimensions.width}
                    height={category.dimensions.height}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                <p>{category.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

const TermCategories = ({ categories }: Props) => {
  if (!categories) {
    return <></>;
  }

  const isMobile = useMediaQuery("(max-width: 1024px)");

  return isMobile ? (
    <TermCategoriesMobile categories={categories} />
  ) : (
    <TermCategoriesDesktop categories={categories} />
  );
};

export default TermCategories;
