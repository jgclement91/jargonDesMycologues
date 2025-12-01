import Link from "next/link";
import Image from "next/image";
import GlossaireWrapper from "../components/glossaire-wrapper";
import { fetchTerm, getImageUrl } from "../clients/sanityClient";
import MicroscopeIcon from "../images/categoryIcons/Microscope.gif";
import { ArrowRight, Search, BookOpen } from "lucide-react";
import CategoryLegendButton from "../components/category-legend-button";

const POPULAR_TERMS = [
  "Ascome",
  "Collarié",
  "Pleurote",
  "Bolet",
  "Lactaire",
  "Alvéolé",
];

type TermData = {
  term: string;
  definition: string;
  imageUrl: string | null;
  categories: string[];
};

const Page = async () => {
  const popularTermsData = await Promise.all(
    POPULAR_TERMS.map(async (term) => {
      try {
        const data = await fetchTerm(term);
        if (!data) return null;

        const imageUrl = data.example
          ? getImageUrl(data.example, 300)
          : data.schema
          ? getImageUrl(data.schema, 300)
          : null;

        return {
          term: data.term,
          definition: data.definition,
          imageUrl,
          categories: data.categories,
        };
      } catch (error) {
        return null;
      }
    })
  );

  const validTerms = popularTermsData.filter(x => x !== null);

  return (
    <GlossaireWrapper>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Explorer le glossaire
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Découvrez plus de 1200 termes mycologiques illustrés, accompagnés
            d&apos;exemples et de schémas détaillés. Utilisez la navigation
            alphabétique ou la recherche pour trouver rapidement ce que vous
            cherchez.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
          <div className="bg-white lg:col-span-2 lg:order-1 order-1 p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Recherche rapide
            </h3>
            <p className="text-slate-600 text-sm">
              Utilisez la barre de recherche dans le menu de navigation pour
              trouver instantanément n&apos;importe quel terme du glossaire.
            </p>
          </div>
          <div className="bg-white lg:col-span-2 lg:order-3 order-2 p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Navigation alphabétique
            </h3>
            <p className="text-slate-600 text-sm">
              Parcourez les termes par ordre alphabétique en cliquant sur une
              lettre dans le menu de navigation.
            </p>
          </div>
          <div className="bg-white lg:col-span-3 lg:order-2 order-3 p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Image
                src={MicroscopeIcon}
                alt="Microscope"
                width={20}
                height={20}
                className="opacity-80"
              />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Symboles contextuels
            </h3>
            <p className="text-slate-600 text-sm">
              Chacun des éléments s&apos;accompagne de symboles graphiques
              indiquant les contextes d&apos;utilisation
            </p>
            <CategoryLegendButton />
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Quelques exemples
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validTerms.map((termData: TermData) => (
              <Link
                key={termData.term}
                href={`/glossaire/${termData.term}`}
                className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-emerald-500 hover:shadow-md transition-all"
              >
                {termData.imageUrl && (
                  <div className="relative h-48 bg-slate-50">
                    <Image
                      src={termData.imageUrl}
                      alt={termData.term}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors flex items-center justify-between">
                    {termData.term}
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Prêt à explorer?
          </h3>
          <p className="text-slate-600 mb-4">
            Cliquez sur une lettre dans le menu de navigation pour commencer
            votre exploration du glossaire mycologique.
          </p>
        </div>
      </div>
    </GlossaireWrapper>
  );
};

export default Page;
