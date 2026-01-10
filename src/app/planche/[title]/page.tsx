import {
  getAllPlancheTitles,
  fetchPlanche,
  getImageUrl,
} from "@/app/clients/sanityClient";
import { Metadata } from "next";

import Image from "next/image";

import "./page.css";

type Props = {
  params: Promise<{
    title: string;
  }>;
};

export async function generateStaticParams() {
  return await getAllPlancheTitles();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title: titleSlug } = await params;
  const data = await fetchPlanche(decodeURIComponent(titleSlug));
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
      canonical: `https://www.jargon-des-mycologues.org/planche/${titleSlug}`,
    },
    openGraph: {
      title: title,
      url: `https://www.jargon-des-mycologues.org/planche/${titleSlug}`,
      images: {
        url: imageUrl,
        width: imageWidth,
        height: imageHeight,
        alt: title,
      },
      type: "article"
    },
    robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
  };
}

const Page = async ({ params }: Props) => {
  const { title: titleSlug } = await params;
  const data = await fetchPlanche(decodeURIComponent(titleSlug));
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
    <div className="h-full overflow-y-auto">
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
