import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconPlusComponent } from '../icons/icon-plus.component';

@Component({
  selector: 'app-page-header-bar',
  imports: [FormsModule, IconPlusComponent],
  templateUrl: './page-header-bar.component.html',
  styleUrl: './page-header-bar.component.scss',
  standalone: true
})
export class PageHeaderBarComponent {
  @Input() pageTitle: string = 'Lista zadań';
  @Output() addTask = new EventEmitter<void>();

  protected isEditingTitle = false;
  protected tempTitle = '';

  protected startEditingTitle() {
    this.isEditingTitle = true;
    this.tempTitle = this.pageTitle;
    setTimeout(() => {
      const input = document.querySelector('.title-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);
  }

  protected saveTitleEdit() {
    if (this.tempTitle.trim()) {
      this.pageTitle = this.tempTitle.trim();
    }
    this.isEditingTitle = false;
  }

  protected cancelTitleEdit() {
    this.isEditingTitle = false;
    this.tempTitle = '';
  }

  protected onTitleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveTitleEdit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelTitleEdit();
    }
  }

  protected onTitleBlur() {
    this.saveTitleEdit();
  }

  onAddTask() {
    this.addTask.emit();
  }
}

