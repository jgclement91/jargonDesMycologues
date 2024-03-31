"use client";

import { useMediaQuery } from "usehooks-ts";
import { Planche } from "../clients/sanityClient";
import PlancheThumbnail from "./plancheThumbnail";

type Props = {
  planches: Planche[];
};

function distinct(value: string, index: number, array: Array<string>) {
  return array.indexOf(value) === index;
}

const PlancheThumbnailGrid = ({ planches }: Props) => {
  const small = useMediaQuery("(min-width:600px)");
  const large = useMediaQuery("(min-width:1550px)");

  const plancheCategories = planches
    .map((planche) => planche.categories)
    .flat()
    .filter(distinct);

  const plancheByCategory = (category: string) => {
    return planches.filter((planche) => planche.categories.includes(category));
  };

  const puralizedCategoryDictionary : Record<string, string> = {
    "Planche anatomique": "Planches anatomiques",
    "Planche de caractères": "Planches de caractères",
    "Autre": "Autres"
  };

  return (
    <div className="overflow-y-auto">
      {plancheCategories.map((category : string) => {
        const pluralizedCategory = puralizedCategoryDictionary[category];
        return (
          <div key={pluralizedCategory} className="text-center my-8">
            <h2 className="text-2xl font-bold	">{pluralizedCategory}</h2>
            <div className={`flex flex-wrap gap-4 justify-center mt-4 mb-12 `}>
              {plancheByCategory(category).map((planche) =>
                PlancheThumbnail(planche.image, planche.label, planche.title)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlancheThumbnailGrid;
