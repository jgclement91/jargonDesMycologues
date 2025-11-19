"use client";

import { useRef } from "react";
import { useTimeout } from "usehooks-ts";

type Props = {
  term: string;
  selected: boolean;
  onTermSelect: () => void;
  scrollToTerm: boolean;
  isFirstTerm: boolean;
  searchQuery?: string;
};

const TermListItem = ({
  term,
  selected,
  onTermSelect,
  scrollToTerm,
  isFirstTerm,
  searchQuery,
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

  const highlightText = (text: string, query?: string) => {
    if (!query) return text;

    const removeDiacritics = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normText = removeDiacritics(text);
    const normQuery = removeDiacritics(query);
    const index = normText.toLowerCase().indexOf(normQuery.toLowerCase());

    if (index === -1) return text;

    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);

    return (
      <>
        {before}
        <strong className="font-bold">{match}</strong>
        {after}
      </>
    );
  };

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      onClick={handleOnClick}
      aria-current={selected ? "true" : undefined}
    >
      {highlightText(term, searchQuery)}
    </button>
  );
};

export default TermListItem;
