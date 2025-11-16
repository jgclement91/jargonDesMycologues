'use client';

import { useMediaQuery } from "usehooks-ts";

const Footer = () => {
  const mobile = useMediaQuery("(max-width:640px)");

  return (
    <footer className={`bg-slate-800 text-slate-300 text-xs text-center py-4 ${mobile ? "pb-16" : ""}`}>
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <p className="mb-1">Glossaire illustré par <span className="whitespace-nowrap">Jean Després</span></p>
        <p>Collaboration : <span className="whitespace-nowrap">P. Dauzet</span>, <span className="whitespace-nowrap">M. Ledecq</span>, <span className="whitespace-nowrap">C. Marchand</span> et <span className="whitespace-nowrap">J. Clément</span></p>
      </div>
    </footer>
  );
};

export default Footer;
