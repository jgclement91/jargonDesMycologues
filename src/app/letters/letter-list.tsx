import LetterListItem from "./letter-list-item";

import "./letter-list.css";
import LetterSelect from "./letter-select";

type Props = {
  onLetterSelect: (letter: string) => void;
};

const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const LetterList = ({ onLetterSelect }: Props) => {
  return (
    <div className="h-full w-52">
      <div className="divide-y divide-gray-400">
        {letters.map((letter) => (
          <LetterListItem
            key={letter}
            letter={letter}
            onLetterSelect={() => onLetterSelect(letter)}
          />
        ))}
      </div>
    </div>
  );
};

export default LetterList;
