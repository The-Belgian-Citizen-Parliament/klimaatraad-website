import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuestionsService } from '../questions/questions.service';
import { nl, Question } from '../questions/questions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {
  @ViewChild('question', { static: false }) questionField: ElementRef;

  lang = environment.language;

  filter = '';

  questionPlaceholder = '';
  questionExamples = ['klimaat', 'burger', 'politici', 'legitiem'];
  counter = 0;

  allQuestions: Question[] = nl;
  filteredQuestions: Question[] = [];
  groupedQuestions = [];

  isBrowser = false;
  timer;

  constructor(@Inject(PLATFORM_ID) platformId: string, private questionsService: QuestionsService) {
    this.questionPlaceholder = this.questionExamples[0];
    this.isBrowser = isPlatformBrowser(platformId);
    setTimeout(() => this.questionField.nativeElement.focus());

    this.groupedQuestions = this.allQuestions.reduce((all, curr) => {
      if (!all.find(t => t.topic === curr.tags[0])) all.push({ topic: curr.tags[0], questions: [] });
      const topic = all.find(t => t.topic === curr.tags[0]);
      topic.questions.push(curr);
      return all;
    }, []);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.timer = setInterval(() => this.questionPlaceholder = this.questionExamples[(++this.counter) % this.questionExamples.length], 3000);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  filterQuestions() {
    if (this.filter.length > 2) {
      this.filteredQuestions = this.allQuestions.filter(q => q.question.includes(this.filter) || q.summary.includes(this.filter)
        || (q.answer && q.answer.includes(this.filter)));
    } else if (this.filter.length === 0) {
      this.filteredQuestions = [];
    }
  }

  clearFilter = () => this.filter = '';
}
