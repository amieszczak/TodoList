import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../services/task-storage.service';
import { IconBoldComponent } from '../icons/icon-bold.component';
import { IconItalicComponent } from '../icons/icon-italic.component';
import { IconUnderlineComponent } from '../icons/icon-underline.component';
import { IconListComponent } from '../icons/icon-list.component';
import { IconClearFormatComponent } from '../icons/icon-clear-format.component';
import { IconCloseComponent } from '../icons/icon-close.component';

@Component({
  selector: 'app-task-modal',
  imports: [FormsModule, IconBoldComponent, IconItalicComponent, IconUnderlineComponent, IconListComponent, IconClearFormatComponent, IconCloseComponent],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
  standalone: true
})
export class TaskModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() task: Omit<Task, 'id'> | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<Task, 'id'>>();

  protected newTask: Omit<Task, 'id'> = {
    name: '',
    status: 'Planned' as const,
    date: '',
    description: '',
    tags: []
  };
  protected tagInput: string = '';
  protected showValidationErrors = false;
  protected initialDate: string = '';
  protected activeFormats = {
    bold: false,
    italic: false,
    underline: false,
    list: false
  };

  ngOnChanges(changes: SimpleChanges) {
    if (!(changes['isOpen'] && this.isOpen)) return;

    if (this.isEditMode && this.task) {
      this.newTask = {
        name: this.task.name,
        status: this.task.status,
        date: this.task.date,
        description: this.task.description,
        tags: this.task.tags ? [...this.task.tags] : []
      };
      setTimeout(() => {
        const editableDiv = document.querySelector('.modal [contenteditable]') as HTMLElement;
        if (editableDiv) {
          editableDiv.innerHTML = this.task?.description || '';
        }
        this.resetActiveFormats();
      }, 0);
    } else {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      this.newTask = {
        name: '',
        status: 'Planned' as const,
        date: formattedDate,
        description: '',
        tags: []
      };
      this.initialDate = formattedDate;
      this.resetActiveFormats();
    }
    this.showValidationErrors = false;
    this.tagInput = '';
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    this.showValidationErrors = true;
    
    const editableDiv = document.querySelector('.modal [contenteditable]') as HTMLElement;
    if (editableDiv) {
      this.newTask.description = editableDiv.innerHTML;
    }
    
    if (this.newTask.name && this.newTask.date && !this.isPastDate()) {
      this.save.emit({ ...this.newTask });
    }
  }

  isPastDate(): boolean {
    if (!this.newTask.date) return false;
    const selectedDate = new Date(this.newTask.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  }

  get isSaveButtonDisabled(): boolean {
    if (this.isEditMode) {
      return false;
    }
    
    const isNameEmpty = !this.newTask.name || this.newTask.name.trim() === '';
    const isDescriptionEmpty = !this.newTask.description || this.newTask.description.trim() === '';
    const isDateUnchanged = this.newTask.date === this.initialDate;
    
    return isNameEmpty && isDescriptionEmpty && isDateUnchanged;
  }

  addTag(event?: KeyboardEvent) {
    if (event && event.key !== 'Enter') {
      return;
    }
    
    if (event) {
      event.preventDefault();
    }
    
    const tag = this.tagInput.trim();
    if (tag && !this.newTask.tags?.includes(tag)) {
      if (!this.newTask.tags) {
        this.newTask.tags = [];
      }
      this.newTask.tags.push(tag);
      this.tagInput = '';
    }
  }

  removeTag(index: number) {
    if (this.newTask.tags) {
      this.newTask.tags.splice(index, 1);
    }
  }

  onDescriptionInput(event: Event) {
    const target = event.target as HTMLElement;
    this.newTask.description = target.innerHTML;
  }

  updateActiveFormats() {
    this.activeFormats.bold = document.queryCommandState('bold');
    this.activeFormats.italic = document.queryCommandState('italic');
    this.activeFormats.underline = document.queryCommandState('underline');
    this.activeFormats.list = document.queryCommandState('insertUnorderedList');
  }

  onSelectionChange() {
    setTimeout(() => {
      this.updateActiveFormats();
    }, 0);
  }

  formatText(format: string) {
    const editableDiv = document.querySelector('.modal [contenteditable]') as HTMLElement;
    if (!editableDiv) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const commandName = format === 'list' ? 'insertUnorderedList' : format;
    
    document.execCommand(commandName, false);
    
    this.newTask.description = editableDiv.innerHTML;
    editableDiv.focus();
    
    setTimeout(() => {
      this.updateActiveFormats();
    }, 0);
  }

  clearFormatting() {
    const editableDiv = document.querySelector('.modal [contenteditable]') as HTMLElement;
    if (!editableDiv) return;

    const textContent = editableDiv.innerText;
    editableDiv.textContent = textContent;
    this.newTask.description = textContent;
    
    this.resetActiveFormats();
  }

  resetActiveFormats() {
    this.activeFormats = {
      bold: false,
      italic: false,
      underline: false,
      list: false
    };
  }
}

