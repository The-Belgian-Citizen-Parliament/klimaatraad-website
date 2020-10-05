import { Injectable } from '@angular/core';
import { shuffle } from '../util/functions';
import { questionsNl } from './questions.nl';
import { questionsFr } from './questions.fr';
import { LanguageService } from '../common/language.service';
import { map } from 'rxjs/operators';

@Injectable()
export class QuestionsService {
  constructor(private languageService: LanguageService) {}

  getRandomQuestions(amt: number) {
    return this.languageService.lang.pipe(map((lang) =>
      shuffle(lang === 'nl' ? questionsNl : lang === 'fr' ? questionsFr : questionsFr).slice(0, amt)));
  }

  getQuestionBySlug(slug) {
    const lang = this.languageService.lang.value;
    const questions = lang === 'nl' ? questionsNl : lang === 'fr' ? questionsFr : questionsFr;
    return questions.find(q => q.slug === slug);
  }
}
