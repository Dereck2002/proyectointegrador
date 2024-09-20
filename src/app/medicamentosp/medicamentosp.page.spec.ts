import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicamentospPage } from './medicamentosp.page';

describe('MedicamentospPage', () => {
  let component: MedicamentospPage;
  let fixture: ComponentFixture<MedicamentospPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicamentospPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
