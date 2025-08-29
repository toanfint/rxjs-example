import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLazyLoad2Component } from './search-lazy-load2.component';

describe('SearchLazyLoad2Component', () => {
  let component: SearchLazyLoad2Component;
  let fixture: ComponentFixture<SearchLazyLoad2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchLazyLoad2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchLazyLoad2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
