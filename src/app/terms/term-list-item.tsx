"use client";

import { useRef } from "react";
import { useTimeout } from "usehooks-ts";

type Props = {
  term: string;
  selected: boolean;
  onTermSelect: () => void;
  scrollToTerm: boolean;
  isFirstTerm: boolean;
};

const TermListItem = ({
  term,
  selected,
  onTermSelect,
  scrollToTerm,
  isFirstTerm,
}: Props) => {
  const classes = `w-full text-left flex items-center px-3 py-2 min-h-[44px] whitespace-pre-line border-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm transition-colors
    ${selected
      ? "bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100"
      : "hover:bg-slate-50 cursor-pointer"}`;

  const ref = useRef<HTMLButtonElement | null>(null);

  useTimeout(() => {
    if ((scrollToTerm && selected) || isFirstTerm) {
      ref.current?.scrollIntoView({ behavior: isFirstTerm ? "auto" : "smooth" });
    }
  }, 50);

  const handleOnClick = () => {
    onTermSelect();
  };

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      onClick={handleOnClick}
      aria-current={selected ? "true" : undefined}
    >
      {term}
    </button>
  );
};

export default TermListItem;
