import {ErrorService} from './errors.service';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    service = new ErrorService();
  });

  it('should be created with no error', () => {
    expect(service.error()).toBeNull();
    expect(service.details()).toEqual([]);
  });

  it('should show an error with details', () => {
    service.show('Error!', ['Detail 1', 'Detail 2']);
    expect(service.error()).toBe('Error!');
    expect(service.details()).toEqual(['Detail 1', 'Detail 2']);
  });

  it('should show an error without details', () => {
    service.show('Erreur simple');
    expect(service.error()).toBe('Erreur simple');
    expect(service.details()).toEqual([]);
  });

  it('should clear the error', () => {
    service.show('Erreur à effacer', ['Détail']);
    service.clear();
    expect(service.error()).toBeNull();
    expect(service.details()).toEqual([]);
  });
});
