import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Question } from 'src/app/questions/questions';
import { QuestionsService } from 'src/app/questions/questions.service';
import { SeoService } from 'src/app/seo.service';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent {
  question: Question;
  randomQuestions: Question[];

  constructor(router: Router, questionService: QuestionsService, seoService: SeoService,
    translate: TranslateService, activeRoute: ActivatedRoute) {
    activeRoute.params.subscribe(routeParams => {
      const slug = /[^/]*$/.exec(router.url)[0];
      if (!slug) router.navigate(['/faq']);
      this.question = questionService.getQuestionBySlug(slug);
      if (!this.question) router.navigate(['/faq']);
      this.randomQuestions = questionService.getRandomQuestions(6);

      translate.get('title').subscribe(((title) => {
        seoService.updateTitle(this.stripHtml(this.question.question) + ' - ' + title);
        seoService.updateDescription(this.stripHtml(this.question.summary));
      }));
    });
  }

  // Source: https://stackoverflow.com/questions/822452/strip-html-from-text-javascript/822486#822486
  stripHtml(html) {
    return html.replace(/<[^>]*>?/gm, '');
  }
}
