import { Injectable } from '@angular/core';
import { questions } from './questions';
import { shuffle } from '../util/functions';

@Injectable()
export class QuestionsService {
    getRandomQuestions = (amt: number) => shuffle(questions).slice(0, amt);
}
