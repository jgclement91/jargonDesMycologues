import TermDetails from "../terms/term-details";
import Header from "./header";

type Props = {
    term: string;
    definition: any;
    synonyms: any;
};

const Content = ({ term, definition, synonyms }: Props) => {

    return (
        <div className="content">
            <Header />
            <TermDetails term={term} definition={definition} synonyms={synonyms} />
        </div>
    )
}

export default Content;