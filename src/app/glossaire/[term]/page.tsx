import { getAllTerms, fetchTerm, getImageUrl } from "@/app/clients/sanityClient";
import Content from "../../components/content";

type Props = {
    params: {
        term: string
    }
}

export async function generateStaticParams() {
    return await getAllTerms();
}

const Page = async ({ params }: Props) => {

    if(params.term.length == 1) {
        return (
            <div className="app">
                <div className="content">
                </div>
            </div>
        )
    }

    const data = await fetchTerm(decodeURIComponent(params.term));
    const exampleUrl = data.example && getImageUrl(data.example);
    const schemaUrl = data.schema && getImageUrl(data.schema);

    return (
        <div className="app">
            <div className="content">
                <Content term={data.term} definition={data.definition} synonyms={data.synonymsRichText} exampleImageUrl={exampleUrl} exampleDescription={data.exampleDescription} schemaImageUrl={schemaUrl} />
            </div>
        </div>
    )
};

export default Page;
