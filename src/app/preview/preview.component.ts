import { Component, OnInit } from '@angular/core';
import { FileService } from '../elements.service';
import { Line, Pin, NHeader, ElementsSet } from '../elements';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

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
      this.draw(this.elements);
    });
  }

  draw(elements: ElementsSet) {
    this.container = document.getElementById('container');
    this.cw = 1000;
    this.ch = 1000;
    this.canvas = document.createElement('canvas');
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.canvas.width = this.cw;
    this.canvas.height = this.ch;
    this.container.appendChild(this.canvas);

    this.ctx.transform(1, 0, 0, -1, 0, 1200);
    this.drawLines();
    this.drawNHeaders();
  }

  drawLines() {
    let element: any;
    for (let i in this.elements.lines) {
      element = this.elements.lines[i];
      let startX = element.startX / 8;
      let startY = element.startY / 8;
      let endX = element.endX / 8;
      let endY = element.endY / 8;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    }
  }

  drawNHeaders() {
    for (let i in this.elements.nHeaders) {
      let nHeader: NHeader;
      let headerX, headerY: number;
      nHeader = this.elements.nHeaders[i];
      headerX = nHeader.headerX / 8;
      headerY = nHeader.headerY / 8;
      this.ctx.save();
      this.ctx.translate(headerX, headerY);
      this.ctx.rotate(nHeader.headerRotation * Math.PI / 180);
      this.ctx.beginPath();
      for (let j in nHeader.lines) {
        let startX = nHeader.lines[j].startX / 8;
        let startY = nHeader.lines[j].startY / 8;
        let endX = nHeader.lines[j].endX / 8;
        let endY = nHeader.lines[j].endY / 8;
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
      }
      this.ctx.restore();
      for (let j in nHeader.pins) {
        let pin = nHeader.pins[j];
        let oX, oY, startX, startY, endX, endY, pinNumX, pinNumY: number;
        if (pin.rotation == 0) {
          oX = (pin.footX + pin.outsideRadius) / 8;
          oY = pin.footY / 8;
          startX = oX + pin.outsideRadius / 8;
          startY = oY;
          endX = startX + pin.length / 8;
          endY = startY;
          pinNumX = pin.pinNum.pinNumX / 8 - 15;
          pinNumY = pin.pinNum.pinNumY / 8;
        }
        else if (pin.rotation == 90) {
          oX = pin.footX / 8;
          oY = (pin.footY + pin.outsideRadius) / 8;
          startX = oX;
          startY = oY + pin.outsideRadius / 8;
          endX = startX;
          endY = startY + pin.length / 8;
          pinNumX = pin.pinNum.pinNumX / 8;
          pinNumY = pin.pinNum.pinNumY / 8 - 15;
        }
        else if (pin.rotation == 180) {
          oX = (pin.footX - pin.outsideRadius) / 8;
          oY = pin.footY / 8;
          startX = oX - pin.outsideRadius / 8;
          startY = oY;
          endX = startX - pin.length / 8;
          endY = startY;
          pinNumX = pin.pinNum.pinNumX / 8 + 15;
          pinNumY = pin.pinNum.pinNumY / 8;
        }
        else {
          oX = pin.footX / 8;
          oY = (pin.footY - pin.outsideRadius) / 8;
          startX = oX;
          startY = oY - pin.outsideRadius / 8;
          endX = startX;
          endY = startY - pin.length / 8;
          pinNumX = pin.pinNum.pinNumX / 8;
          pinNumY = pin.pinNum.pinNumY / 8 + 15;
        }
        this.ctx.save();
        this.ctx.translate(headerX, headerY);
        this.ctx.rotate(nHeader.headerRotation * Math.PI / 180);
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(oX, oY, pin.outsideRadius / 8, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.transform(1, 0, 0, -1, 0, pinNumY * 2);
        this.ctx.fillText(pin.pinNum.pinNum, pinNumX, pinNumY);
        this.ctx.restore();
      }

      this.ctx.save();
      this.ctx.translate(headerX, headerY);
      this.ctx.rotate(nHeader.headerRotation * Math.PI / 180);
      this.ctx.transform(1, 0, 0, -1, 0, nHeader.name.nameY / 8 * 2);
      this.ctx.fillText(nHeader.name.name, nHeader.name.nameX / 8, nHeader.name.nameY / 8);
      this.ctx.restore();

      this.ctx.save();
      this.ctx.translate(headerX, headerY);
      this.ctx.rotate(nHeader.headerRotation * Math.PI / 180);
      this.ctx.transform(1, 0, 0, -1, 0, nHeader.refDes.refDesY / 8 * 2);
      this.ctx.fillText("JP?", nHeader.refDes.refDesX / 8, nHeader.refDes.refDesY / 8);
      this.ctx.restore();
    }
  }

  ngOnInit() {
    this.getElements();
  }

}
