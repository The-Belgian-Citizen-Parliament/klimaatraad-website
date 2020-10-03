import { Injectable } from '@angular/core';

@Injectable()
export class RandomImageService {
  imgBaseUrl = '/assets/img/illustrations/button-';
  counter = 0;

  public nextImage = () => this.imgBaseUrl + (((this.counter++) % 6) + 1) + '.png';
  public generateImages = (amt) => Array.from(Array(10).keys()).map(() => this.nextImage());
}
