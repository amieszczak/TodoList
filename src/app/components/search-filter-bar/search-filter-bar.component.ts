import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IconCloseComponent } from '../icons/icon-close.component';
import { IconFilterComponent } from '../icons/icon-filter.component';

@Component({
  selector: 'app-search-filter-bar',
  imports: [FormsModule, IconCloseComponent, IconFilterComponent],
  templateUrl: './search-filter-bar.component.html',
  styleUrl: './search-filter-bar.component.scss',
  standalone: true
})
export class SearchFilterBarComponent implements OnDestroy {
  @Input() isFilterPanelOpen: boolean = false;
  
  @Output() searchChange = new EventEmitter<string>();
  @Output() toggleFilter = new EventEmitter<void>();

  protected searchInput: string = '';
  private searchTermSubject = new Subject<string>();

  constructor() {
    this.setupSearchDebounce();
  }

  ngOnDestroy() {
    this.searchTermSubject.complete();
  }

  private setupSearchDebounce() {
    this.searchTermSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.searchChange.emit(searchTerm);
      });
  }

  onSearchInput() {
    this.searchTermSubject.next(this.searchInput);
  }

  clearSearchField() {
    this.searchInput = '';
    this.searchChange.emit('');
  }

  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.searchInput) {
      this.clearSearchField();
      event.preventDefault();
    }
  }

  onSearchFocus(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      input.select();
    }
  }

  onToggleFilter() {
    this.toggleFilter.emit();
  }
}

