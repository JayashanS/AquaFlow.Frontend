import { HandleFilterChangeProps } from "./fishFarm";

export type Mode = "view" | "create" | "update";

export interface OptionsPaneProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  handleFilterChange: (props: HandleFilterChangeProps) => void;
}
