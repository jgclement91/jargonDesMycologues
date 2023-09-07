"use client";
import { ChangeEvent, useEffect, useState } from "react";

import TermList from "../terms/term-list";
import LetterList from "../letters/letter-list";
import Logo from "./logo";

import { usePathname, useRouter } from "next/navigation";
import Input from '@igloo-ui/input';

import LetterSelect from "../letters/letter-select";

import "./sidebar.css";

type Props = {
  terms: string[];
};

const Sidebar = ({ terms }: Props) => {
  const router = useRouter();
  const path = decodeURIComponent(usePathname());
  const pathSegments = path.split("/");

  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [filteredTerms, setFilteredTerms] = useState([""]);
  const [showLetters, setShowLetters] = useState(false);
  const [termFilter, setTermFilter] = useState("");

  const localeIncludes = (string: string, searchString:string) => {
    const stringLength = string.length;
    const searchStringLength = searchString.length;
    const lengthDiff = stringLength - searchStringLength;

    for (let i = 0; i <= lengthDiff; i++) {
        if (string.substring(i, i + searchStringLength).localeCompare(searchString, 'fr', { sensitivity: 'base' }) === 0) {
            return true;
        }
    }

    return false;
};

  useEffect(() => {
    if (termFilter){
      return;
    }

    if (pathSegments.length > 2) {
      const termFromRoute = pathSegments[2];

      if (!termFromRoute) {
        return;
      }

      setSelectedTerm(termFromRoute);

      if (termFromRoute[0] === "É") {
        setSelectedLetter("E");
      } else {
        setSelectedLetter(termFromRoute[0]);
      }

      setFilteredTerms(
        terms.filter(
          (t) =>
            t.startsWith(termFromRoute[0]) ||
            t.startsWith(`-${termFromRoute[0]}`)
        )
      );
    }
  }, []);

  useEffect(() => {

    if (termFilter) {
      setSelectedLetter("");
      setShowLetters(false);
        var termsContainingFilter = terms
        .filter(t => localeIncludes(t, termFilter));

        const termsStartingWithFilter = termsContainingFilter.filter(
          t => t
          .substring(0, termFilter.length)
          .localeCompare(termFilter, 'fr', { sensitivity: 'base' }) === 0
          );

        setFilteredTerms([...termsStartingWithFilter, ...termsContainingFilter.filter(t => !termsStartingWithFilter.includes(t))]);

    }
    else if (selectedLetter){
      setFilteredTerms(
        terms.filter(
          (t) =>
          t[0].localeCompare(selectedLetter, 'fr', { sensitivity: 'base' }) === 0 ||
          t.substring(0, 2).localeCompare(`-${selectedLetter}`, 'fr', { sensitivity: 'base' }) === 0
        )
      );
    }
    else {
      setShowLetters(true);
    }

  }, [selectedLetter, termFilter]);

  const displayLetters = () => {
    setSelectedLetter("");
    setShowLetters(true);
  };

  const handleOnTermSelect = (term: string) => {

    let selectedTerm = term;
    if (term.startsWith("-") || term.endsWith("-")) {
      selectedTerm = selectedTerm.replace("-", "");
    }

    if (!termFilter){
      setSelectedLetter(selectedTerm[0]);
    }
    setSelectedTerm(term);
    router.push(`/glossaire/${selectedTerm}`);
  };

  const handleOnLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    setFilteredTerms(
      terms.filter((t) => t.startsWith(letter) || t.startsWith(`-${letter}`))
    );
    setShowLetters(false);
  };

  return (
    <div className="flex flex-col">
      <Logo />
      <div className="flex flex-none pl-3 h-12 bg-black text-white items-center">
        <p>Préambule</p>
      </div>
      <LetterSelect selectedLetter={selectedLetter} onChange={displayLetters} />
      <Input className="h-auto w-56" type="text" placeholder="Filtrer" onChange={(e: ChangeEvent<HTMLInputElement>) => setTermFilter(e.target.value)}/>
      {showLetters ? (
        <div className="flex flex-1 items-center overflow-y-auto term-list">
          <LetterList onLetterSelect={handleOnLetterSelect} />
        </div>
      ) : (
        <div className="flex flex-1 items-center overflow-y-auto term-list">
          <TermList
            terms={filteredTerms}
            selectedTerm={selectedTerm}
            onTermSelect={handleOnTermSelect}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;