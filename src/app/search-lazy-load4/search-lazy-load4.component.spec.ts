import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLazyLoad4Component } from './search-lazy-load4.component';

describe('SearchLazyLoad4Component', () => {
  let component: SearchLazyLoad4Component;
  let fixture: ComponentFixture<SearchLazyLoad4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchLazyLoad4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchLazyLoad4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
