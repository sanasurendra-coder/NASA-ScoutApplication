import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { OverviewComponent } from './overview.component';
import { ScoutStore } from '../../core/scoutState/scout.store';
import { ScoutCandidate } from '../../core/models/scout.model';

ModuleRegistry.registerModules([AllCommunityModule]);

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  let mockStore: {
    candidates: ReturnType<typeof signal<ScoutCandidate[]>>;
    selectedCandidate: ReturnType<typeof signal<ScoutCandidate | null>>;
    isLoading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    lastUpdated: ReturnType<typeof signal<Date | null>>;
    loadCandidates: ReturnType<typeof vi.fn>;
    setSelectedCandidate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockStore = {
      candidates: signal<ScoutCandidate[]>([]),
      selectedCandidate: signal<ScoutCandidate | null>(null),
      isLoading: signal<boolean>(false),
      error: signal<string | null>(null),
      lastUpdated: signal<Date | null>(new Date()),
      loadCandidates: vi.fn(),
      setSelectedCandidate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [OverviewComponent],
      providers: [
        { provide: ScoutStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and trigger initial candidate load', () => {
    expect(component).toBeTruthy();
    expect(mockStore.loadCandidates).toHaveBeenCalledTimes(1);
  });

  it('should trigger store reload on refresh click', () => {
    mockStore.loadCandidates.mockClear(); // Reset count after ngOnInit
    component.onRefresh();
    expect(mockStore.loadCandidates).toHaveBeenCalledTimes(1);
  });

  it('should clear selection when drawer is closed', () => {
    component.onCloseDrawer();
    expect(mockStore.setSelectedCandidate).toHaveBeenCalledWith(null);
  });
});
