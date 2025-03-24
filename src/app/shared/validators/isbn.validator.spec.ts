import { FormControl } from '@angular/forms';
import { isbnValidator } from './isbn.validator';

describe('isbnValidator', () => {
  const validator = isbnValidator();

  it('should validate 10-digit ISBN', () => {
    const control = new FormControl('1234567890');
    expect(validator(control)).toBeNull();
  });

  it('should validate 13-digit ISBN', () => {
    const control = new FormControl('1234567890123');
    expect(validator(control)).toBeNull();
  });

  it('should invalidate ISBN with non-numeric characters', () => {
    const control = new FormControl('1234abc890');
    expect(validator(control)).toEqual({ invalidIsbn: true });
  });

  it('should invalidate ISBN of incorrect length', () => {
    const control = new FormControl('12345678');
    expect(validator(control)).toEqual({ invalidIsbn: true });
  });

  it('should invalidate ISBN longer than 13 digits', () => {
    const control = new FormControl('12345678901234');
    expect(validator(control)).toEqual({ invalidIsbn: true });
  });
});
