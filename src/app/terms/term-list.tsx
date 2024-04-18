'use client';

import { useMediaQuery } from "usehooks-ts";
import { usePathname } from "next/navigation";

import TermListItem from "./term-list-item";
import "./term-list.css";

type Props = {
  terms: string[];
  selectedTerm?: string;
  onTermSelect: (term: string) => void;
  scrollToTerm: boolean;
};

function distinct(value: string, index: number, array: Array<string>) {
  return array.indexOf(value) === index;
}

const TermList = ({ terms, selectedTerm, onTermSelect, scrollToTerm }: Props) => {
  const mobile = useMediaQuery("(max-width:640px)");
  const path = decodeURIComponent(usePathname());

  return (
    <div className={`w-52 w-full ${mobile && !path.startsWith("/planche") ? "mobile-" : ""}term-list`}>
      <div className="divide-y divide-gray-400">
        {terms.filter(distinct).map((term, index) => (
          <TermListItem
            key={term}
            term={term}
            selected={ term === selectedTerm || term === `-${selectedTerm}` || term === `${selectedTerm}-`}
            onTermSelect={() => onTermSelect(term)}
            scrollToTerm={scrollToTerm}
            isFirstTerm={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default TermList;
