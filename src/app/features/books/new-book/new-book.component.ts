import {Component, output, signal} from '@angular/core';
import {BookCreate} from '../../../shared/models/book.model';
import {FormControl, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {isbnValidator} from '../../../shared/validators/isbn.validator';

@Component({
  selector: 'app-new-book',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './new-book.component.html',
  standalone: true,
  styleUrl: './new-book.component.scss'
})
export class NewBookComponent {
  cancel = output<void>();
  add = output<BookCreate>();
  title = signal('');
  author = signal('');
  borrowed = signal(false);

  isbnControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, isbnValidator()]
  });

  onCancel() {
    this.cancel.emit()
  }

  onSubmit(form: NgForm) {
    if (form.invalid || this.isbnControl.invalid) {
      form.control.markAllAsTouched();
      this.isbnControl.markAsTouched();
      return;
    }

    this.add.emit({title: this.title(), author: this.author(), isbn: this.isbnControl.value, borrowed: this.borrowed()});
  }
}
