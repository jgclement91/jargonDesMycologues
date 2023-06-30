'use client';

import TermListItem from "./term-list-item";
import "./term-list.css";

type Props = {
  terms: string[];
  selectedTerm?: string;
  onTermSelect: (term: string) => void;
};

const TermList = ({ terms, selectedTerm, onTermSelect }: Props) => {
  return (
    <div className="h-full w-52">
      <div className="divide-y divide-gray-400">
        {terms.map((term) => (
          <TermListItem
            key={term}
            term={term}
            selected={term === selectedTerm}
            onTermSelect={() => onTermSelect(term)}
          />
        ))}
      </div>
    </div>
  );
};

export default TermList;
