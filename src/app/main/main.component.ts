import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { QuestionsService } from '../questions/questions.service';
import { environment } from 'src/environments/environment';
import { RandomImageService } from '../common/random-image.service';
import { LanguageService } from '../common/language.service';
import { Question } from '../questions/question';
import { videos } from './videos';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChild('videoCarrousel') videoCarrousel: ElementRef;

  questions: Question[] = [];
  imgs: string[] = [];
  lang = environment.language;

  videos = videos;
  currentVideo;

  constructor(private questionsService: QuestionsService, public randomImage: RandomImageService,
    public languageService: LanguageService) {
    questionsService.getRandomQuestions(4).subscribe((q) => this.questions = q);
    this.imgs = randomImage.generateImages(4);

    languageService.lang.subscribe((lang) => this.lang = lang);

    this.currentVideo = this.videos[this.lang][this.videos[this.lang].length - 1];
  }

  ngAfterViewInit(): void {
    (this.videoPlayer.nativeElement as HTMLVideoElement).onended = () => {
      const nextVideoId = (this.currentVideo.nr + 1) % (this.videos[this.lang].length);
      this.playVid(this.videos[this.lang][nextVideoId]);
    }
  }

  playVid(vid) {
    this.currentVideo = vid;
    setTimeout(() => this.videoPlayer.nativeElement.play());
    this.videoCarrousel.nativeElement.scrollLeft = (vid.nr * this.getImageWidth()) - (this.getImageWidth() / 2);
  }

  getImageWidth = () => this.videoCarrousel.nativeElement.children[0].offsetWidth;
}
