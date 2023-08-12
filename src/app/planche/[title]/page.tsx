import {
  getAllPlanches,
  fetchPlanche,
  getImageUrl,
} from "@/app/clients/sanityClient";

import Image from "next/image";

type Props = {
  params: {
    title: string;
  };
};

export async function generateStaticParams() {
  return await getAllPlanches();
}

const Page = async ({ params }: Props) => {
  const data = await fetchPlanche(decodeURIComponent(params.title));
  const imageRef = data.image.asset._ref;
  const imageDimensions = imageRef.substr(imageRef.length-13, 9).split("x");
  const imageWidth = imageDimensions[0];
  const imageHeight = imageDimensions[1];
  const imageUrl = data.image && getImageUrl(data.image, imageWidth);

  return (
    <div className="app">
      <Image alt="Schema" src={imageUrl} width={imageWidth} height={imageHeight} />
    </div>
  );
};

export default Page;
