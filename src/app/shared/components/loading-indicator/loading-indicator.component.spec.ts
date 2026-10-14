import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingIndicatorComponent } from './loading-indicator.component';
import { DEFAULT_LOADING_MESSAGE } from '../../../core/constants/scout-constants';

describe('LoadingIndicatorComponent', () => {
  let component: LoadingIndicatorComponent;
  let fixture: ComponentFixture<LoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingIndicatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use default message when no input provided', () => {
    expect(component.message).toBe(DEFAULT_LOADING_MESSAGE);
  });
});
