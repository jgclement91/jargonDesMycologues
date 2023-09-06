"use client";

type Props = {
  selectedLetter: string;
  onChange: () => void;
};

const LetterSelect = ({ selectedLetter, onChange }: Props) => {
  const buttonText = "A -> Z";

  return (
    <div className="flex h-12 bg-green-600 items-center">
      {selectedLetter && (
        <div
          className="text-white font-bold pl-6 items-center cursor-pointer"
          onClick={() => onChange()}
        >
          {buttonText}
        </div>
      )}
    </div>
  );
};

export default LetterSelect;
