"use client";
import { ChangeEvent, useEffect, useState } from "react";

import TermList from "../terms/term-list";
import LetterList from "../letters/letter-list";
import Logo from "./logo";

import { usePathname, useRouter } from "next/navigation";
import Input from "@igloo-ui/input";
import Search from '@igloo-ui/icons/dist/Search';

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
  const [showLetters, setShowLetters] = useState(true);
  const [showLetterSelect, setShowLetterSelect] = useState(true);
  const [termFilter, setTermFilter] = useState("");

  const localeIncludes = (string: string, searchString: string) => {
    const stringLength = string.length;
    const searchStringLength = searchString.length;
    const lengthDiff = stringLength - searchStringLength;

    for (let i = 0; i <= lengthDiff; i++) {
      if (
        string
          .substring(i, i + searchStringLength)
          .localeCompare(searchString, "fr", { sensitivity: "base" }) === 0
      ) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    if (termFilter || selectedLetter) {
      return;
    }

    if (pathSegments.length > 2) {
      const termFromRoute = pathSegments[2];

      if (!termFromRoute) {
        setShowLetters(true);
        return;
      }

      setSelectedTerm(termFromRoute);
      setSelectedLetter(termFromRoute[0]);
      setFilteredTerms(
        terms.filter(
          (t) =>
            t.startsWith(termFromRoute[0]) ||
            t.startsWith(`-${termFromRoute[0]}`)
        )
      );
    }
  }, [path, termFilter]);

  useEffect(() => {
    if (termFilter) {
      setSelectedLetter("");
      setShowLetterSelect(true);
      setShowLetters(false);
      var termsContainingFilter = terms.filter((t) =>
        localeIncludes(t, termFilter)
      );

      const termsStartingWithFilter = termsContainingFilter.filter(
        (t) =>
          t
            .substring(0, termFilter.length)
            .localeCompare(termFilter, "fr", { sensitivity: "base" }) === 0
      );

      setFilteredTerms([
        ...termsStartingWithFilter,
        ...termsContainingFilter.filter(
          (t) => !termsStartingWithFilter.includes(t)
        ),
      ]);
    }
  }, [termFilter]);

  useEffect(() => {
    if (termFilter){
      return;
    }

    if (selectedLetter) {
      setFilteredTerms(
        terms.filter(
          (t) =>
            t[0].localeCompare(selectedLetter, "fr", {
              sensitivity: "base",
            }) === 0 ||
            t.substring(0, 2).localeCompare(`-${selectedLetter}`, "fr", {
              sensitivity: "base",
            }) === 0
        )
      );
    } else {
      setFilteredTerms([]);
    }
  }, [termFilter, selectedLetter]);

  const displayLetters = () => {
    setSelectedLetter("");
    setShowLetters(true);
    setShowLetterSelect(false);
    setTermFilter("");
  };

  const handleOnTermSelect = (term: string) => {
    let selectedTerm = term;
    if (term.startsWith("-") || term.endsWith("-")) {
      selectedTerm = selectedTerm.replace("-", "");
    }

    if (!termFilter) {
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
    setShowLetterSelect(true);
  };

  return (
    <div className="flex flex-col">
      <Logo />
      <Input
        className="h-auto w-56"
        type="text"
        placeholder="Filtrer"
        prefixIcon={<Search size="medium" />}
        value={termFilter}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setTermFilter(e.target.value)
        }
      />
      <LetterSelect hideButton={!showLetterSelect} onChange={displayLetters} />
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
            scrollToTerm={!termFilter}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
