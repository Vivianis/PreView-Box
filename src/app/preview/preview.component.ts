import { Component, OnInit } from '@angular/core';
import { FileService } from '../elements.service';
import { Line, Pin, Arc, Symbol, ElementsSet } from '../elements';

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
      this.draw();
    });
  }

  draw() {
    this.container = document.getElementById('container');
    this.cw = 1500;
    this.ch = 1500;
    this.canvas = document.createElement('canvas');
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.canvas.width = this.cw;
    this.canvas.height = this.ch;
    this.container.appendChild(this.canvas);

    this.ctx.transform(1, 0, 0, -1, 0, 1200);
    this.ctx.scale(0.125, 0.125);
    this.ctx.lineWidth = 10;
    for (let i in this.elements.linesMsg.lines) {
      let line: Line = this.elements.linesMsg.lines[i];
      this.drawLine(line);
    }
    for (let i in this.elements.symbolsMsg.symbols) {
      let symbol: Symbol = this.elements.symbolsMsg.symbols[i];
      this.drawSymbol(symbol);
    }
  }

  drawLine(line: Line) {
    let startX = line.startX;
    let startY = line.startY;
    let endX = line.endX;
    let endY = line.endY;

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawPin(pin: Pin) {
    let oX, oY, radius, startX, startY, endX, endY, nameX, nameY: number;
    let name: string;
    if (pin.outsideEdge == "Dot") {
      radius = 25;
      name = pin.nameMsg.name;
    }
    else if (pin.outsideEdge == "") {
      radius = 0;
      name = "";
    }
    if (pin.rotation == 0) {
      oX = pin.footSite.siteX + radius;
      oY = pin.footSite.siteY;
      startX = oX + radius;
      startY = oY;
      endX = startX + pin.length;
      endY = startY;
      nameX = pin.nameMsg.nameX - 100;
      nameY = pin.nameMsg.nameY;
    }
    else if (pin.rotation == 90) {
      oX = pin.footSite.siteX;
      oY = pin.footSite.siteY + radius;
      startX = oX;
      startY = oY + radius;
      endX = startX;
      endY = startY + pin.length;
      nameX = pin.nameMsg.nameX;
      nameY = pin.nameMsg.nameY - 100;
    }
    else if (pin.rotation == 180) {
      oX = (pin.footSite.siteX - radius);
      oY = pin.footSite.siteY;
      startX = oX - radius;
      startY = oY;
      endX = startX - pin.length;
      endY = startY;
      nameX = pin.nameMsg.nameX + 100;
      nameY = pin.nameMsg.nameY;
    }
    else {
      oX = pin.footSite.siteX;
      oY = pin.footSite.siteY - radius;
      startX = oX;
      startY = oY - radius;
      endX = startX;
      endY = startY - pin.length;
      nameX = pin.nameMsg.nameX;
      nameY = pin.nameMsg.nameY + 100;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.arc(oX, oY, radius, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.save();
    this.ctx.transform(1, 0, 0, -1, 0, nameY * 2);
    this.ctx.font = "70px Bangla Sangam MN";
    this.ctx.fillText(name, nameX, nameY);
    this.ctx.restore();
  }

  drawArc(arc: Arc) {
    let oX = arc.oX;
    let oY = arc.oY;
    let radius = arc.radius;
    let width = arc.width;
    let startAngle = arc.startAngle * Math.PI / 180;
    let endAngle: number;
    if (arc.sweepAngle == 0) {
      endAngle = 360 * Math.PI / 180;
    }
    else {
      endAngle = startAngle + arc.sweepAngle * Math.PI / 180;
    }
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.arc(oX, oY, radius, startAngle, endAngle);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawSymbol(symbol: Symbol) {
    let siteX: number;
    let siteY: number;
    siteX = symbol.site.siteX;
    siteY = symbol.site.siteY;

    this.ctx.save();
    this.ctx.translate(siteX, siteY);
    this.ctx.rotate(symbol.rotation * Math.PI / 180);

    for (let i in symbol.lines) {
      this.drawLine(symbol.lines[i]);
    }
    for (let i in symbol.pins) {
      this.drawPin(symbol.pins[i]);
    }
    for (let i in symbol.arcs) {
      this.drawArc(symbol.arcs[i]);
    }
    let name = symbol.nameMsg.name;
    let nameX = symbol.nameMsg.nameX;
    let nameY = symbol.nameMsg.nameY;
    this.ctx.save()
    this.ctx.transform(1, 0, 0, -1, 0, nameY * 2);
    this.ctx.font = "70px Bangla Sangam MN";
    this.ctx.fillText(symbol.nameMsg.name, symbol.nameMsg.nameX, symbol.nameMsg.nameY);
    this.ctx.fillText(symbol.refDesMsg.refDes, symbol.refDesMsg.refDesX, symbol.refDesMsg.refDesY);
    this.ctx.restore();
    this.ctx.restore();
  }

  ngOnInit() {
    this.getElements();
  }

}
