import { Component, OnInit, inject, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskStorageService, Task } from './services/task-storage.service';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { FilterPanelComponent, FilterOptions } from './components/filter-panel/filter-panel.component';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { SearchFilterBarComponent } from './components/search-filter-bar/search-filter-bar.component';
import { PageHeaderBarComponent } from './components/page-header-bar/page-header-bar.component';

@Component({
  selector: 'app-root',
  imports: [NgClass, FormsModule, TaskItemComponent, FilterPanelComponent, TaskModalComponent, SearchFilterBarComponent, PageHeaderBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit {
  private taskStorage = inject(TaskStorageService);
  
  title = 'junior-frontend-developer-task';

  protected tasks: Task[] = [];
  protected isModalOpen = false;
  protected isEditMode = false;
  protected editingTaskIndex: number | null = null;
  protected editingTask: Omit<Task, 'id'> | null = null;
  protected openDropdownIndex: number | null = null;
  protected closingDropdownIndex: number | null = null;
  protected filters: FilterOptions = {
    name: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  };
  protected isFilterPanelOpen = false;
  protected defaultDateFrom = '';
  protected defaultDateTo = '';
  protected sortByDate: '' | 'asc' | 'desc' = '';
  protected pageTitle = 'Lista zadań';

  async ngOnInit() {
    this.initializeDefaultDateRange();
    await this.loadTasks();
  }

  private initializeDefaultDateRange() {
    const today = new Date();
    
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    this.defaultDateFrom = weekAgo.toISOString().split('T')[0];
    
    const weekLater = new Date(today);
    weekLater.setDate(today.getDate() + 7);
    this.defaultDateTo = weekLater.toISOString().split('T')[0];
    
    this.filters.dateFrom = this.defaultDateFrom;
    this.filters.dateTo = this.defaultDateTo;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.dropdown-container');
    
    if (!dropdown && this.openDropdownIndex !== null) {
      this.closeDropdown();
    }
  }

  private async loadTasks() {
    try {
      this.tasks = await this.taskStorage.getAllTasks();
      
      if (this.tasks.length === 0) {
        const defaultTasks = [
          { name: 'Zrobić zakupy spożywcze', status: 'Completed' as const, date: '2025-05-01', description: 'Muszę kupić mleko, mąkę i jajka.' },
          { name: 'Opłacić rachunki', status: 'Planned' as const, date: '2025-05-10', description: 'Tylko nie odkładaj tego na inny dzień!' },
          { name: 'Urodziny mamy', status: 'Planned' as const, date: '2025-05-15', description: 'Kupić kwiaty i tort.' }
        ];
        
        for (const task of defaultTasks) {
          await this.taskStorage.addTask(task);
        }
        
        this.tasks = await this.taskStorage.getAllTasks();
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }

  async toggleCompleted(task: Task) {
    const wasCompleted = task.status === 'Completed';
    task.status = wasCompleted ? 'Planned' : 'Completed';
    
    if (task.status === 'Completed') {
      task.completedAt = Date.now();
    } else {
      task.completedAt = undefined;
    }
    
    try {
      await this.taskStorage.updateTask(task);
      await this.loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async toggleFlag(task: Task, event: MouseEvent) {
    event.stopPropagation();
    task.flagged = !task.flagged;
    
    try {
      await this.taskStorage.updateTask(task);
    } catch (error) {
      console.error('Error updating task flag:', error);
    }
  }

  openModal() {
    this.isEditMode = false;
    this.editingTaskIndex = null;
    this.editingTask = null;
    this.isModalOpen = true;
  }

  toggleDropdown(index: number, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    
    if (this.openDropdownIndex === index) {
      this.closeDropdown();
    } else {
      if (this.openDropdownIndex !== null) {
        this.closeDropdown();
      }
      this.openDropdownIndex = index;
      this.closingDropdownIndex = null;
    }
  }

  private closeDropdown() {
    if (this.openDropdownIndex !== null) {
      this.closingDropdownIndex = this.openDropdownIndex;
      setTimeout(() => {
        this.openDropdownIndex = null;
        this.closingDropdownIndex = null;
      }, 200);
    }
  }

  openEditModal(index: number) {
    const task = this.filteredTasks[index];
    if (task) {
      this.isEditMode = true;
      this.editingTaskIndex = index;
      this.editingTask = {
        name: task.name,
        status: task.status,
        date: task.date,
        description: task.description,
        tags: task.tags ? [...task.tags] : []
      };
      this.isModalOpen = true;
      this.openDropdownIndex = null;
      this.closingDropdownIndex = null;
    }
  }

  async deleteTask(index: number) {
    const task = this.filteredTasks[index];
    if (task && task.id) {
      try {
        await this.taskStorage.deleteTask(task.id);
        await this.loadTasks();
        this.openDropdownIndex = null;
        this.closingDropdownIndex = null;
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.editingTaskIndex = null;
    this.editingTask = null;
  }

  async saveTask(taskData: Omit<Task, 'id'>) {
      try {
        if (this.isEditMode && this.editingTaskIndex !== null) {
          const task = this.filteredTasks[this.editingTaskIndex];
          if (task) {
          task.name = taskData.name;
          task.status = taskData.status;
          task.date = taskData.date;
          task.description = taskData.description;
          task.tags = taskData.tags;
            await this.taskStorage.updateTask(task);
          }
        } else {
        await this.taskStorage.addTask({ ...taskData });
        }
        await this.loadTasks();
        this.closeModal();
      } catch (error) {
        console.error('Error saving task:', error);
      }
  }

  isCompleted = (task: Task) => task.status === 'Completed';

  get filteredTasks() {
    let filtered = this.tasks.filter(task => {
      const matchesName = !this.filters.name || 
        task.name.toLowerCase().includes(this.filters.name.toLowerCase());
      
      let matchesDateRange = true;
      if (this.filters.dateFrom && this.filters.dateTo) {
        const taskDate = new Date(task.date);
        const fromDate = new Date(this.filters.dateFrom);
        const toDate = new Date(this.filters.dateTo);
        matchesDateRange = taskDate >= fromDate && taskDate <= toDate;
      }
      
      const matchesStatus = !this.filters.status || 
        task.status === this.filters.status;
      
      return matchesName && matchesDateRange && matchesStatus;
    });

    filtered = [...filtered].sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'Planned' ? -1 : 1;
      }
      
      if (a.status === 'Completed' && b.status === 'Completed') {
        const aTime = a.completedAt || 0;
        const bTime = b.completedAt || 0;
        return bTime - aTime;
      }
      
      if (this.sortByDate && a.status === 'Planned') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        
        if (this.sortByDate === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      }
      
      return 0;
    });

    return filtered;
  }

  clearFilters() {
    this.filters = {
      name: '',
      dateFrom: this.defaultDateFrom,
      dateTo: this.defaultDateTo,
      status: ''
    };
    this.sortByDate = '';
  }

  get hasActiveFilters(): boolean {
    const hasDateRangeChanged = this.filters.dateFrom !== this.defaultDateFrom || 
                                 this.filters.dateTo !== this.defaultDateTo;
    return !!(this.filters.name || hasDateRangeChanged || this.filters.status || this.sortByDate);
  }

  toggleFilterPanel() {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }

  onSearchChange(searchTerm: string) {
    this.filters.name = searchTerm;
  }

  onFiltersChange(filters: FilterOptions) {
    this.filters = filters;
  }

  onSortByDateChange(sortByDate: '' | 'asc' | 'desc') {
    this.sortByDate = sortByDate;
  }
}
