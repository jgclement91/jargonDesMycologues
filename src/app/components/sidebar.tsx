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
import Tooltip from "@igloo-ui/tooltip";

import Drawer from "react-modern-drawer";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Input from "@igloo-ui/input";
import { useMediaQuery } from "usehooks-ts";

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
    }
    else if (selectedTerm) {
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
    }
    else {
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
    <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
      <Logo />
      {!path.endsWith("/planche") && (
        <div
          className="h-12 pt-2 flex gap-2 self-center cursor-pointer place-content-center"
          onClick={goToPlanche}
        >
          <div className="place-content-center">
          <Image
            src={Planche}
            alt="Planches"
            width={36}
            height={36}
            className="cursor-pointer"
            onClick={goToPlanche}
          />
          </div>
          <a className="text-md font-bold h-full place-content-center">Accès aux planches</a>
        </div>
      )}
      <Input
        className="h-auto w-56"
        ref={filterRef}
        type="text"
        placeholder="Filtrer"
        prefixIcon={
          <Image
            src="/search-svgrepo-com.svg"
            width={24}
            height={24}
            alt="Filtrer"
          />
        }
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
        <div className="flex flex-1 items-center overflow-y-auto">
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
          <Tooltip content={"Filtrer"}>
            <Image
              src="/search-svgrepo-com.svg"
              width={36}
              height={36}
              alt="Filtrer"
              className="pt-2.5 cursor-pointer"
              onClick={() => filterRef.current?.focus()}
            />
          </Tooltip>
        </div>
        <div className="flex w-full text-center justify-center">
          <Tooltip content={"Glossaire"}>
            <div className="pt-2.5 cursor-pointer font-bold">A-Z</div>
          </Tooltip>
        </div>
        {!path.endsWith("/planche") && (
          <div className="flex w-full justify-center">
            <Tooltip content={"Accès aux planches"}>
              <Image
                src={Planche}
                alt="Planches"
                width={36}
                height={36}
                className="pt-2.5 cursor-pointer"
                onClick={goToPlanche}
              />
            </Tooltip>
          </div>
        )}
        <Drawer
          className="flex flex-col"
          open={isOpen}
          onClose={toggleDrawer}
          direction="left"
          overlayOpacity={0}
          style={{ width: "225px" }}
        >
          {sidebar}
        </Drawer>
      </div>
    );
  }

  return <div className="flex flex-col">{sidebar}</div>;
};

export default Sidebar;
