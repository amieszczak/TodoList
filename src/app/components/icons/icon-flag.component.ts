import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-flag',
  standalone: true,
  template: `
    @if (filled) {
      <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="size" [attr.height]="size" fill="currentColor" viewBox="0 0 16 16">
        <path d="M2.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/>
        <path d="M3 2.5a.5.5 0 0 1 .5-.5h9.586a.5.5 0 0 1 .353.854l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 1-.353.854H3.5a.5.5 0 0 1-.5-.5v-8z"/>
      </svg>
    } @else {
      <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="size" [attr.height]="size" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16">
        <path d="M2.5 1v13.5"/>
        <path d="M2.5 2.5h9.5l-3 3.5 3 3.5h-9.5v-7z"/>
      </svg>
    }
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class IconFlagComponent {
  @Input() size: number = 16;
  @Input() filled: boolean = false;
}

