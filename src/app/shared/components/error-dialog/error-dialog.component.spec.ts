import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDialogComponent } from './error-dialog.component';
import {ErrorService} from '../../services/error/errors.service';

describe('ErrorDialogComponent', () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;
  let errorService: ErrorService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDialogComponent],
      providers: [ErrorService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    errorService = TestBed.inject(ErrorService);
  });

  afterEach(() => {
    errorService.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render the dialog when there is no error', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('dialog')).toBeNull();
  });

  it('should display the error dialog with message and title', () => {
    errorService.show('Une erreur', ['Détail A']);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const dialog = compiled.querySelector('dialog');

    expect(dialog).not.toBeNull();
    expect(compiled.textContent).toContain('Une erreur');
    expect(compiled.textContent).toContain('Détail A');
  });

  it('should display multiple detail lines if provided', () => {
    errorService.show('Erreur complexe', ['Erreur 1', 'Erreur 2']);
    fixture.detectChanges();

    const details = fixture.nativeElement.querySelectorAll('li');
    expect(details.length).toBe(2);
    expect(details[0].textContent).toContain('Erreur 1');
    expect(details[1].textContent).toContain('Erreur 2');
  });

  it('should clear the error when clicking close', () => {
    const spy = spyOn(errorService, 'clear');
    errorService.show('Erreur test');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should clear the error when clicking the backdrop', () => {
    const spy = spyOn(errorService, 'clear');
    errorService.show('Erreur test');
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.backdrop');
    backdrop.click();

    expect(spy).toHaveBeenCalled();
  });
});
