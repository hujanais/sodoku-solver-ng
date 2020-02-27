import { Injectable } from '@angular/core';
import { SodokuCell } from '../models/sodoku-cell';
import { Subject, Observable } from 'rxjs';
import { RecursionModel } from '../models/recursion-model';
import * as moment from 'moment';

// https://www.geeksforgeeks.org/sudoku-backtracking-7/

const SIMULATION_DELAY = 10;
const GRIDSIZE = 9;

@Injectable({
  providedIn: 'root'
})

export class SodokuSolverService {

  public cells: Array<Array<SodokuCell>>;

  private recursionModel: RecursionModel = { recursionDepth: 0, elapsedTime: 0, startTime: 0, isStarted: false, numOfMoves: 0 };
  private solveSubject: Subject<RecursionModel>;

  constructor() {
    this.solveSubject = new Subject<RecursionModel>();

    // initialize the grid.
    this.cells = new Array<Array<SodokuCell>>();
    for (let i = 0; i < GRIDSIZE; i++) {
      this.cells.push(new Array<SodokuCell>());
      for (let j = 0; j < GRIDSIZE; j++) {
        this.cells[i].push(new SodokuCell(i, j, null));
      }
    }
  }

  /**
   * Clear the board.
   */
  public Clear() {
    for (let i = 0; i < GRIDSIZE; i++) {
      for (let j = 0; j < GRIDSIZE; j++) {
        this.cells[i][j].value = null;
      }
    }
  }

  /**
   * Reset the game
   */
  public Reset(): void {
    // populate the game
    const seedArray = [
      [3, null, 6, 5, null, 8, 4, null, null],
      [5, 2, null, null, null, null, null, null, null],
      [null, 8, 7, null, null, null, null, 3, 1],
      [null, null, 3, null, 1, null, null, 8, null],
      [9, null, null, 8, 6, 3, null, null, 5],
      [null, 5, null, null, 9, null, 6, null, null],
      [1, 3, null, null, null, null, 2, 5, null],
      [null, null, null, null, null, null, null, 7, 4],
      [null, null, 5, 2, null, 6, 3, null, null]
    ]

    const hardArray = [
      [1, null, null, null, null, 7, null, 9, null],
      [null, 3, null, null, 2, null, null, null, 8],
      [null, null, 9, 6, null, null, 5, null, null],
      [null, null, 5, 3, null, null, 9, null, null],
      [null, 1, null, null, 8, null, null, null, 2],
      [6, null, null, null, null, 4, null, null, null],
      [3, null, null, null, null, null, null, 1, null],
      [null, 4, null, null, null, null, null, null, 7],
      [null, null, 7, null, null, null, 3, null, null]
    ]

    this.seedGrid(seedArray);
  }

  /**
   * Solve the game.
   */
  public Solve(): Promise<boolean> {
    this.recursionModel.isStarted = true;
    this.recursionModel.numOfMoves = 0;
    this.recursionModel.startTime = moment().unix();
    return this.doSolve(0);
  }

  /**
   * Get the observable.
   */
  public getObservable(): Observable<RecursionModel> {
    return this.solveSubject.asObservable();
  }

  private seedGrid(seedArray: Array<Array<number>>) {
    for (let i = 0; i < GRIDSIZE; i++) {
      for (let j = 0; j < GRIDSIZE; j++) {
        this.cells[i][j].value = seedArray[i][j];
      }
    }
  }

  /**
   * 
   * @param depth recursion depth
   */
  private async doSolve(depth: number): Promise<boolean> {
    this.updateRecursionModel(depth, moment().unix());
    await this.sleep(SIMULATION_DELAY);
    let isFull = true;
    let row = -1;
    let col = -1;
    // check to see if there game is over.
    for (let i = 0; i < GRIDSIZE; i++) {
      for (let j = 0; j < GRIDSIZE; j++) {
        if (this.cells[i][j].value === null) {
          row = i;
          col = j;

          isFull = false;
          break;
        }
      }

      if (!isFull) {
        break;
      }
    }

    if (isFull) {
      this.updateRecursionModel(depth, moment().unix());
      this.recursionModel.isStarted = false;
      return true;
    }

    for (let num = 0; num < GRIDSIZE; num++) {
      this.recursionModel.numOfMoves++;
      if (this.isValid(row, col, num)) {
        this.cells[row][col].value = num;
        if (await this.doSolve(depth + 1)) {
          return true;
        }
        else {
          this.cells[row][col].value = null; // reset the cell.
        }
      }
    }

    return false;
  }

  /**
   * Test to see if this value is a valid number.
   * @param row 
   * @param col 
   * @param testValue 
   */
  private isValid(row: number, col: number, testValue: number): boolean {
    // check that this cell is not already occupied.
    if (this.cells[row][col].value !== null) {
      return false;
    }

    // check that the number is unique in the container.
    const cellsInContainer = this.getAllCellsInContainer(row, col);
    if (cellsInContainer.find(cell => cell.value === testValue) !== undefined) {
      return false;
    }

    // check that the number is not repeated in the row.
    const rowCells = this.cells[row];
    if (rowCells.find(cell => cell.value === testValue) !== undefined) {
      return false;
    }

    // // check that the number is not repeated in the column.
    const colCells = this.cells.map(c => c[col]);
    if (colCells.find(cell => cell.value === testValue) !== undefined) {
      return false;
    }

    return true;
  }

  /**
   * Get all the cells of this container family.
   * @param row 
   * @param col 
   */
  private getAllCellsInContainer(row: number, col: number): SodokuCell[] {
    const containerCoord = this.cells[row][col].containerCoord;
    const cellsInContainer = new Array<SodokuCell>();
    this.cells.forEach(cr => cr.forEach(c => {
      if (c.containerCoord.row === containerCoord.row && c.containerCoord.col === containerCoord.col) {
        cellsInContainer.push(c);
      }
    }));

    return cellsInContainer;
  }

  updateRecursionModel(searchDepth: number, currentTime: number) {
    this.recursionModel.recursionDepth = searchDepth;
    this.recursionModel.elapsedTime = currentTime - this.recursionModel.startTime;
    this.solveSubject.next(this.recursionModel);
  }

  private async sleep(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms));
  }
}
