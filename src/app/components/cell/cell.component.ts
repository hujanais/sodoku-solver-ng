import { Component, OnInit, Input } from '@angular/core';
import { SodokuCell } from 'src/app/models/sodoku-cell';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  // the cell object.
  @Input() cell: SodokuCell;

  // Flag to indicate whether this is an odd or even container.  Used for styling only.
  isOddContainer: boolean;

  constructor() { }

  ngOnInit() {
    this.isOddContainer = ((this.cell.containerCoord.row + this.cell.containerCoord.col) % 2) === 0;
  }

}
