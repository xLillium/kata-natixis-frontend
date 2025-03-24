import {Component} from '@angular/core';
import {BooksListComponent} from './features/books/books-list/books-list.component';
import {ErrorDialogComponent} from './shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-root',
  imports: [BooksListComponent, ErrorDialogComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {}
