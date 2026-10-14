import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  ValueFormatterParams,
  CellClassParams,
  themeAlpine
} from 'ag-grid-community';
import { OverviewStore } from './state/overview.store';
import { ScoutCandidate } from '../../core/models/scout.model';


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, DatePipe],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  readonly store = inject(OverviewStore);
  readonly theme = themeAlpine;

  quickFilterText = '';
  private gridApi!: GridApi;

  readonly rowHeight = 48;
  readonly headerHeight = 44;

  readonly paginationPageSize = 10;
  readonly paginationPageSizeSelector = [10, 20, 50];

  readonly columnDefs: ColDef<ScoutCandidate>[] = [
    {
      field: 'objectName',
      headerName: 'Designation',
      filter: 'agTextColumnFilter',
      width: 140
    },
    {
      field: 'nObs',
      headerName: 'Observations',
      filter: 'agNumberColumnFilter',
      width: 140
    },
    {
      field: 'arc',
      headerName: 'Data Arc (Days)',
      width: 140
    },
    {
      field: 'h',
      headerName: 'Abs Mag (H)',
      filter: 'agNumberColumnFilter',
      width: 130
    },
    {
      field: 'caDist',
      headerName: 'Close Approach (LD)',
      valueFormatter: (params: ValueFormatterParams<ScoutCandidate>) =>
        params.value ? `${Number(params.value).toFixed(2)} LD` : 'N/A',
      width: 170
    },
    {
      field: 'vinf',
      headerName: 'V-Infinity (km/s)',
      valueFormatter: (params: ValueFormatterParams<ScoutCandidate>) =>
        params.value ? `${Number(params.value).toFixed(2)} km/s` : 'N/A',
      width: 160
    },
    {
      field: 'hazardAssessment',
      headerName: 'Risk Level',
      filter: 'agTextColumnFilter',
      cellClass: (params: CellClassParams<ScoutCandidate>) => {
        if (params.value === 'Elevated Alert') return 'risk-elevated';
        if (params.value === 'Monitored') return 'risk-monitored';
        return 'risk-low';
      },
      width: 150
    }
  ];

  readonly defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    flex: 1
  };

  ngOnInit(): void {
    this.store.loadCandidates();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  onQuickFilterChange(): void {
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', this.quickFilterText);
    }
  }

  onRowClicked(event: RowClickedEvent<ScoutCandidate>): void {
    if (event.data) {
      this.store.setSelectedCandidate(event.data);
    }
  }

  onRefresh(): void {
    this.store.loadCandidates();
  }

  onCloseDrawer(): void {
    this.store.setSelectedCandidate(null);
  }
}
