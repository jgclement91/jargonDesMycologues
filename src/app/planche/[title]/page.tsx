import {
  getAllPlanches,
  fetchPlanche,
  getImageUrl,
} from "@/app/clients/sanityClient";
import { Metadata  } from 'next'

import Image from "next/image";

import "./page.css";

type Props = {
  params: {
    title: string;
  };
};

export async function generateStaticParams() {
  return await getAllPlanches();
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  return {
    title: `Planche de ${params.title} - Jargon des mycologues`,
  }
}

const Page = async ({ params }: Props) => {
  const data = await fetchPlanche(decodeURIComponent(params.title));
  const imageRef = data.image.asset._ref;
  const imageDimensions = imageRef.split("-")[2].split("x");
  const imageWidth = imageDimensions[0];
  const imageHeight = imageDimensions[1];
  const imageUrl = data.image && getImageUrl(data.image, imageWidth);

  return (
      <div className="w-auto h-auto">
        <Image
          alt={params.title}
          src={imageUrl}
          width={imageWidth}
          height={imageHeight}
        />
      </div>
  );
};

export default Page;
