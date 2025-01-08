import {
  getAllPlancheTitles,
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
  return await getAllPlancheTitles();
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const title = decodeURIComponent(params.title).replaceAll("-", " ").split(".")[0];

  return {
    title: `Planche de ${decodeURIComponent(title)}`,
  }
}

const Page = async ({ params }: Props) => {
  const title = decodeURIComponent(params.title).replaceAll("-", " ").split(".")[0];
  const data = await fetchPlanche(decodeURIComponent(params.title));
  const imageRef = data.image.asset._ref;
  const imageDimensions = imageRef.split("-")[2].split("x");
  const imageWidth = imageDimensions[0];
  const imageHeight = imageDimensions[1];
  const imageUrl = data.image && getImageUrl(data.image, imageWidth);

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
