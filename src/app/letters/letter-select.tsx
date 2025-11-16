"use client";

type Props = {
  onChange: () => void;
  hideButton: boolean;
};

const LetterSelect = ({ onChange, hideButton }: Props) => {
  if (hideButton) {
    return null;
  }

  return (
    <button
      className="w-full text-emerald-700 hover:text-emerald-800 font-medium text-sm mb-3 text-left underline"
      onClick={() => onChange()}
      aria-label="Retour à la liste alphabétique"
    >
      ← Retour à A-Z
    </button>
  );
};

export default LetterSelect;
