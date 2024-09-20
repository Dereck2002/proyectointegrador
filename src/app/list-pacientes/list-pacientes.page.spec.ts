import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPacientesPage } from './list-pacientes.page';

describe('ListPacientesPage', () => {
  let component: ListPacientesPage;
  let fixture: ComponentFixture<ListPacientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPacientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
