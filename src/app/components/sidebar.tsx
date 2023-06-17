'use client'

import TermList from "../terms/term-list";
import Logo from "./logo";

import { usePathname } from 'next/navigation'

import "./sidebar.css";

type Props = {
    terms: string[];
};

const Sidebar = ({ terms }: Props) => {

    const path = decodeURIComponent(usePathname());
    const pathSegments = path.split("/");
    var selectedLetter = "A";

    if(pathSegments.length > 2) {
        const selectedTerm = pathSegments[2];
        selectedLetter = selectedTerm[0];

        if(selectedLetter == "É") {
            selectedLetter = "E";
        }
    }

    return (
        <div className="flex flex-col">
            <Logo />
            <div className="flex flex-none pl-3 h-12 bg-black text-white items-center">
                <p>Préambule</p>
            </div>
            <div className="flex flex-none pl-3 h-12 bg-green-600 text-white items-center">
                <p>{selectedLetter}</p>
            </div>
            <div className="flex flex-1 items-center overflow-y-auto term-list">
                <TermList terms={terms.filter(t => t.startsWith(selectedLetter))} />
            </div>
        </div>
    );
};

export default Sidebar;