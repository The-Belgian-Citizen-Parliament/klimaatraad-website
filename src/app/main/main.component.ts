import { Component, ElementRef, ViewChild } from '@angular/core';
import { QuestionsService } from '../questions/questions.service';
import { Question } from '../questions/questions';

const VID_WIDTH = 320; // Should reflect the width of a vid

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChild('videoCarrousel') videoCarrousel: ElementRef;

  iFrameLoaded = false;

  questions: Question[] = [];

  videos = [
    { nr: 0, src: 'https://vincentsels.be/ext/belgiancitizenparliament/video/nn1.mp4', poster: '/assets/vidposters/nn1.jpg' },
    { nr: 1, src: 'https://vincentsels.be/ext/belgiancitizenparliament/video/nn2.mp4', poster: '/assets/vidposters/nn2.jpg' },
    { nr: 2, src: 'https://vincentsels.be/ext/belgiancitizenparliament/video/nn3.mp4', poster: '/assets/vidposters/nn3.jpg' },
    { nr: 3, src: 'https://vincentsels.be/ext/belgiancitizenparliament/video/nn4.mp4', poster: '/assets/vidposters/nn4.jpg' },
    { nr: 4, src: 'https://vincentsels.be/ext/belgiancitizenparliament/video/maaike.mp4', poster: '/assets/vidposters/maaike.jpg' },
  ];

  currentVideo;

  constructor(private questionsService: QuestionsService) {
    this.questions = questionsService.getRandomQuestions(3);
    this.currentVideo = this.videos[4];
  }

  moreQuestions = () => this.questions = this.questionsService.getRandomQuestions(3);

  playVid(vid) {
    this.currentVideo = vid;
    setTimeout(() => this.videoPlayer.nativeElement.play());
    this.videoCarrousel.nativeElement.scrollLeft = (vid.nr * VID_WIDTH) - VID_WIDTH;
  }

  scrollLeft() {
    this.videoCarrousel.nativeElement.scrollLeft -= VID_WIDTH
  }

  scrollRight() {
    this.videoCarrousel.nativeElement.scrollLeft += VID_WIDTH;
  }
}
