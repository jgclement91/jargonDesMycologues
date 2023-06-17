'use client'

import Link from 'next/link'

type Props = {
    term: string;
    selected: boolean;
}

const TermListItem = ({ term, selected }: Props) => {
    var classes = `h-full flex items-center pl-6 py-3 whitespace-pre-line no-underline ${selected ? "hover:bg-green-200" : "hover:bg-slate-100"} ${selected ? "selected-term" : ""}`;

    return <Link className={classes} key={term} href={`/glossaire/${term}`}>{term}</Link>
};

export default TermListItem;