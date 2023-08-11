"use client";

type Props = {
  letter: string;
  onLetterSelect: () => void;
};

const LetterListItem = ({ letter, onLetterSelect }: Props) => {
  var classes = "h-full flex items-center pl-6 py-3 whitespace-pre-line no-underline hover:bg-slate-100 hover:bg-slate-100 select-none cursor-pointer";

  return (
    <a className={classes} key={letter} onClick={onLetterSelect}>
      {letter}
    </a>
  );
};

export default LetterListItem;
