import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Question } from '../questions';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {
  @Input() question: Question;
  @Input() answerOnly: boolean;

  lang = environment.language;
  expanded = false;

  expand = () => this.expanded = !this.expanded;
}
