import { Component, Input } from '@angular/core';
import { MP } from './mp';

@Component({
  selector: 'app-mp',
  templateUrl: './mp.component.html',
  styleUrls: ['./mp.component.scss']
})
export class MpComponent {
  @Input() mp: MP;

  selected: boolean;
}
