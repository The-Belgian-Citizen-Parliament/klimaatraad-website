import { Injectable } from '@angular/core';
import { shuffle } from 'lodash'
import { questions } from './questions';

@Injectable()
export class QuestionsService {
    getRandomQuestions = (amt: number) => shuffle(questions).slice(0, amt);
}
