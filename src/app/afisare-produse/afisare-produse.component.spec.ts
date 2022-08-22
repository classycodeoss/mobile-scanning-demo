import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfisareProduseComponent } from './afisare-produse.component';

describe('AfisareProduseComponent', () => {
  let component: AfisareProduseComponent;
  let fixture: ComponentFixture<AfisareProduseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfisareProduseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AfisareProduseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
