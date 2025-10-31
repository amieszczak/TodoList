import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconCloseComponent } from '../icons/icon-close.component';

export interface FilterOptions {
  name: string;
  dateFrom: string;
  dateTo: string;
  status: string;
}

@Component({
  selector: 'app-filter-panel',
  imports: [NgClass, FormsModule, IconCloseComponent],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss',
  standalone: true
})
export class FilterPanelComponent {
  @Input() filters!: FilterOptions;
  @Input() sortByDate: '' | 'asc' | 'desc' = '';
  @Input() hasActiveFilters: boolean = false;
  @Input() defaultDateFrom: string = '';
  @Input() defaultDateTo: string = '';
  
  @Output() closePanel = new EventEmitter<void>();
  @Output() filtersChange = new EventEmitter<FilterOptions>();
  @Output() sortByDateChange = new EventEmitter<'' | 'asc' | 'desc'>();
  @Output() clearFiltersClick = new EventEmitter<void>();

  protected mobileSelectOpen: string | null = null;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const customSelect = target.closest('.custom-select-wrapper');
    
    if (!customSelect && this.mobileSelectOpen) {
      this.closeMobileSelect();
    }
  }

  onClosePanel() {
    this.closePanel.emit();
  }

  onFiltersChange() {
    this.filtersChange.emit(this.filters);
  }

  onClearFilters() {
    this.clearFiltersClick.emit();
  }

  toggleMobileSelect(selectId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.mobileSelectOpen = this.mobileSelectOpen === selectId ? null : selectId;
  }

  closeMobileSelect() {
    this.mobileSelectOpen = null;
  }

  selectMobileOption(selectId: string, value: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    if (selectId === 'sortByDate') {
      this.sortByDate = value as '' | 'asc' | 'desc';
      this.sortByDateChange.emit(this.sortByDate);
    } else if (selectId === 'filterStatus') {
      this.filters.status = value;
      this.filtersChange.emit(this.filters);
    }
    
    this.closeMobileSelect();
  }

  getMobileSelectLabel(selectId: string): string {
    const labelConfigs: Record<string, (value: string) => string> = {
      sortByDate: (value: string) => ({
        asc: 'Rosnąco (od najwcześniejszego)',
        desc: 'Malejąco (od najpóźniejszego)',
      }[value] ?? 'Brak sortowania'),
      filterStatus: (value: string) => ({
        Planned: 'Planned',
        Completed: 'Completed',
      }[value] ?? 'Wszystkie'),
    };

    switch (selectId) {
      case 'sortByDate':
        return labelConfigs['sortByDate'](this.sortByDate);
      case 'filterStatus':
        return labelConfigs['filterStatus'](this.filters.status);
      default:
        return '';
    }
  }
}

