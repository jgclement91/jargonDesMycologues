'use client';

import { useMediaQuery } from "usehooks-ts";

const Footer = () => {
  const mobile = useMediaQuery("(max-width:640px)");

  return (
    <div className={`bg-black text-white text-xs text-center pt-1 ${mobile ? "pb-12" : "pb-1"}`}>
      <p>Glossaire illustré par Jean Després</p>
      <p>Collaboration : P. Dauzet, M. Ledecq, C. Marchand et J. Clément</p>
    </div>
  );
};

export default Footer;
