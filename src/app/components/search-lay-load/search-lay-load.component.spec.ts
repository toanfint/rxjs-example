import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLayLoadComponent } from './search-lay-load.component';

describe('SearchLayLoadComponent', () => {
  let component: SearchLayLoadComponent;
  let fixture: ComponentFixture<SearchLayLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchLayLoadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchLayLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
