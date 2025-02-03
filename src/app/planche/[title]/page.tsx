import {
  getAllPlancheTitles,
  fetchPlanche,
  getImageUrl,
} from "@/app/clients/sanityClient";
import { Metadata } from "next";

import Image from "next/image";

import "./page.css";

type Props = {
  params: {
    title: string;
  };
};

export async function generateStaticParams() {
  return await getAllPlancheTitles();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchPlanche(decodeURIComponent(params.title));
  const imageRef = data.image.asset._ref;
  const imageDimensions = imageRef.split("-")[2].split("x");
  const imageWidth = imageDimensions[0];
  const imageHeight = imageDimensions[1];
  const imageUrl = data.image && getImageUrl(data.image, imageWidth);

  const label = data.label;
  const title = data.categories.includes("Planche anatomique")
    ? `Planche anatomique des ${label}`
    : data.categories.includes("Planche de caractères")
    ? `Planche de caractères des ${label}`
    : label;

  return {
    title: title,
    description: title,
    alternates: {
      canonical: `https://www.jargon-des-mycologues.org/planche/${params.title}`,
    },
    openGraph: {
      title: title,
      url: `https://www.jargon-des-mycologues.org/planche/${params.title}`,
      images: {
        url: imageUrl,
        width: imageWidth,
        height: imageHeight,
        alt: title,
      },
    },
  };
}

const Page = async ({ params }: Props) => {
  const data = await fetchPlanche(decodeURIComponent(params.title));
  const imageRef = data.image.asset._ref;
  const imageDimensions = imageRef.split("-")[2].split("x");
  const imageWidth = imageDimensions[0];
  const imageHeight = imageDimensions[1];
  const imageUrl = data.image && getImageUrl(data.image, imageWidth);

  const label = data.label;
  const title = data.categories.includes("Planche anatomique")
    ? `Planche anatomique des ${label}`
    : data.categories.includes("Planche de caractères")
    ? `Planche de caractères des ${label}`
    : label;

  return (
    <div className="w-auto h-auto">
      <Image
        alt={title}
        src={imageUrl}
        width={imageWidth}
        height={imageHeight}
      />
    </div>
  );
};

export default Page;
