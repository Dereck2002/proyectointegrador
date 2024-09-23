import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMedicosPage } from './list-medicos.page';

describe('ListMedicosPage', () => {
  let component: ListMedicosPage;
  let fixture: ComponentFixture<ListMedicosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMedicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
