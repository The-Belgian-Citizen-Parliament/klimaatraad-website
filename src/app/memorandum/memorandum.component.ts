import { Component  } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LanguageService } from '../common/language.service';

@Component({
  selector: 'app-memorandum',
  templateUrl: './memorandum.component.html',
  styleUrls: ['./memorandum.component.scss']
})
export class MemorandumComponent {
  constructor(public languageService: LanguageService) {}
}
