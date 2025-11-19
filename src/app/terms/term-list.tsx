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
  searchQuery?: string;
};

function distinct(value: string, index: number, array: Array<string>) {
  return array.indexOf(value) === index;
}

const TermList = ({ terms, selectedTerm, onTermSelect, scrollToTerm, searchQuery }: Props) => {
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
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
};

export default TermList;
