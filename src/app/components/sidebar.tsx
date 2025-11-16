"use client";
import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useState,
  useRef,
} from "react";

import TermList from "../terms/term-list";
import LetterList from "../letters/letter-list";
import Logo from "./logo";
import Drawer from "react-modern-drawer";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import LetterSelect from "../letters/letter-select";
import Planche from "../images/sidebar/planche.png";

import "react-modern-drawer/dist/index.css";
import "./sidebar.css";

type Props = {
  terms: string[];
};

const Sidebar = ({ terms }: Props) => {
  const router = useRouter();
  const path = decodeURIComponent(usePathname());
  const pathSegments = path.split("/");

  const mobile = useMediaQuery("(max-width:640px)");

  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [filteredTerms, setFilteredTerms] = useState([""]);
  const [showLetters, setShowLetters] = useState(true);
  const [showLetterSelect, setShowLetterSelect] = useState(false);
  const [termFilter, setTermFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLInputElement>(null);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };


  const collator = new Intl.Collator("fr", { sensitivity: "base" });
  const includesInsensitive = (haystack: string, needle: string) => {
    if (!needle) {
      return true;
    }
    const removeDiacritics = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normHaystack = removeDiacritics(haystack);
    const normNeedle = removeDiacritics(needle);
    return normHaystack.toLowerCase().includes(normNeedle.toLowerCase());
  };


  // Debounce filter input
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (termFilter) {
      setSelectedLetter("");
      setShowLetterSelect(true);
      setShowLetters(false);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        const termsContainingFilter = terms.filter((t) => includesInsensitive(t, termFilter));
        const termsStartingWithFilter = termsContainingFilter.filter((t) =>
          collator.compare(t.substring(0, termFilter.length), termFilter) === 0
        );
        setFilteredTerms([
          ...termsStartingWithFilter,
          ...termsContainingFilter.filter((t) => !termsStartingWithFilter.includes(t)),
        ]);
      }, 200);

      return () => {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
      };
    }
  }, [termFilter, terms]);

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

      setShowLetters(false);
      setShowLetterSelect(true);
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

  // (Debounced filter logic moved above)

  useEffect(() => {
    if (termFilter) {
      return;
    }

    if (selectedLetter?.length > 0) { //or selectedTerm -> Use term's first letter.
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
    } else if (selectedTerm) {
      const letter = selectedTerm[0];
      setFilteredTerms(
        terms.filter(
          (t) =>
            t[0].localeCompare(letter, "fr", {
              sensitivity: "base",
            }) === 0 ||
            t.substring(0, 2).localeCompare(`-${letter}`, "fr", {
              sensitivity: "base",
            }) === 0
        )
      );
    } else {
      setFilteredTerms([]);
      displayLetters();
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
    setIsOpen(false);
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

  const goToPlanche = (e: SyntheticEvent) => {
    router.push(`/planche`);
    e.stopPropagation();
  };

  if (path.startsWith("/planche/")) {
    return <></>;
  }

  const sidebar = (
    <div className="flex flex-col p-4 flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <Logo />
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          ref={filterRef}
          type="search"
          placeholder="Rechercher..."
          className="w-full pl-10"
          value={termFilter}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTermFilter(e.target.value)
          }
        />
      </div>
      {!path.endsWith("/planche") && (
        <Button
          variant="link"
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium text-sm mb-3 px-0 justify-start"
          onClick={goToPlanche}
        >
          <BookOpen className="h-4 w-4" />
          Accès aux planches
        </Button>
      )}
      <LetterSelect hideButton={!showLetterSelect} onChange={displayLetters} />
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden flex-1 min-h-0">
        <div className="bg-[#006000] text-white px-3 py-2 text-center font-medium">
          A → Z
        </div>
        <div className="overflow-y-auto flex-1">
          {showLetters ? (
            <LetterList onLetterSelect={handleOnLetterSelect} />
          ) : (
            <TermList
              terms={filteredTerms}
              selectedTerm={selectedTerm}
              onTermSelect={handleOnTermSelect}
              scrollToTerm={!termFilter}
            />
          )}
        </div>
      </div>
    </div>
  );

  if (mobile) {
    return (
      <div
        className="flex flex-col gap-4 w-16 min-w-16 items-center divide-y-2 > * + * divide-gray-300"
        style={{ minWidth: "48px" }}
        onClick={toggleDrawer}
      >
        <Image
          src="/small-logo-cmm.png"
          alt="Logo Cercle des mycologues de Montréal"
          width={36}
          height={36}
          className="pt-2.5 cursor-pointer"
        />
        <div className="flex w-full justify-center">
          <Search
            className="pt-2.5 cursor-pointer h-9 w-9 text-slate-600"
            onClick={() => filterRef.current?.focus()}
          />
        </div>
        <div className="flex w-full text-center justify-center">
          <div className="pt-2.5 cursor-pointer font-bold">A-Z</div>
        </div>
        {!path.endsWith("/planche") && (
          <div className="flex w-full justify-center">
            <BookOpen
              className="pt-2.5 cursor-pointer h-9 w-9 text-slate-600"
              onClick={goToPlanche}
            />
          </div>
        )}
        <Drawer
          className="flex flex-col"
          open={isOpen}
          onClose={toggleDrawer}
          direction="left"
          overlayOpacity={0.3}
          style={{ width: "280px" }}
        >
          {sidebar}
        </Drawer>
      </div>
    );
  }

  return <div className="flex flex-col w-64 shrink-0 border-r">{sidebar}</div>;
};

export default Sidebar;
