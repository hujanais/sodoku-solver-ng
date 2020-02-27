import { TestBed } from '@angular/core/testing';

import { SodokuSolverService } from './sodoku-solver.service';

describe('SodokuSolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SodokuSolverService = TestBed.get(SodokuSolverService);
    expect(service).toBeTruthy();
  });
});
