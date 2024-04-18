'use client';

import { useMediaQuery } from "usehooks-ts";

const Footer = () => {
  const mobile = useMediaQuery("(max-width:640px)");

  return (
    <div className={`bg-black text-white text-xs text-center pt-1 ${mobile ? "pb-14" : "pb-1"}`}>
      <p>Glossaire illustré par <span className="whitespace-nowrap">Jean Després</span></p>
      <p>Collaboration : <span className="whitespace-nowrap">P. Dauzet</span>, <span className="whitespace-nowrap">M. Ledecq</span>, <span className="whitespace-nowrap">C. Marchand</span> et <span className="whitespace-nowrap">J. Clément</span></p>
    </div>
  );
};

export default Footer;
