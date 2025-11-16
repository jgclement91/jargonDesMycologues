import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, BookOpen, Eye } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import { fetchTerm, getImageUrl } from "../clients/sanityClient";

const POPULAR_TERMS = ["Ascome", "Collarié", "Pleurote", "Bolet", "Lactaire", "Alvéolé"];

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

  const validTerms = popularTermsData.filter(Boolean);

  return (
    <div className="flex flex-grow">
      <div className="flex flex-grow flex-col">
        <div className="content h-full">
          <div className="overflow-y-auto h-full">
            <Header />

            <div className="max-w-5xl mx-auto px-6 py-8">
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-slate-800 mb-4">
                  Explorer le Glossaire
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Découvrez plus de 1200 termes mycologiques illustrés, accompagnés d&apos;exemples
                  et de schémas détaillés. Utilisez la navigation alphabétique ou la recherche
                  pour trouver rapidement ce que vous cherchez.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Recherche rapide
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Utilisez la barre de recherche dans le menu de navigation pour trouver instantanément
                    n&apos;importe quel terme du glossaire.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Navigation alphabétique
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Parcourez les termes par ordre alphabétique en cliquant sur une lettre
                    dans le menu de navigation.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Hyperliens intégrés
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Explorez les définitions liées en cliquant sur les termes soulignés
                    pour approfondir vos connaissances.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Termes populaires
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {validTerms.map((termData: any) => (
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
                  Cliquez sur une lettre dans le menu de navigation pour commencer votre exploration
                  du glossaire mycologique.
                </p>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
