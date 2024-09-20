import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMedicamentoPage } from './add-medicamento.page';

describe('AddMedicamentoPage', () => {
  let component: AddMedicamentoPage;
  let fixture: ComponentFixture<AddMedicamentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMedicamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
