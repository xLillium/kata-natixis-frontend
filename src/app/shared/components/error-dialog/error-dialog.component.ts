import {Component, computed, inject, input, output} from '@angular/core';
import {ErrorService} from '../../services/error/errors.service';

@Component({
  selector: 'app-error-dialog',
  imports: [],
  templateUrl: './error-dialog.component.html',
  standalone: true,
  styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {
  private errorService = inject(ErrorService);

  readonly message = this.errorService.error;
  readonly details = this.errorService.details;
  readonly visible = computed(() => this.message() !== null);

  close() {
    this.errorService.clear();
  }
}
