import { Injectable } from '@angular/core';
import { nl } from './questions';
import { shuffle } from '../util/functions';

@Injectable()
export class QuestionsService {
    getRandomQuestions = (amt: number) => shuffle(nl).slice(0, amt);
    getQuestionBySlug = (slug) => nl.find(q => q.slug === slug);
}
