import { getAllTerms, fetchTerm } from "@/app/clients/sanityClient";

import Content from "../../components/content";
// import ErrorPage from 'next/error'

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

    // if(!data) {
    //     return <ErrorPage statusCode={404} />
    // }

    return (
        <div className="app">
            <div className="content">
                <Content term={data.term} definition={data.definition} synonyms={data.synonymsRichText} />
            </div>
        </div>
    )
};

export default Page;
