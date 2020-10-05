import { Injectable } from '@angular/core';
import { shuffle } from '../util/functions';
import { questionsNl } from './questions.nl';

@Injectable()
export class QuestionsService {
    getRandomQuestions = (amt: number) => shuffle(questionsNl).slice(0, amt);
    getQuestionBySlug = (slug) => questionsNl.find(q => q.slug === slug);
}
