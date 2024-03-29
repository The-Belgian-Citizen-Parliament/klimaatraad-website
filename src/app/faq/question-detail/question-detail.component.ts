import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/common/language.service';
import { Question } from 'src/app/questions/question';

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
    translate: TranslateService, activeRoute: ActivatedRoute, public languageService: LanguageService) {
    activeRoute.params.subscribe(routeParams => {
      try {
        const slug = activeRoute.snapshot.url.slice(-1)[0].path;
        if (!slug) router.navigate(['/faq']);
        this.question = questionService.getQuestionBySlug(slug);
        if (!this.question) router.navigate(['/faq']);
        questionService.getRandomQuestions(6).subscribe((q) => this.randomQuestions = q);

        translate.get('title').subscribe(((title) => {
          seoService.updateTitle(this.stripHtml(this.question.question) + ' - ' + title);
          seoService.updateDescription(this.stripHtml(this.question.summary));
        }));
      } catch {
        router.navigate(['/faq']);
      }
    });
  }

  // Source: https://stackoverflow.com/questions/822452/strip-html-from-text-javascript/822486#822486
  stripHtml(html) {
    return html.replace(/<[^>]*>?/gm, '');
  }
}
