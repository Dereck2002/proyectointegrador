import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcPacientesPage } from './ac-pacientes.page';

describe('AcPacientesPage', () => {
  let component: AcPacientesPage;
  let fixture: ComponentFixture<AcPacientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AcPacientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
