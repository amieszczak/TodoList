import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-clear-format',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="size" [attr.height]="size" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8.5 7.5V9h3a.5.5 0 0 1 0 1h-3v1.5a.5.5 0 0 1-1 0V10h-3a.5.5 0 0 1 0-1h3V7.5a.5.5 0 0 1 1 0z"/>
      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class IconClearFormatComponent {
  @Input() size: number = 14;
}

