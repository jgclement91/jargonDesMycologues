type Props = {
    letter: string;
};

const terms = [
    "Abaxial",
    "Aberrant",
    "Acerbe",
    "Aciculaire",
    "Aciculé",
    "Acide",
    "Acide iboténique",
    "Acidulé",
    "Âcre",
    "Acromélalgien",
    "Aculéolé",
    "Acuminé",
    "Acystidié",
    "Adaxial",
    "Adné",
    "Adnexé",
    "Aérifère",
    "Agaric",
    "Agaricoïde",
    "Agglutinant",
    "Agrocybe",
    "Aigu",
    "Aiguillon",
    "Allantoïde",
    "Alutacé",
    "Alvéolaire",
    "Alvéole",
    "Alvéolé",
    "Amanite",
    "Amarescent",
    "Amatoxine",
    "Amer",
    "Ammoniaque",
    "Amorphe",
    "Amphigène",
    "Ample",
    "Ampullacé",
    "Amygdaliforme",
    "Amygdaloïde",
    "Amyloïde",
    "Anamorphe",
    "Anastomose",
    "Anastomosé",
    "Anfractuosité",
    "Ange de la mort",
    "Anguleux",
    "Anneau",
    "Annelé",
    "Annulaire",
    "Annuliforme",
    "Anormal",
    "Anse d'anastomose",
    "Apex",
    "Apical",
    "Apicule",
    "Aplani",
    "Apode",
    "Apophyse",
    "Apothèce",
    "Apothécie",
    "Appendice",
    "Appendiculé",
    "Appliqué",
    "Apprimé",
    "Âpre",
    "Aqueux",
    "Arachnéen",
    "Arachnoïde",
    "Aranéeux",
    "Aréole",
    "Aréolé",
    "Arête",
    "Argenté",
    "Argilacé",
    "Armillaire",
    "Armille",
    "Arqué",
    "Arrhénie",
    "Arrondi",
    "Ascendant",
    "Ascocarpe",
    "Ascome",
    "Ascomycètes",
    "Aspérité",
    "Asque",
    "Astérophore",
    "Astrée",
    "Astringent",
    "Asymétrique",
    "Atténué",
    "Atypique",
    "Azoné"
];

const TermList = ({ letter }: Props) => {
    return (
        <div className="w-full">
            {letter === "A"
                ? <div className="divide-y divide-gray-400 w-full">
                    {terms.map(term => {
                        return <div className="h-12 flex items-center pl-6 py-4" key={term}>{term}</div>
                    })
                    }
                </div>
                : <div></div>
            }

        </div>
    );
};

export default TermList;