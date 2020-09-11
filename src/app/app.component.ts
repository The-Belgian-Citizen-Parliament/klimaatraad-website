import { Component } from '@angular/core';
import { Router, RouterEvent, Event, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public smallHeader = false;

  constructor(public router: Router) {
    router.events.pipe(
      filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)
   ).subscribe((e: NavigationEnd) => {
    this.smallHeader = e.url !== "/";
   });
  }
}
