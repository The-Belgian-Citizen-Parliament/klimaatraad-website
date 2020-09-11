import { Component } from '@angular/core';
import { QuestionsService } from '../questions/questions.service';
import { Question } from '../questions/questions';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  iFrameLoaded = false;

  questions: Question[] = [];

  constructor(private questionsService: QuestionsService) {
    this.questions = questionsService.getRandomQuestions(3);
  }

  moreQuestions = () => this.questions = this.questionsService.getRandomQuestions(3);
}
