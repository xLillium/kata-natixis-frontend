import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookSearchComponent} from './book-search.component';
import {BooksService} from '../../../shared/services/books/books.service';
import {FormsModule} from '@angular/forms';
import {of} from 'rxjs';

describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let booksServiceSpy: jasmine.SpyObj<BooksService>;


  beforeEach(async () => {
    booksServiceSpy = jasmine.createSpyObj('BooksService', ['searchBooks', 'loadBooks']);

    await TestBed.configureTestingModule({
      imports: [BookSearchComponent, FormsModule],
      providers: [{provide: BooksService, useValue: booksServiceSpy}]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize title and author as empty', () => {
    expect(component.title).toBe('');
    expect(component.author).toBe('');
  });

  it('should emit isSearching and call searchBooks on submit', () => {
    const spy = spyOn(component.isSearching, 'emit');
    component.title = '1984';
    component.author = 'Terry';
    booksServiceSpy.searchBooks.and.returnValue(of([]));

    component.onSearch();

    expect(spy).toHaveBeenCalledWith(true);
    expect(booksServiceSpy.searchBooks).toHaveBeenCalledWith('1984', 'Terry');
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should reset fields and call loadBooks on reset', () => {
    const spy = spyOn(component.isSearching, 'emit');
    component.title = '1984';
    component.author = 'Terry';
    booksServiceSpy.loadBooks.and.returnValue(of([]));

    component.onReset();

    expect(component.title).toBe('');
    expect(component.author).toBe('');
    expect(booksServiceSpy.loadBooks).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(true);
    expect(spy).toHaveBeenCalledWith(false);
  });
});
