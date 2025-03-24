import {TestBed} from '@angular/core/testing';

import {BooksService} from './books.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {Book} from '../../models/book.model';
import {ErrorService} from '../error/errors.service';

describe('BookService', () => {
  let service: BooksService;
  let httpMock: HttpTestingController;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;


  beforeEach(() => {
    errorServiceSpy = jasmine.createSpyObj('ErrorService', ['show']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [BooksService, provideHttpClient(), provideHttpClientTesting(), {
        provide: ErrorService,
        useValue: errorServiceSpy
      }],
    });

    service = TestBed.inject(BooksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load books and update the signal', () => {
    const mockBooks: Book[] = [
      { id: '1', title: 'A', author: 'B', isbn: '1234567890', borrowed: false }
    ];

    service.loadBooks().subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/books');
    expect(req.request.method).toBe('GET');
    req.flush(mockBooks);

    expect(service.loadedBooks()).toEqual(mockBooks);
  });

  it('should search books with given title and author', () => {
    const mockBooks: Book[] = [{ id: '1', title: 'A', author: 'B', isbn: '123', borrowed: false }];

    service.searchBooks('A', 'B').subscribe();

    const req = httpMock.expectOne(
      r => r.url === 'http://localhost:8080/api/books' &&
        r.params.get('title') === 'A' &&
        r.params.get('author') === 'B'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockBooks);

    expect(service.loadedBooks()).toEqual(mockBooks);
  });

  it('should add a new book to the list', () => {
    const bookToCreate = { title: 'New', author: 'Author', isbn: '1234567890', borrowed: false };
    const createdBook: Book = { ...bookToCreate, id: '42' };

    service.createBook(bookToCreate).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/books');
    expect(req.request.method).toBe('POST');
    req.flush(createdBook);

    expect(service.loadedBooks()).toContain(createdBook);
  });

  it('should update the book status in the signal', () => {
    const initial: Book = { id: '1', title: 'T', author: 'A', isbn: '1234567890', borrowed: false };
    service['books'].set([initial]); // inject directly for test

    service.updateBookStatus(initial).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/books/1');
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...initial, borrowed: true });

    expect(service.loadedBooks()[0].borrowed).toBeTrue();
  });

});
