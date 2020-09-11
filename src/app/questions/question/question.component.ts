import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Question } from '../questions';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {
  @Input() question: Question;
  expanded = false;
  expand = () => this.expanded = !this.expanded;
}
