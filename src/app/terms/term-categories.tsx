"use client";

import Image, { StaticImageData } from "next/image";
import Tooltip from "@igloo-ui/tooltip";
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

import "./term-categories.css"

type IconImageDimensions = {
  width: number;
  height: number;
};

type categoryDetails = {
  icon: StaticImageData;
  text: string;
  dimensions: IconImageDimensions;
  description: string;
};

const categoryDictionary = new Map<string, categoryDetails>();

categoryDictionary.set("classification", {
  icon: ClassificationIcon,
  text: "Classification",
  dimensions: { width: 55, height: 52 },
  description:
    "Nom de famille ou de regroupement de champignons ou autre terme relatif à la classification",
});
categoryDictionary.set("cycle de vie", {
  icon: CycleDeVieIcon,
  text: "Cycle de vie",
  dimensions: { width: 55, height: 52 },
  description: "Terme relatif aux différentes phases d’un cycle de vie",
});

categoryDictionary.set("écologie", {
  icon: EcologieIcon,
  text: "Écologie",
  dimensions: { width: 55, height: 52 },
  description:
    "Terme relatif à l’habitat, au substrat ou au mode de croissance de champignons",
});
categoryDictionary.set("saveur", {
  icon: LangueIcon,
  text: "Langue",
  dimensions: { width: 55, height: 46 },
  description: "Terme relatif aux sensations gustatives",
});
categoryDictionary.set("loupe", {
  icon: LoupeIcon,
  text: "Loupe",
  dimensions: { width: 55, height: 52 },
  description:
    "Caractère visuel nécessitant une loupe 10x pour son observation",
});
categoryDictionary.set("micro", {
  icon: MicroscopeIcon,
  text: "Microscope",
  dimensions: { width: 55, height: 77 },
  description: "Élément ou caractère nécessitant l’usage d’un microscope",
});
categoryDictionary.set("odeur", {
  icon: NezIcon,
  text: "Nez",
  dimensions: { width: 55, height: 77 },
  description: "Terme définissant une odeur",
});
categoryDictionary.set("macro", {
  icon: OeilNuIcon,
  text: "Oeil nu",
  dimensions: { width: 55, height: 33 },
  description:
    "Partie anatomique ou caractère visible à l’œil nu ou terme relatif aux couleurs",
});
categoryDictionary.set("personnes", {
  icon: PersonnesIcon,
  text: "Personnes",
  dimensions: { width: 55, height: 61 },
  description: "Titre donné à des personnes s’intéressant aux champignons",
});
categoryDictionary.set("préfixe", {
  icon: PrefixeIcon,
  text: "Préfixe",
  dimensions: { width: 55, height: 52 },
  description: "Préfixe utilisé en mycologie",
});
categoryDictionary.set("chimie", {
  icon: ReactifChimiqueIcon,
  text: "Réactif chimique",
  dimensions: { width: 55, height: 53 },
  description:
    "Composé chimique servant de réactifs ou molécule biochimique contenu dans des champignons",
});
categoryDictionary.set("science", {
  icon: ScienceIcon,
  text: "Science",
  dimensions: { width: 55, height: 55 },
  description: "Domaine de connaissances",
});
categoryDictionary.set("suffixe", {
  icon: SuffixeIcon,
  text: "Suffixe",
  dimensions: { width: 55, height: 52 },
  description: "Suffixe utilisé en mycologie",
});
categoryDictionary.set("toxine", {
  icon: ToxinesEtSyndromesIcon,
  text: "Toxines et syndromes",
  dimensions: { width: 55, height: 52 },
  description: "Terme concernant une toxine ou un syndrome d’intoxication",
});
categoryDictionary.set("toucher", {
  icon: ToucherIcon,
  text: "Toucher",
  dimensions: { width: 55, height: 33 },
  description:
    "Caractère observable au toucher ou à la manipulation, tel que la viscosité ou la consistance",
});

type Props = {
  categories: string[];
};

const TermCategories = ({ categories }: Props) => {
  return (
    <div className="flex pl-4 gap-8 self-center">
      {categories.map((categoryName: string) => {
        const category = categoryDictionary.get(categoryName.toLowerCase());

        if (!category) {
          return <></>;
        }

        return (
          <Tooltip key={categoryName} content={category.description} tooltipClassName="tooltip" maxWidth={250}>
            <Image
              className="min-w-[55px]"
              key={category.text}
              alt={category.text}
              src={category.icon}
              width={category.dimensions.width}
              height={category.dimensions.height}
            />
          </Tooltip>
        );
      })}
    </div>
  );
};

export default TermCategories;
