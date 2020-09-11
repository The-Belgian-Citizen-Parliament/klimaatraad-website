import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {
  @ViewChild('question', { static: false }) questionField: ElementRef;

  filter = '';

  questionPlaceholder = '';
  questions = ['klimaat', 'burger', 'politici', 'legitiem'];
  counter = 0;

  isBrowser = false;
  timer;

  constructor(@Inject(PLATFORM_ID) platformId: string) {
    this.questionPlaceholder = this.questions[0];
    this.isBrowser = isPlatformBrowser(platformId);
    setTimeout(() => this.questionField.nativeElement.focus());
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.timer = setInterval(() => this.questionPlaceholder = this.questions[(++this.counter) % this.questions.length], 3000);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
