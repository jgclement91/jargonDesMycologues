"use client";

import { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";
import LandscapeContainer from "./landscape-container";

type Props = {
  children: ReactNode;
};

const GlossaireWrapper = ({ children }: Props) => {
  return (
    <div className="flex flex-grow">
      <div className="flex flex-grow flex-col">
        <LandscapeContainer
          header={<Header />}
          footer={<Footer />}
        >
          {children}
        </LandscapeContainer>
      </div>
    </div>
  );
};

export default GlossaireWrapper;
