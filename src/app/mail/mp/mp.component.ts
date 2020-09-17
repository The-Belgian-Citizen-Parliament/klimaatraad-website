import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MP } from './mp';

@Component({
  selector: 'app-mp',
  templateUrl: './mp.component.html',
  styleUrls: ['./mp.component.scss']
})
export class MpComponent {
  @Input() mp: MP;

  @Output('mpSelected') mpSelectedEmitter = new EventEmitter<MP>();
  @Output('mpDeselected') mpDeselectedEmitter = new EventEmitter<MP>();

  changeSelection() {
    this.mp.selected = !this.mp.selected;
    this.mp.selected ? this.mpSelectedEmitter.emit(this.mp)
      : this.mpDeselectedEmitter.emit(this.mp);
  }
}
