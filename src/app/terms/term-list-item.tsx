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
  const classes = `w-full text-left flex items-center pl-6 py-3 whitespace-pre-line border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500
    ${selected
      ? "bg-[#e1ffe7] hover:bg-[#b4ffc3] focus:bg-[#b4ffc3]"
      : "hover:bg-slate-100 cursor-pointer"}`;

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
