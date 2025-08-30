"use client";
import { useState, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import Header from "../components/header";
import Footer from "../components/footer";
import PlancheThumbnailGrid from "./plancheThumbnailGrid";

type SizeOption = { key: string; label: string; width: number; height: number };

type PlancheListClientProps = {
  planches: any[];
  sizeOptions: SizeOption[];
};

export default function PlancheListClient({ planches, sizeOptions }: PlancheListClientProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  // On mobile, limit to 'large' as the largest option
  const filteredSizeOptions = isMobile
    ? sizeOptions.filter((opt: SizeOption) => opt.key !== 'xlarge')
    : sizeOptions;
  const [sizeIdx, setSizeIdx] = useState(0);
  const minIdx = 0;
  const maxIdx = filteredSizeOptions.length - 1;
  const size = filteredSizeOptions[sizeIdx];

  // If switching from desktop to mobile and current sizeIdx is out of bounds, clamp it
  useEffect(() => {
    if (sizeIdx > maxIdx) {
      setSizeIdx(maxIdx);
    }
  }, [maxIdx, sizeIdx]);

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <Header />
      {/* Centered and styled size selector below the main title */}
      <div className="w-full flex flex-col items-center mt-6 mb-2">
        <div className="bg-white/80 shadow-md rounded-xl px-6 py-3 flex items-center gap-4 border border-gray-200">
          <label htmlFor="thumb-size" className="font-semibold text-gray-700 mr-2">Taille</label>
          <button
            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setSizeIdx((i) => Math.max(i - 1, minIdx))}
            disabled={sizeIdx === minIdx}
            aria-label="Diminuer la taille des vignettes"
          >
            –
          </button>
          <span className="min-w-[90px] text-center text-base font-medium text-gray-800 select-none">
            {size?.label}
          </span>
          <button
            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setSizeIdx((i) => Math.min(i + 1, maxIdx))}
            disabled={sizeIdx === maxIdx}
            aria-label="Augmenter la taille des vignettes"
          >
            +
          </button>
        </div>
      </div>
      <PlancheThumbnailGrid planches={planches} thumbSize={size} />
      <Footer />
    </div>
  );
}
