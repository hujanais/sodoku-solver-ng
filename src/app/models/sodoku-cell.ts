const GRIDSIZE = 9;

export interface Coord {
    row: number;
    col: number;
}

export class SodokuCell {
    public row: number;
    public col: number;
    public value?: number | null;

    // The row-col of the holding container.
    public containerCoord: Coord;

    constructor(row: number, col: number, value?: number) {
        this.row = row;
        this.col = col;
        this.value = value;

        this.containerCoord = this.calculateContainerId(row, col, GRIDSIZE);
    }

    /**
     * Determine which container the cell is associated with.
     * @param row current row
     * @param col current col
     * @param gridSize the size of the grid. 9 for 9x9
     */
    private calculateContainerId(row: number, col: number, gridSize: number): Coord {
        const containerSize = Math.sqrt(GRIDSIZE);
        let X = Math.floor(row / containerSize);
        let Y = Math.floor(col / containerSize);

        return { row: X, col: Y }
    }
}
