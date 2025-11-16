"use client";

type Props = {
  letter: string;
  onLetterSelect: () => void;
};

const LetterListItem = ({ letter, onLetterSelect }: Props) => {
  const classes = "w-full text-left flex items-center pl-6 py-3 min-h-[44px] whitespace-pre-line select-none hover:bg-slate-50 cursor-pointer bg-transparent border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors";

  return (
    <button type="button" className={classes} onClick={onLetterSelect} aria-label={`Lettre ${letter}`}>
      {letter}
    </button>
  );
};

export default LetterListItem;
