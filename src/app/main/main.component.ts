import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { QuestionsService } from '../questions/questions.service';
import { environment } from 'src/environments/environment';
import { RandomImageService } from '../common/random-image.service';
import { LanguageService } from '../common/language.service';
import { Question } from '../questions/question';

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

  currentVideo;

  videos = [
    { nr: 0,
      srcNl: 'https://vincentsels.be/ext/belgiancitizenparliament/video/youna_nl.mp4',
      srcFr: 'https://vincentsels.be/ext/belgiancitizenparliament/video/youna_fr.mp4',
      poster: '/assets/vidposters/youna.jpg',
      preview: '/assets/vidposters/youna_square.jpg'
    },
    {
      nr: 1,
      srcNl: 'https://vincentsels.be/ext/belgiancitizenparliament/video/sebastien_nl.mp4',
      srcFl: 'https://vincentsels.be/ext/belgiancitizenparliament/video/sebastien_fr.mp4',
      poster: '/assets/vidposters/sebastien.jpg',
      preview: '/assets/vidposters/sebastien_square.jpg'
    },
    {
      nr: 2,
      srcNl: 'https://vincentsels.be/ext/belgiancitizenparliament/video/esmeralda_nl.mp4',
      srcFr: 'https://vincentsels.be/ext/belgiancitizenparliament/video/esmeralda_fr.mp4',
      poster: '/assets/vidposters/esmeralda.jpg',
      preview: '/assets/vidposters/esmeralda_square.jpg'
    },
    {
      nr: 3,
      srcNl: 'https://vincentsels.be/ext/belgiancitizenparliament/video/david_nl.mp4',
      srcFr: 'https://vincentsels.be/ext/belgiancitizenparliament/video/david_fr.mp4',
      poster: '/assets/vidposters/david.jpg',
      preview: '/assets/vidposters/david_square.jpg'
    },
  ];

  constructor(private questionsService: QuestionsService, public randomImage: RandomImageService,
    public languageService: LanguageService) {
    questionsService.getRandomQuestions(4).subscribe((q) => this.questions = q);
    this.imgs = randomImage.generateImages(4);

    languageService.lang.subscribe((lang) => this.lang = lang);

    this.currentVideo = this.videos[this.videos.length -1];
  }

  ngAfterViewInit(): void {
    (this.videoPlayer.nativeElement as HTMLVideoElement).onended = () => {
      const nextVideoId = (this.currentVideo.nr + 1) % (this.videos.length);
      this.playVid(this.videos[nextVideoId]);
    }
  }

  playVid(vid) {
    this.currentVideo = vid;
    setTimeout(() => this.videoPlayer.nativeElement.play());
    this.videoCarrousel.nativeElement.scrollLeft = (vid.nr * this.getImageWidth()) - (this.getImageWidth() / 2);
  }

  getImageWidth = () => this.videoCarrousel.nativeElement.children[0].offsetWidth;
}
