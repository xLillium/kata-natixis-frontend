import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ErrorService {
  private errorMessage = signal<string | null>(null);
  error = this.errorMessage.asReadonly();
  private errorDetails = signal<string[]>([]);
  details = this.errorDetails.asReadonly();

  show(message: string, details: string[] = []) {
    console.log('show : ', message, ' , details : ', details);
    this.errorMessage.set(message);
    this.errorDetails.set(details);
  }

  clear() {
    this.errorMessage.set(null);
    this.errorDetails.set([]);
  }
}
