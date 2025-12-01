"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { getAllCategories } from "../constants/categories";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CategoryLegendModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  const categories = getAllCategories();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">
            Légende des symboles contextuels
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <p className="text-slate-600 mb-6">
            Chaque terme du glossaire peut être accompagné d&apos;un ou
            plusieurs symboles indiquant son contexte d&apos;utilisation en
            mycologie.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div
                key={category.text}
                className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg hover:border-emerald-500 transition-colors"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={category.icon}
                    alt={category.text}
                    width={category.dimensions.width}
                    height={category.dimensions.height}
                    className="min-w-[55px]"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    {category.text}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-slate-200">
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryLegendModal;
