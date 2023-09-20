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
  isFirstTerm
}: Props) => {
  var classes = `h-full flex items-center pl-6 py-3 whitespace-pre-line no-underline select-none ${
    selected
      ? "hover:bg-green-200 selected-term"
      : "hover:bg-slate-100 cursor-pointer"
  }`;

  const ref = useRef<null | HTMLAnchorElement>(null);

  useTimeout(() => {
    if ((scrollToTerm && selected) || isFirstTerm) {
      ref.current?.scrollIntoView({ behavior: isFirstTerm ? "auto" : "smooth" });
    }
  }, 50);

  const handleOnClick = () => {
    onTermSelect();
  };

  return (
    <a ref={ref} className={classes} key={term} onClick={() => handleOnClick()}>
      {term}
    </a>
  );
};

export default TermListItem;
