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

  videos = [
    { nr: 1, src: 'https://vincentsels.be/ext/belgiancitizenparliament/video/maaike.mp4', poster: '/assets/vidposters/maaike.jpg' },
    { nr: 2, src: 'https://vincentsels.be/ext/belgiancitizenparliament/video/nn1.mp4', poster: '/assets/vidposters/nn1.jpg' },
    { nr: 3, src: 'https://vincentsels.be/ext/belgiancitizenparliament/video/nn2.mp4', poster: '/assets/vidposters/nn2.jpg' },
    { nr: 4, src: 'https://vincentsels.be/ext/belgiancitizenparliament/video/nn3.mp4', poster: '/assets/vidposters/nn3.jpg' },
    { nr: 5, src: 'https://vincentsels.be/ext/belgiancitizenparliament/video/nn4.mp4', poster: '/assets/vidposters/nn4.jpg' },
  ];

  currentVideo;

  constructor(private questionsService: QuestionsService) {
    this.questions = questionsService.getRandomQuestions(3);
    this.currentVideo = this.videos[0];
  }

  moreQuestions = () => this.questions = this.questionsService.getRandomQuestions(3);
}
