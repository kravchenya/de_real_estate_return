import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FederalStateSelectionService {
  private selectedFederalStateSubject = new BehaviorSubject<string>('');
  selectedFederalState$ = this.selectedFederalStateSubject.asObservable();

  updateSelectedFederalState(newValue: string) {
    this.selectedFederalStateSubject.next(newValue);
  }
}
