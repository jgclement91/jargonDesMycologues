import exp from "constants";

export type SizeOption = {
  key: string;
  label: string;
  width: number;
  height: number;
};

export const sizeOptions: SizeOption[] = [
  { key: "small", label: "Petite", width: 400, height: 247 },
  { key: "medium", label: "Moyenne", width: 550, height: 340 },
  { key: "large", label: "Grande", width: 700, height: 433 },
  { key: "xlarge", label: "Très grande", width: 850, height: 525 },
];