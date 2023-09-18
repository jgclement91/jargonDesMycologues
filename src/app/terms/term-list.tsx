'use client';

import TermListItem from "./term-list-item";
import "./term-list.css";

type Props = {
  terms: string[];
  selectedTerm?: string;
  onTermSelect: (term: string) => void;
  scrollToTerm: boolean;
};

const TermList = ({ terms, selectedTerm, onTermSelect, scrollToTerm }: Props) => {

  return (
    <div className="h-full w-52">
      <div className="divide-y divide-gray-400">
        {terms.map((term, index) => (
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
