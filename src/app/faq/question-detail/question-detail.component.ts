import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Question } from 'src/app/questions/questions';
import { QuestionsService } from 'src/app/questions/questions.service';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent {
  question: Question;
  randomQuestions: Question[];

  constructor(router: Router, questionService: QuestionsService) {
    const slug = /[^/]*$/.exec(router.url)[0];
    if (!slug) router.navigate(['/faq']);
    this.question = questionService.getQuestionBySlug(slug);
    if (!this.question) router.navigate(['/faq']);
    this.randomQuestions = questionService.getRandomQuestions(3);
  }
}
