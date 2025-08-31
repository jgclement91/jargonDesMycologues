"use client";

import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { SizeOption, sizeOptions } from "./sizeOptions";

type Props = {
    onSizeChange: (newSizeKey: string) => void;
};

const ThumbnailSizeSelector = ({ onSizeChange }: Props) => {
    const isMobile = useMediaQuery('(max-width: 640px)');
    // On mobile, limit to 'large' as the largest option
    const filteredSizeOptions = isMobile
        ? sizeOptions.filter((opt: SizeOption) => opt.key !== 'xlarge')
        : sizeOptions;

    const [sizeIdx, setSizeIdx] = useState(0);
    const minIdx = 0;
    const maxIdx = filteredSizeOptions.length - 1;
    const size = filteredSizeOptions[sizeIdx];

    const handleDecreaseSize = () => {
        const newSize = Math.max(sizeIdx - 1, minIdx);
        setSizeIdx(newSize);
        onSizeChange(filteredSizeOptions[newSize].key);
    };

    const handleIncreaseSize = () => {
        const newSize = Math.min(sizeIdx + 1, maxIdx);
        setSizeIdx(newSize);
        onSizeChange(filteredSizeOptions[newSize].key);
    };

    return (
        <div className="bg-white/80 shadow-md rounded-xl flex flex-col py-3 items-center gap-4 border border-gray-200">
            <label htmlFor="thumb-size" className="font-semibold text-gray-700 text-center items-center">Taille des vignettes</label>
            <div className="flex items-center px-6">
                <button
                    className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={handleDecreaseSize}
                    disabled={sizeIdx === minIdx}
                    aria-label="Diminuer la taille des vignettes"
                >
                    –
                </button>
                <span className="min-w-[100px] px-2 text-center text-base font-medium text-gray-800 select-none">
                    {size?.label}
                </span>
                <button
                    className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={handleIncreaseSize}
                    disabled={sizeIdx === maxIdx}
                    aria-label="Augmenter la taille des vignettes"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default ThumbnailSizeSelector;