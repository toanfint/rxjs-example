import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLazyLoad3Component } from './search-lazy-load3.component';

describe('SearchLazyLoad3Component', () => {
  let component: SearchLazyLoad3Component;
  let fixture: ComponentFixture<SearchLazyLoad3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchLazyLoad3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchLazyLoad3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
