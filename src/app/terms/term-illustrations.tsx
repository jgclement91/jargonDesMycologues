"use client";

import { useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import PortableTextComponent from "../components/portableTextComponent";
import ImageModal from "@/components/ui/image-modal";

type Props = {
  exampleImageUrl: any;
  exampleImageUrlFull: any;
  exampleDescription: any;
  schemaImageUrl: any;
  schemaImageUrlFull: any;
};

const TermIllustrations = ({
  exampleImageUrl,
  exampleImageUrlFull,
  exampleDescription,
  schemaImageUrl,
  schemaImageUrlFull,
}: Props) => {
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt: string;
    title: string;
    description?: any;
  } | null>(null);

  const isLandscape = useMediaQuery("(orientation: landscape)");

  const openModal = (
    src: string,
    alt: string,
    title: string,
    description?: any
  ) => {
    if (isLandscape) {
      return;
    }
    
    setModalImage({ src, alt, title, description });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  if (!schemaImageUrl && !exampleImageUrl) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {schemaImageUrl && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-2 border-b border-slate-100">
              <h3 className="text-lg font-medium text-slate-800">Schéma</h3>
            </div>
            <div className="p-1 flex justify-center">
              <div
                className={`h-[300px] w-[250px] relative transition-opacity ${
                  isLandscape ? "" : "cursor-pointer hover:opacity-90"
                }`}
                onClick={() =>
                  openModal(schemaImageUrlFull, "Schéma", "Schéma")
                }
              >
                <Image
                  src={schemaImageUrl}
                  alt="Schéma"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {exampleImageUrl && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-2 border-b border-slate-100">
              <h3 className="text-lg font-medium text-slate-800">Exemple</h3>
            </div>
            <div className="p-1 flex justify-center">
              <div
                className={`h-[300px] w-[250px] relative transition-opacity ${
                  isLandscape ? "" : "cursor-pointer hover:opacity-90"
                }`}
                onClick={() =>
                  openModal(
                    exampleImageUrlFull,
                    "Exemple",
                    "Exemple",
                    exampleDescription
                  )
                }
              >
                <Image
                  src={exampleImageUrl}
                  alt="Exemple"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            {exampleDescription && (
              <div className="px-2 py-1 bg-slate-50 text-xs text-slate-600 text-center">
                <PortableTextComponent value={exampleDescription} />
              </div>
            )}
          </div>
        )}
      </div>

      {modalImage && (
        <ImageModal
          isOpen={!!modalImage}
          onClose={closeModal}
          imageSrc={modalImage.src}
          imageAlt={modalImage.alt}
          title={modalImage.title}
          description={modalImage.description}
        />
      )}
    </>
  );
};

export default TermIllustrations;
