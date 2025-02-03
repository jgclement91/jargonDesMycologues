import Footer from "../components/footer";
import Header from "../components/header";
import { getAllPlanches, getImageUrl } from "@/app/clients/sanityClient";
import PlancheThumbnailGrid from "./plancheThumbnailGrid";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Planches - Jargon des mycologues`,
    description: `Découvrez les planches du jargon des mycologues.`,
    alternates: {
      canonical: `https://www.jargon-des-mycologues.org/planche`,
    },
    openGraph: {
      title: `Planches - Jargon des mycologues`,
      url: `https://www.jargon-des-mycologues.org/planche`,
      images: [
        {
          url: "https://cdn.sanity.io/images/pe3dn4r6/production/5de6bfbb8e0effd3d3e2a53d8f0f010f3b5c3d9c-1920x1080.jpg",
          width: 1920,
          height: 1080,
          alt: "Planche des Amanites",
        },
        {
          url: "https://cdn.sanity.io/images/pe3dn4r6/production/d1ac5708999056aeaf9f7e8e7f7405d15aaae618-1920x1080.jpg",
          width: 1920,
          height: 1080,
          alt: "Planche des Bolets",
        },
        {
          url: "https://cdn.sanity.io/images/pe3dn4r6/production/c1ab1e5fa8335669a80d6861ed01e39eb244d022-1920x1080.jpg",
          width: 1920,
          height: 1080,
          alt: "Planche des Pleurotes",
        },
      ],
    },
  };
}

const PlancheList = async () => {
  const planches = await getAllPlanches(400);

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <Header />
      <PlancheThumbnailGrid planches={planches} />
      <Footer />
    </div>
  );
};

export default PlancheList;
