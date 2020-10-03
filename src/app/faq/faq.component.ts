import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as lunr from 'lunr';

import { QuestionsService } from '../questions/questions.service';
import { nl, Question } from '../questions/questions';
import { RandomImageService } from '../common/random-image.service';
import { LanguageService } from '../common/language.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {
  @ViewChild('question', { static: false }) questionField: ElementRef;

  filter = '';
  tagFilter = null;

  questionPlaceholder = '';
  questionExamples: string[] = [];
  counter = 0;

  allQuestions: Question[] = nl;
  filteredQuestions: Question[] = [];
  groupedQuestions = [];
  allQuestionsIndex;

  isBrowser = false;
  timer;

  imgs: string[] = [];

  constructor(@Inject(PLATFORM_ID) platformId: string, private questionsService: QuestionsService,
    public randomImage: RandomImageService, public languageService: LanguageService) {
    languageService.lang.subscribe((lang) => {
      this.questionExamples = lang === 'nl' ? ['groen', 'kost', 'uitstoot', 'ecologisch']
        : lang === 'fr' ? ['ecolo', 'coute', 'emissions', 'ecologique']
        : ['groen', 'cost', 'emissions', 'ecologic'];

      this.clearFilter();
      this.allQuestions = lang === 'nl' ? nl : lang === 'fr' ? nl : nl;
    });

    this.questionPlaceholder = this.questionExamples[0];
    this.isBrowser = isPlatformBrowser(platformId);
    setTimeout(() => this.questionField.nativeElement.focus());
    this.imgs = randomImage.generateImages(50);

    this.groupedQuestions = this.allQuestions.reduce((all, curr) => {
      if (!all.find(t => t.topic === curr.tags[0])) all.push({ topic: curr.tags[0], questions: [] });
      const topic = all.find(t => t.topic === curr.tags[0]);
      topic.questions.push(curr);
      return all;
    }, []);

    const self = this;
    this.allQuestionsIndex = lunr(function () {
      this.ref('question');
      this.field('question');
      this.field('summary');
      this.field('answer');

      self.allQuestions.forEach(function (doc) {
        this.add(doc);
      }, this)
    })
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
      const filterWithWildCards = this.filter.split(' ').filter(x => x).map(part => part + '*').join(' ');

      this.filteredQuestions = this.allQuestionsIndex.search(filterWithWildCards)
        .map(result => this.allQuestions.find(q => q.question === result.ref));

      // this.filteredQuestions = this.allQuestions.filter(q => q.question.includes(this.filter) || q.summary.includes(this.filter)
      //   || (q.answer && q.answer.includes(this.filter)));
    } else if (this.filter.length === 0) {
      this.filteredQuestions = [];
    }
  }

  setTagFilter(tag) {
    this.tagFilter = tag;
    this.filteredQuestions = this.allQuestions.filter(q => q.tags && q.tags.includes(tag));
  }

  clearFilter() {
    this.filteredQuestions = [];
    this.tagFilter = null;
    this.filter = '';
  }
}
