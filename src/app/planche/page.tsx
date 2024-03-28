import Footer from "../components/footer";
import Header from "../components/header";
import {
  getAllPlanches,
} from "@/app/clients/sanityClient";
import PlancheThumbnailGrid from "./plancheThumbnailGrid";
import { Metadata  } from 'next'

export async function generateMetadata(): Promise<Metadata> {

  return {
    title: `Planches - Jargon des mycologues`,
  }
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
