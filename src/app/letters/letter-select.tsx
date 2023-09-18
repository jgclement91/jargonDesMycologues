"use client";

type Props = {
  onChange: () => void;
  hideButton: boolean;
};

const LetterSelect = ({ onChange, hideButton }: Props) => {
  const buttonText = "A -> Z";

  return (
    <div className="flex h-12 bg-green-600 items-center">
      {!hideButton && (
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
