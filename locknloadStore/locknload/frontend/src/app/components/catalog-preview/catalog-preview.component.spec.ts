import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CatalogPreviewComponent } from './catalog-preview.component';
import { of } from 'rxjs';
import { Weapon } from '../../models/weapon.model';
import { WeaponService } from '../../services/weaponService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CatalogPreviewComponent', () => {
  let component: CatalogPreviewComponent;
  let fixture: ComponentFixture<CatalogPreviewComponent>;
  let weaponService: WeaponService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CatalogPreviewComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule],
      providers: [WeaponService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogPreviewComponent);
    component = fixture.componentInstance;
    weaponService = TestBed.inject(WeaponService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display the first 3 weapons', fakeAsync(() => {
    const mockWeapons = [
      { name: 'Weapon 1', price: 12, description: '', image: '' },
      { name: 'Weapon 2', price: 13, description: '', image: '' },
      { name: 'Weapon 3', price: 14, description: '', image: '' },
      { name: 'Weapon 4', price: 15, description: '', image: '' }
    ] as Weapon[];

    jest.spyOn(weaponService, 'getWeapons').mockReturnValue(of(mockWeapons));

    fixture.detectChanges();
    tick(); // Simulate the passage of time until all pending asynchronous activities finish

    expect(component.weapons).toEqual(mockWeapons.slice(0, 3));
  }));
});
