import { CSSProperties } from "react";

import NumberToString from "@/widgets/NumberToString";

interface NumberGridProps {
    numbers: (bigint | number | string)[];
    columns: number;
}

// Numbers in a grid of the given columns, e.g. 2 for a 2x2 square
const NumberGrid = ({ numbers, columns }: NumberGridProps) =>
    <div className="number-grid" style={{ "--columns": columns } as CSSProperties}>
        {numbers.map((number, index) => <NumberToString key={index} number={number} />)}
    </div>

export default NumberGrid;
