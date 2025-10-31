import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { Task } from '../../services/task-storage.service';
import { IconFlagComponent } from '../icons/icon-flag.component';
import { IconMenuDotsComponent } from '../icons/icon-menu-dots.component';
import { IconEditComponent } from '../icons/icon-edit.component';
import { IconDeleteComponent } from '../icons/icon-delete.component';

@Component({
  selector: 'app-task-item',
  imports: [NgClass, IconFlagComponent, IconMenuDotsComponent, IconEditComponent, IconDeleteComponent],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
  standalone: true
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() index!: number;
  @Input() openDropdownIndex: number | null = null;
  @Input() closingDropdownIndex: number | null = null;

  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() toggleFlagEvent = new EventEmitter<{ task: Task; event: MouseEvent }>();
  @Output() dropdownToggle = new EventEmitter<{ index: number; event?: MouseEvent }>();
  @Output() editTask = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();

  onToggleComplete() {
    this.toggleComplete.emit(this.task);
  }

  onToggleFlag(event: MouseEvent) {
    this.toggleFlagEvent.emit({ task: this.task, event });
  }

  onToggleDropdown(event?: MouseEvent) {
    this.dropdownToggle.emit({ index: this.index, event });
  }

  onEditTask() {
    this.editTask.emit(this.index);
  }

  onDeleteTask() {
    this.deleteTask.emit(this.index);
  }

  get isCompleted(): boolean {
    return this.task.status === 'Completed';
  }

  get isDropdownOpen(): boolean {
    return this.openDropdownIndex === this.index;
  }

  get isDropdownClosing(): boolean {
    return this.closingDropdownIndex === this.index;
  }
}

