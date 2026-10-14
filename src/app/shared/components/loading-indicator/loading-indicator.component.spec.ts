import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoadingIndicatorComponent } from './loading-indicator.component';
import { DEFAULT_LOADING_MESSAGE } from './constants/loading-indicator.constants';

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

  it('should create the loading indicator', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default constant message when none provided', () => {
    expect(component.message()).toBe(DEFAULT_LOADING_MESSAGE);
  });

  it('should emit cancelled event on cancel button click', () => {
    const emitSpy = vi.spyOn(component.cancelled, 'emit');
    component.onCancel();
    expect(emitSpy).toHaveBeenCalled();
  });
});
