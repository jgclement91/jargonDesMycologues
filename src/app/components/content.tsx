import TermDetails from "../terms/term-details";
import Header from "./header";

type Props = {
    term: string;
    definition: any;
    synonyms: any;
    exampleImageUrl: any;
    exampleDescription: any;
    schemaImageUrl: any;
};

const Content = ({ term, definition, synonyms, exampleImageUrl, exampleDescription, schemaImageUrl }: Props) => {

    return (
        <div className="content">
            <Header />
            <TermDetails term={term} definition={definition} synonyms={synonyms} exampleImageUrl={exampleImageUrl} exampleDescription={exampleDescription} schemaImageUrl={schemaImageUrl} />
        </div>
    )
}

export default Content;