"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

import "./header.css"

const Header = () => {
  const router = useRouter();
  const path = usePathname();
  const pathSegments = path.split("/");
  const displayHome = pathSegments.length > 1 && pathSegments[1].length > 0;

  const goToHome = () => {
    router.push("/");
  };

  return (
    <header className="py-4 landscape:py-2 border-b border-[#004000]" style={{ backgroundColor: "#006000" }}>
      <div className="container px-4 md:px-6 landscape:px-3 mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl landscape:text-xl font-serif italic text-amber-100 text-center flex-grow title">
            Le jargon des mycologues
          </h1>
          {displayHome && (
            <Button
              variant="ghost"
              size="icon"
              className="text-amber-100 hover:text-white hover:bg-[#004000] shrink-0 landscape:h-8 landscape:w-8"
              onClick={goToHome}
              aria-label="Aller à l'accueil"
            >
              <Home className="h-6 w-6 landscape:h-4 landscape:w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
