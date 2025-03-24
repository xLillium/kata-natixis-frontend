import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBookComponent } from './new-book.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('NewBookComponent', () => {
  let component: NewBookComponent;
  let fixture: ComponentFixture<NewBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBookComponent, FormsModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cancel when clicking the cancel button', () => {
    spyOn(component.cancel, 'emit');
    const cancelBtn = fixture.nativeElement.querySelector('button[type="button"]');
    cancelBtn.click();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should not emit add if form is invalid', () => {
    spyOn(component.add, 'emit');
    component.isbnControl.setValue(''); // invalid
    fixture.nativeElement.querySelector('button[type="submit"]').click();
    expect(component.add.emit).not.toHaveBeenCalled();
  });

  it('should emit add with form data when valid', () => {
    spyOn(component.add, 'emit');

    const compiled = fixture.nativeElement as HTMLElement;

    (compiled.querySelector('#title') as HTMLInputElement).value = 'My Book';
    (compiled.querySelector('#author') as HTMLInputElement).value = 'Author';
    (compiled.querySelector('#isbn') as HTMLInputElement).value = '1234567890';

    (compiled.querySelector('#title') as HTMLInputElement).dispatchEvent(new Event('input'));
    (compiled.querySelector('#author') as HTMLInputElement).dispatchEvent(new Event('input'));
    (compiled.querySelector('#isbn') as HTMLInputElement).dispatchEvent(new Event('input'));

    fixture.detectChanges();

    (compiled.querySelector('button[type="submit"]') as HTMLButtonElement).click();

    expect(component.add.emit).toHaveBeenCalledWith({
      title: 'My Book',
      author: 'Author',
      isbn: '1234567890',
      borrowed: false
    });
  });

  it('should display ISBN error if touched and invalid', () => {
    component.isbnControl.markAsTouched();
    component.isbnControl.setValue('abc');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.error');
    expect(error?.textContent).toContain('L’ISBN doit contenir');
  });
});
