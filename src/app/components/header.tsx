"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

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
    <div className="bg-green-600 flex align-middle">
      {displayHome && (
        <Image
          className="h-16 ml-2 self-center cursor-pointer"
          alt="Accueil"
          src="/home-4-svgrepo-com.svg"
          width={64}
          height={64}
          onClick={goToHome}
        />
      )}
      <div className="align-middle align-center p-8 flex-grow">
        <p className="text-white text-6xl font-semibold text-center title">
          Le jargon des mycologues
        </p>
      </div>
    </div>
  );
};

export default Header;
