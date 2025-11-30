"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CategoryLegendModal from "./category-legend-modal";

const CategoryLegendButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        className="border-emerald-600 mt-4 text-emerald-700 hover:bg-emerald-50 w-full text-sm leading-snug h-auto py-3 whitespace-normal"
        onClick={() => setIsModalOpen(true)}
      >
        Consulter la légende des symboles
      </Button>

      <CategoryLegendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CategoryLegendButton;
