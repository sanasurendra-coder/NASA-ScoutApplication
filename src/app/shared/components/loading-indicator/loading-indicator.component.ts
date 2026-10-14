import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ILoadingOverlayAngularComp } from 'ag-grid-angular';
import { ILoadingOverlayParams } from 'ag-grid-community';
import { DEFAULT_LOADING_MESSAGE } from '../../../core/constants/scout-constants';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.css']
})
export class LoadingIndicatorComponent implements ILoadingOverlayAngularComp {
  @Input() message: string = DEFAULT_LOADING_MESSAGE;
  @Input() cancellable: boolean = false;
  @Output() cancelled = new EventEmitter<void>();

  agInit(_params: ILoadingOverlayParams): void {}

  onCancel(): void {
    this.cancelled.emit();
  }
}
