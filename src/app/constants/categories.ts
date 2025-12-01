import { StaticImageData } from "next/image";
import ClassificationIcon from "../images/categoryIcons/Classification.gif";
import CycleDeVieIcon from "../images/categoryIcons/Cycle-de-vie.gif";
import EcologieIcon from "../images/categoryIcons/Écologie.gif";
import LangueIcon from "../images/categoryIcons/Langue.gif";
import LoupeIcon from "../images/categoryIcons/Loupe.gif";
import MicroscopeIcon from "../images/categoryIcons/Microscope.gif";
import NezIcon from "../images/categoryIcons/Nez.gif";
import OeilNuIcon from "../images/categoryIcons/Oeil_nu.gif";
import PersonnesIcon from "../images/categoryIcons/Personnes.gif";
import PrefixeIcon from "../images/categoryIcons/Préfixe.gif";
import ReactifChimiqueIcon from "../images/categoryIcons/Réactif-chimique.gif";
import ScienceIcon from "../images/categoryIcons/Science.gif";
import SuffixeIcon from "../images/categoryIcons/Suffixe.gif";
import ToxinesEtSyndromesIcon from "../images/categoryIcons/Toxines-et-syndromes.gif";
import ToucherIcon from "../images/categoryIcons/Toucher.gif";
import PharmacieIcon from "../images/categoryIcons/Pharmacie.gif";

export type IconImageDimensions = {
  width: number;
  height: number;
};

export type CategoryDetails = {
  icon: StaticImageData;
  text: string;
  dimensions: IconImageDimensions;
  description: string;
};

export const CATEGORY_DATA: Record<string, CategoryDetails> = {
  classification: {
    icon: ClassificationIcon,
    text: "Classification",
    dimensions: { width: 55, height: 52 },
    description:
      "Nom de famille ou de regroupement de champignons ou autre terme relatif à la classification",
  },
  "cycle de vie": {
    icon: CycleDeVieIcon,
    text: "Cycle de vie",
    dimensions: { width: 55, height: 52 },
    description: "Terme relatif aux différentes phases d'un cycle de vie",
  },
  écologie: {
    icon: EcologieIcon,
    text: "Écologie",
    dimensions: { width: 55, height: 52 },
    description:
      "Terme relatif à l'habitat, au substrat ou au mode de croissance de champignons",
  },
  saveur: {
    icon: LangueIcon,
    text: "Langue",
    dimensions: { width: 55, height: 46 },
    description: "Terme relatif aux sensations gustatives",
  },
  loupe: {
    icon: LoupeIcon,
    text: "Loupe",
    dimensions: { width: 55, height: 52 },
    description:
      "Caractère visuel nécessitant une loupe 10x pour son observation",
  },
  micro: {
    icon: MicroscopeIcon,
    text: "Microscope",
    dimensions: { width: 55, height: 77 },
    description: "Élément ou caractère nécessitant l'usage d'un microscope",
  },
  odeur: {
    icon: NezIcon,
    text: "Nez",
    dimensions: { width: 55, height: 77 },
    description: "Terme définissant une odeur",
  },
  macro: {
    icon: OeilNuIcon,
    text: "Oeil nu",
    dimensions: { width: 55, height: 33 },
    description:
      "Partie anatomique ou caractère visible à l'œil nu ou terme relatif aux couleurs",
  },
  personnes: {
    icon: PersonnesIcon,
    text: "Personnes",
    dimensions: { width: 55, height: 61 },
    description: "Titre donné à des personnes s'intéressant aux champignons",
  },
  préfixe: {
    icon: PrefixeIcon,
    text: "Préfixe",
    dimensions: { width: 55, height: 52 },
    description: "Préfixe utilisé en mycologie",
  },
  chimie: {
    icon: ReactifChimiqueIcon,
    text: "Réactif chimique",
    dimensions: { width: 55, height: 53 },
    description:
      "Composé chimique servant de réactifs ou molécule biochimique contenu dans des champignons",
  },
  science: {
    icon: ScienceIcon,
    text: "Science",
    dimensions: { width: 55, height: 55 },
    description: "Domaine de connaissances",
  },
  suffixe: {
    icon: SuffixeIcon,
    text: "Suffixe",
    dimensions: { width: 55, height: 52 },
    description: "Suffixe utilisé en mycologie",
  },
  toxine: {
    icon: ToxinesEtSyndromesIcon,
    text: "Toxines et syndromes",
    dimensions: { width: 55, height: 52 },
    description: "Terme concernant une toxine ou un syndrome d'intoxication",
  },
  toucher: {
    icon: ToucherIcon,
    text: "Toucher",
    dimensions: { width: 55, height: 33 },
    description:
      "Caractère observable au toucher ou à la manipulation, tel que la viscosité ou la consistance",
  },
  pharmacologie: {
    icon: PharmacieIcon,
    text: "Pharmacologie",
    dimensions: { width: 55, height: 55 },
    description:
      "Terme relatif à la pharmacologie des champignons dits médicinaux",
  },
};

export const getCategoryDetails = (categoryName: string): CategoryDetails | undefined => {
  return CATEGORY_DATA[categoryName.toLowerCase()];
};

export const getAllCategories = (): CategoryDetails[] => {
  return Object.values(CATEGORY_DATA);
};
