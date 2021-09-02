import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { ToggleSubject } from '@shared/rxjs/toggle-subject.rxjs';
import { Coordinate } from '@services/sprite.service';

const DEFAULT_SIZE = 120;

@Component({
  selector: 'ui-avatar',
  templateUrl: './ui-avatar.component.html',
  styleUrls: ['./ui-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAvatarComponent {
  @Input()
  public src = '';

  @Input()
  public size = DEFAULT_SIZE;

  @Input()
  public coordinates: Coordinate;

  public loading$ = new ToggleSubject(true);

  public get imageStyle(): Record<string, string> {
    return {
      'background-image': this.src ? `url(${this.src})` : 'none',
      'background-position': this.coordinates
        ? `-${this.coordinates.x}px -${this.coordinates.y}px`
        : 'center',
      'background-size': this.coordinates ? '': '100%',
      'background-repeat': 'no-repeat',
      width: this.coordinates ? `${this.coordinates.width}px` : `${this.width}px`,
      height: this.coordinates ? `${this.coordinates.height}px` : `${this.height}px`,
    };
  }

  @HostBinding('style.width.px')
  private get height(): number {
    return this.coordinates ? this.coordinates.height : this.size;
  }

  @HostBinding('style.height.px')
  private get width(): number {
    return this.coordinates ? this.coordinates.width : this.size;
  }

  public updateBackgroundImageUrl(): void {
    this.loading$.toggle(300);
  }

}
