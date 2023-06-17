import { PortableText } from "@portabletext/react";

type Props = {
    term: string;
    definition: any;
    synonyms: any;
};

const TermDetails = ({ term, definition, synonyms }: Props) => {
    return (
        <div className="px-8 py-6 bg-slate-200">
            <div className="text-green-600 text-6xl font-semibold">
                {term}
            </div>
            {
                synonyms && synonyms.length > 0 &&
                <span className="text-justify font-bold">
                    Synonyme(s): <PortableText
                        value={synonyms} />
                </span>
            }
            <div className="pt-2">
                <p className="text-justify font-semibold leading-loose">
                    <PortableText
                        value={definition} />
                </p>
            </div>
        </div >
    )
}

export default TermDetails;