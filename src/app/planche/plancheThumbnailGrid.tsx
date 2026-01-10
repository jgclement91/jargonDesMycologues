"use client";

import { useMediaQuery } from "usehooks-ts";
import type { Planche } from "../clients/sanityClient";
import PlancheThumbnail from "./plancheThumbnail";
import { sizeOptions } from "./sizeOptions";
import ThumbnailSizeSelector from "./thumbnailSizeSelector";

import { useEffect, useState } from "react";

type Props = {
  planches: Planche[];
};

function distinct(value: string, index: number, array: Array<string>) {
  return array.indexOf(value) === index;
}


const PlancheThumbnailGrid = ({ planches }: Props) => {
  const isMobile = useMediaQuery('(max-width: 640px)');

  const [sizeIdx, setSizeIdx] = useState(isMobile ? 0 : 1);

  useEffect(() => {
    setSizeIdx(isMobile ? 0 : 1);
  }, [isMobile]);

  const plancheCategories = planches
    .map((planche) => planche.categories)
    .flat()
    .filter(distinct);

  const plancheByCategory = (category: string) => {
    return planches.filter((planche) => planche.categories.includes(category));
  };

  const puralizedCategoryDictionary: Record<string, string> = {
    "Planche anatomique": "Planches anatomiques",
    "Planche de caractères": "Planches de caractères",
    "Autre": "Autres"
  };

  return (
    <div className="flex flex-col sm:block">
      {
        !isMobile && (
          <div className="w-full flex flex-col items-center mt-6 mb-2">
            <ThumbnailSizeSelector
              onSizeChange={(newSizeKey) => {
                const newSizeIdx = sizeOptions.findIndex((opt) => opt.key === newSizeKey);
                if (newSizeIdx !== -1) {
                  setSizeIdx(newSizeIdx);
                }
              }}
            />
          </div>
        )
      }
      {plancheCategories.map((category: string) => {
        const pluralizedCategory = puralizedCategoryDictionary[category];
        return (
          <div key={pluralizedCategory} className="text-center my-8">
            <h2 className="text-2xl font-bold	">{pluralizedCategory}</h2>
            <div className={`flex flex-wrap gap-4 justify-center items-center mt-4 mb-12 px-4 sm:px-0`}>
              {plancheByCategory(category).map((planche) => {
                const size = sizeOptions[sizeIdx];
                const key = (size?.key || "small") as keyof typeof planche.images;
                return PlancheThumbnail(
                  planche.images[key],
                  planche.label,
                  planche.title,
                  size
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlancheThumbnailGrid;
