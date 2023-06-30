"use client";

type Props = {
  term: string;
  selected: boolean;
  onTermSelect: () => void;
};

const TermListItem = ({ term, selected, onTermSelect }: Props) => {
  var classes = `h-full flex items-center pl-6 py-3 whitespace-pre-line no-underline ${
    selected ? "hover:bg-green-200" : "hover:bg-slate-100"
  } ${selected ? "selected-term" : ""}`;

  const handleOnClick = () => {
    onTermSelect();
  };

  return (
    <a className={classes} key={term} onClick={() => handleOnClick()}>
      {term}
    </a>
  );
};

export default TermListItem;