import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TRANSFER_KEY } from '@modules/transfer-between-apps/transfer-between-apps.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-key-generation-success',
  templateUrl: './key-generation-success.component.html',
  styleUrls: ['./key-generation-success.component.scss', '../key-generation/key-generation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyGenerationSuccessComponent {
  @Input()
  public transferData: string[] = [];

  public transferDataIndexes: Record<string, number> = {
    method: 0,
    action: 1,
    payload: 2,
  };

  public transferKey: string = TRANSFER_KEY;

  public buttonDisabledSubject$ = new BehaviorSubject<boolean>(false);
}
