"use client";

import Image from "next/image";
import BackgroundLeft from "./images/home/home-background-left.jpg";
import BackgroundRight from "./images/home/home-background-right.jpg";
import Footer from "./components/footer";
import Header from "./components/header";
import { useMediaQuery } from "usehooks-ts";

import "./home.css";
import { Metadata } from "next";

const Home = () => {
  const large = useMediaQuery("(min-width:1024px)");
  const imagesHeight = large ? 500 : 400;
  const imageClass = large ? "large-image" : "small-image";

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex flex-row bg-[#EBE3DA] h-full overflow-y-auto">
        <div className={`hidden min-[880px]:flex ${imageClass}-container`}>
          <Image
            height={imagesHeight}
            className={imageClass}
            src={BackgroundLeft}
            alt="Arrière-plan gauche"
          />
        </div>
        <div
          className={
            "flex-grow h-3/4 pt-8 flex flex-col gap-4 font-bold text-center px-4 sm:px-2 lg:leading-9 lg:px-4"
          }
        >
          <h1>
            Bien souvent, les glossaires de mycologie s’adressent à des initiés
            ou à des amateurs familiers avec le vocabulaire de la botanique, du
            grec ancien et du latin et parfois même avec le langage de la
            mycologie elle-même. Ainsi, les termes utilisés dans les définitions
            font fréquemment référence à des concepts plus ou moins bien compris
            des novices. Ce glossaire illustré et vulgarisé, contenant plus de
            1200 termes, vise principalement à combler cette lacune par
            l’utilisation d’un langage accessible à tous et la présentation
            d’exemples, de schémas et de plus de 75 planches anatomiques, dont
            une soixantaine se consacrent à des portraits de
            <span className="whitespace-nowrap"> « famille ».</span> Toutefois,
            il demeure parfois nécessaire d’utiliser dans les définitions des
            termes techniques se référant à certains concepts abstraits ou
            complexes. Pour pallier cette difficulté, nous avons implanté des
            hyperliens à même le texte permettant d’accéder d’un simple clic de
            souris aux définitions.
          </h1>
          <p>
            Chacun des éléments de ce glossaire s’accompagne de un ou deux
            symboles graphiques indiquant le ou les contextes d’utilisation du
            terme décrit. Il suffit de passer la souris sur ces icônes pour
            afficher leur signification.
          </p>
          <p className="text-red-600">
            Un accès direct aux planches est maintenant disponible.
          </p>
          <div>
            <div className="text-xs font-medium">
              <p>Remerciements :</p>
              <p>
                L’équipe tient à remercier Michel Ashby pour son aide concernant
                les champignons hypogés et Suzanne Béland pour ses explications
                sur les myxomycètes.
              </p>
            </div>
          </div>
        </div>
        <div className={`hidden min-[750px]:flex ${imageClass}-container`}>
          <Image
            height={imagesHeight}
            className={imageClass}
            src={BackgroundRight}
            alt="Arrière-plan droit"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
