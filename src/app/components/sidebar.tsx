import TermList from "../terms/term-list";
import Logo from "./logo";

import "./sidebar.css";

const Sidebar = () => {
    return (
        <div className="flex flex-col w-200">
            <Logo />
            <div className="flex flex-none pl-3 h-12 bg-black text-white items-center">
                <p>Préambule</p>
            </div>
            <div className="flex flex-none pl-3 h-12 bg-green-600 text-white items-center">
                <p>A</p>
            </div>
            <div className="flex flex-1 items-center overflow-y-auto term-list">
                <TermList letter="A" />
            </div>
        </div>
    );
};

export default Sidebar;