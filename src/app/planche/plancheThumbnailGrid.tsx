"use client";

import type { Planche } from "../clients/sanityClient";
import PlancheThumbnail from "./plancheThumbnail";
import { sizeOptions } from "./sizeOptions";
import ThumbnailSizeSelector from "./thumbnailSizeSelector";

import { useState } from "react";

type SizeOption = {
  key: string;
  label: string;
  width: number;
  height: number;
};

type Props = {
  planches: Planche[];
};

function distinct(value: string, index: number, array: Array<string>) {
  return array.indexOf(value) === index;
}


const PlancheThumbnailGrid = ({ planches }: Props) => {
  const [sizeIdx, setSizeIdx] = useState(0);

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
    <div className="overflow-y-auto flex flex-col sm:block">
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
      {plancheCategories.map((category: string) => {
        const pluralizedCategory = puralizedCategoryDictionary[category];
        return (
          <div key={pluralizedCategory} className="text-center my-8">
            <h2 className="text-2xl font-bold	">{pluralizedCategory}</h2>
            <div className={`flex flex-wrap gap-4 justify-center items-center mt-4 mb-12`}>
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
