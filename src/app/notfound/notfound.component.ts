import { Component  } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotFoundComponent {
  lang = environment.language;
}
