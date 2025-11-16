"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import PortableTextComponent from "@/app/components/portableTextComponent";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description?: any;
};

const ImageModal = ({ isOpen, onClose, imageSrc, imageAlt, title, description }: Props) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 p-4 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10 transition-colors"
          aria-label="Fermer"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center justify-center p-4 overflow-auto">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={800}
            height={600}
            className="max-h-[80vh] w-auto object-contain"
          />
        </div>

        <div className="p-4 bg-slate-50 border-t">
          <h3 className="text-lg font-medium text-slate-800 text-center">
            {title}
          </h3>
          {description && (
            <div className="mt-2 text-sm text-slate-600 text-center">
              <PortableTextComponent value={description} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
