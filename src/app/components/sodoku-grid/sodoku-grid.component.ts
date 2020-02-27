import { Component, OnInit, OnDestroy } from '@angular/core';
import { SodokuSolverService } from 'src/app/services/sodoku-solver.service';
import { SodokuCell } from 'src/app/models/sodoku-cell';
import { Subscription } from 'rxjs';
import { RecursionModel } from 'src/app/models/recursion-model';

@Component({
  selector: 'app-sodoku-grid',
  templateUrl: './sodoku-grid.component.html',
  styleUrls: ['./sodoku-grid.component.css']
})
export class SodokuGridComponent implements OnInit, OnDestroy {
  // cell objects that is bound to the UI.
  cells: SodokuCell[][];
  searchModel: RecursionModel;
  
  private subscription: Subscription;

  constructor(private service: SodokuSolverService) {
    this.subscription = this.service.getObservable().subscribe((data: RecursionModel) => {
      this.searchModel = data;
     });
  }

  ngOnInit() {
    this.cells = this.service.cells;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
