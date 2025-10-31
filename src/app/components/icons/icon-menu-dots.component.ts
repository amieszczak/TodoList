import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-menu-dots',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="size" [attr.height]="height" fill="currentColor" viewBox="0 0 16 28">
      <circle cx="8" cy="4" r="2.5"/>
      <circle cx="8" cy="14" r="2.5"/>
      <circle cx="8" cy="24" r="2.5"/>
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
export class IconMenuDotsComponent {
  @Input() size: number = 16;
  @Input() height: number = 28;
}

