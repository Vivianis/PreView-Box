import { Component, OnInit } from '@angular/core';
import { FileService } from '../elements.service';
import { ElementsSet } from '../elements';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  elements: ElementsSet;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  container: any;
  cw: any;
  ch: any;
  constructor(private fileService: FileService) { }

  getElements() {
    this.fileService.getElements().then(elements => {
      this.elements = elements;
      console.log(this.elements);
    });
  };
  draw(elements: ElementsSet) {
    this.container = document.getElementById('container');
    this.cw = 1500;
    this.ch = 1000;
    this.canvas = document.createElement('canvas');
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.canvas.width = this.cw;
    this.canvas.height = this.ch;
    this.container.appendChild(this.canvas);

    let i, j: number;
    let element: any;
    let startX, startY, endX, endY: number;
    for (i in elements.lines) {
      element = elements.lines[i];
      startX = Number(element.startX) / 10;
      startY = Number(element.startY) / 10;
      endX = Number(element.endX) / 10;
      endY = Number(element.endY) / 10;
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    }
  }

  ngOnInit() {
    this.getElements();
    this.draw(this.elements);
  }

}
