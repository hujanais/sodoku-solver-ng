import { Component } from '@angular/core';
import { SodokuSolverService } from './services/sodoku-solver.service';
import { SodokuCell } from './models/sodoku-cell';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sodoku-ts';
  cells: SodokuCell[][];
  
  constructor(private service: SodokuSolverService) { 
    this.cells = this.service.cells;
  }

  /**
   * Solve the game.
   */
  async solve() {
    console.log('Start solve');
    const response = await this.service.Solve();
    console.log(`End solve ${response}`);
  }

  /**
   * Clear the board.
   */
  clear() {
    this.service.Clear();
  }

  /**
   * Generate a new game.
   */
  reset() {
    this.service.Reset();
  }
}
