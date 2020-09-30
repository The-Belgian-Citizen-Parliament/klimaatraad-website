import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output('tagClicked') tagClickedEmitter = new EventEmitter<string>()

  lang = environment.language;
  expanded = false;

  expand = () => this.expanded = !this.expanded;
  tagClicked = (tag) => this.tagClickedEmitter.emit(tag);
}
