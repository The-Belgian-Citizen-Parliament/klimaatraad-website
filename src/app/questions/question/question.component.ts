import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from 'src/app/common/language.service';
import { RandomImageService } from 'src/app/common/random-image.service';
import { environment } from 'src/environments/environment';
import { Question } from '../question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements AfterViewInit {
  @Input() question: Question;
  @Input() answerOnly: boolean;
  @Input() image: string;

  @Output('tagClicked') tagClickedEmitter = new EventEmitter<string>()

  lang = environment.language;
  expanded = false;

  constructor(private randomImage: RandomImageService, public languageService: LanguageService) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.image = this.image || this.randomImage.nextImage());
  }

  expand = () => this.expanded = !this.expanded;
  tagClicked = (tag) => this.tagClickedEmitter.emit(tag);
}
