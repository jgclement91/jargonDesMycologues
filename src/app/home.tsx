"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "./components/footer";
import Header from "./components/header";
import LandscapeContainer from "./components/landscape-container";
import { Button } from "@/components/ui/button";
import { BookOpen, Image as ImageIcon } from "lucide-react";

import OeilNuIcon from "./images/categoryIcons/Oeil_nu.gif";
import MicroscopeIcon from "./images/categoryIcons/Microscope.gif";
import ClassificationIcon from "./images/categoryIcons/Classification.gif";
import BackgroundLeft from "./images/home/home-background-left.jpg";
import BackgroundRight from "./images/home/home-background-right.jpg";

const Home = () => {
  const router = useRouter();

  return (
    <LandscapeContainer
      header={<Header />}
      footer={<Footer />}
    >
        <main className="relative" style={{ backgroundColor: '#F7F2ED', minHeight: '100%' }}>
        {/* Subtle background images */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <Image
            src={BackgroundLeft}
            alt=""
            className="absolute left-0 top-0 h-full w-auto object-cover"
            aria-hidden="true"
          />
          <Image
            src={BackgroundRight}
            alt=""
            className="absolute right-0 top-0 h-full w-auto object-cover"
            aria-hidden="true"
          />
        </div>

        <div className="container px-4 md:px-6 mx-auto py-8 md:py-12 max-w-6xl relative z-10">

          <section className="text-center mb-12 py-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-emerald-900 mb-4">
              Le jargon des mycologues
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Un glossaire illustré et vulgarisé avec hyperliens, exemples et planches anatomiques détaillées
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-600">1200+</div>
                <div className="text-sm text-slate-600">Termes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">75+</div>
                <div className="text-sm text-slate-600">Planches</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">60</div>
                <div className="text-sm text-slate-600">Portraits de famille</div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-medium text-emerald-800 mb-4">
                À propos de ce glossaire
              </h2>
              <div className="prose prose-lg prose-emerald max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Bien souvent, les glossaires de mycologie s&apos;adressent à des initiés
                  ou à des amateurs familiers avec le vocabulaire de la botanique, du
                  grec ancien et du latin et parfois même avec le langage de la
                  mycologie elle-même. Ainsi, les termes utilisés dans les définitions
                  font fréquemment référence à des concepts plus ou moins bien compris
                  des novices.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Ce glossaire illustré et vulgarisé, contenant plus de 1200 termes,
                  vise principalement à combler cette lacune par l&apos;utilisation d&apos;un
                  langage accessible à tous et la présentation d&apos;exemples, de schémas
                  et de plus de 75 planches anatomiques, dont une soixantaine se
                  consacrent à des portraits de <span className="whitespace-nowrap">« famille ».</span> Toutefois,
                  il demeure parfois nécessaire d&apos;utiliser dans les définitions des
                  termes techniques se référant à certains concepts abstraits ou
                  complexes. Pour pallier cette difficulté, nous avons implanté des
                  hyperliens à même le texte permettant d&apos;accéder d&apos;un simple clic aux
                  définitions.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-emerald-800 mb-6 text-center">
              Ce que vous trouverez
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <Image
                    src={OeilNuIcon}
                    alt="Oeil nu"
                    width={55}
                    height={33}
                    className="opacity-80"
                  />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2 text-center">
                  Plus de 1200 termes
                </h3>
                <p className="text-slate-600 text-sm text-center">
                  Définitions vulgarisées avec langage accessible et hyperliens intégrés
                </p>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <Image
                    src={ClassificationIcon}
                    alt="Classification"
                    width={55}
                    height={52}
                    className="opacity-80"
                  />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2 text-center">
                  75+ planches anatomiques
                </h3>
                <p className="text-slate-600 text-sm text-center">
                  Illustrations détaillées incluant 60 portraits de famille
                </p>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <Image
                    src={MicroscopeIcon}
                    alt="Microscope"
                    width={55}
                    height={77}
                    className="opacity-80"
                  />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2 text-center">
                  Symboles contextuels
                </h3>
                <p className="text-slate-600 text-sm text-center">
                  Chacun des éléments s&apos;accompagne de symboles graphiques indiquant
                  les contextes d&apos;utilisation
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-8 text-center">
              <h2 className="text-2xl font-medium text-emerald-900 mb-4">
                Prêt à explorer?
              </h2>
              <p className="text-emerald-700 mb-6 max-w-2xl mx-auto">
                Parcourez le glossaire illustré ou découvrez les planches anatomiques détaillées
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => router.push('/glossaire')}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explorer le glossaire
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => router.push('/planche')}
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Voir les planches
                </Button>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-3">
                Remerciements
              </h3>
              <p className="text-sm text-slate-600">
                L&apos;équipe tient à remercier Michel Ashby pour son aide concernant
                les champignons hypogés et Suzanne Béland pour ses explications
                sur les myxomycètes.
              </p>
            </div>
          </section>

        </div>
        </main>
    </LandscapeContainer>
  );
};

export default Home;
