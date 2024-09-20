import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarMedicoPage } from './registrar-medico.page';

describe('RegistrarMedicoPage', () => {
  let component: RegistrarMedicoPage;
  let fixture: ComponentFixture<RegistrarMedicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
