import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

const TYPES = [
  // Default mobile
  'mobile-only',
  'mobile-and-above',
  'mobile-and-below',

  // Sm mobile
  'mobile-sm-only',
  'mobile-sm-and-above',
  'mobile-sm-and-below',

  // Tablet
  'tablet-only',
  'tablet-and-above',
  'tablet-and-below',

  // Desktop
  'desktop-only',
  'desktop-and-above',
  'desktop-and-below',

  // Desktop wide
  'desktop-wide-only',
  'desktop-wide-and-above',
  'desktop-wide-and-below',
];

@Component({
  selector: 'ui-media',
  templateUrl: './ui-media.component.html',
  styleUrls: ['ui-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiMediaComponent {
  public types: string[] = TYPES;
}
