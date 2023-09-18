import Footer from "./components/footer";
import Header from "./components/header";

const Home = () => {
  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="content h-3/4 pt-8 px-16 flex flex-col gap-4 font-bold">
        <p>
          Bien souvent, les glossaires de mycologie s’adressent à des initiés ou
          à des amateurs familiers avec le vocabulaire de la botanique, le latin
          et le grec ancien et parfois même au langage de la mycologie
          elle-même. Ainsi, les termes utilisés dans les définitions font
          fréquemment référence à des concepts plus ou moins bien compris des
          novices. Ce glossaire illustré et vulgarisé vise principalement à
          combler cette lacune par l’utilisation d’un langage accessible à tous
          et la présentation d’exemples, de schémas et de plus de 75 planches
          anatomiques, dont une soixantaine se consacrent à des portraits de
          « familles ».
        </p>
        <p>
          Toutefois, il demeure parfois nécessaire d’utiliser dans les
          définitions des termes techniques se référant à certains concepts
          abstraits ou complexes. Pour pallier cette difficulté, des hyperliens
          ont été implantés à même le texte permettant d’accéder d’un simple
          clic de souris aux définitions.
        </p>
        <p>
          Chacun des éléments de ce glossaire s’accompagne d’un ou deux symboles
          graphiques indiquant le ou les contextes d’utilisation du terme
          décrit. Il suffit de passer la souris sur ces icônes pour afficher sa
          signification.
        </p>
        <div>
          <h2>Remerciements :</h2>
          <p>
            L’équipe tient à remercier Michel Ashby pour son aide concernant les
            champignons hypogés et Suzanne Béland pour ses explications sur les
            myxomycètes.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
