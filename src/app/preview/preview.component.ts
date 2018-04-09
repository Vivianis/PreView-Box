import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FileService } from '../elements.service';
import { Line, Pin, Arc, Text, Symbol, ElementsSet } from './elements';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnChanges {
  @Input() file: string = '';
  elements: ElementsSet;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  container: any;
  cw: any;
  ch: any;
  constructor(private fileService: FileService) { }

  getElements() {
    this.fileService.getElements(this.file).then(elements => {
      this.elements = elements;
      this.draw();
    });
  }

  ngOnInit() {
    this.container = document.getElementById('container');
    this.cw = 1600;
    this.ch = 1000;
    this.canvas = document.createElement('canvas');
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.canvas.width = this.cw;
    this.canvas.height = this.ch;
    this.container.appendChild(this.canvas);

    this.ctx.transform(1, 0, 0, -1, 0, 900);
    this.ctx.scale(0.1, 0.1);
    this.ctx.lineWidth = 12;
    this.ctx.strokeStyle = "rgb(15,32,220)";
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['file'].previousValue != changes['file'].currentValue) {
      this.getElements();
    }
  }

  draw() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

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
  }

  drawText(text: Text) {
    this.ctx.save();
    this.ctx.transform(1, 0, 0, -1, 0, text.site.siteY * 2);
    this.ctx.font = "80px Bangla Sangam MN";
    this.ctx.fillText(text.content, text.site.siteX, text.site.siteY);
    this.ctx.restore();
  }

  drawPin(pin: Pin) {
    let oX, oY, radius, startX, startY, endX, endY, desX, desY, nameX, nameY: number;
    let des = pin.desMsg.des;
    let name = pin.nameMsg.name;
    if (pin.outsideEdge == "Dot") {
      radius = 25;
    }
    else if (pin.outsideEdge == "") {
      radius = 0;
    }
    if (pin.rotation == 0) {
      oX = pin.footSite.siteX + radius;
      oY = pin.footSite.siteY;
      startX = oX + radius;
      startY = oY;
      endX = startX + pin.length;
      endY = startY;
      desX = endX + 100;
      desY = endY;
      nameX = oX - 100;
      nameY = oY;
    }
    else if (pin.rotation == 90) {
      oX = pin.footSite.siteX;
      oY = pin.footSite.siteY + radius;
      startX = oX;
      startY = oY + radius;
      endX = startX;
      endY = startY + pin.length;
      desX = endX;
      desY = endY + 100;
      nameX = oX;
      nameY = oY - 100;
    }
    else if (pin.rotation == 180) {
      oX = (pin.footSite.siteX - radius);
      oY = pin.footSite.siteY;
      startX = oX - radius;
      startY = oY;
      endX = startX - pin.length;
      endY = startY;
      desX = endX - 100;
      desY = endY;
      nameX = oX + 100;
      nameY = oY;
    }
    else {
      oX = pin.footSite.siteX;
      oY = pin.footSite.siteY - radius;
      startX = oX;
      startY = oY - radius;
      endX = startX;
      endY = startY - pin.length;
      desX = endX;
      desY = endY - 100;
      nameX = oX;
      nameY = oY + 100;
    }
    this.ctx.save();
    this.ctx.strokeStyle = "black";
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.arc(oX, oY, radius, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();

    if (pin.desMsg.desDisplay) {
      this.ctx.save();
      this.ctx.transform(1, 0, 0, -1, 0, desY * 2);
      this.ctx.font = "80px Bangla Sangam MN";
      this.ctx.fillText(des, desX, desY);
      this.ctx.restore();
    }
    if (pin.nameMsg.nameDisplay) {
      this.ctx.save();
      this.ctx.transform(1, 0, 0, -1, 0, nameY * 2);
      this.ctx.font = "80px Bangla Sangam MN";
      this.ctx.fillText(name, nameX, nameY);
      this.ctx.restore();
    }

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

    if (symbol.nameMsg.name.search(/HEADER|CON\d|CON |DPY|PIN|BRIDGE2|EDGE|PC|VOLTREG/) != -1) {
      //暴力解决非直连路径填充问题QAQ
      this.ctx.save();
      this.ctx.lineWidth = 30;
      this.ctx.fillStyle = "rgb(255,254,181)";
      this.ctx.strokeStyle = "rgb(223,35,23)";
      this.ctx.beginPath();
      this.ctx.moveTo(symbol.lines[0].startX, symbol.lines[0].startY);
      this.ctx.lineTo(symbol.lines[0].endX, symbol.lines[0].endY);
      this.ctx.lineTo(symbol.lines[2].endX, symbol.lines[2].endY);
      this.ctx.lineTo(symbol.lines[3].endX, symbol.lines[3].endY);
      this.ctx.lineTo(symbol.lines[0].startX, symbol.lines[0].startY);
      this.ctx.stroke();
      this.ctx.fill();
      this.ctx.restore();

      this.ctx.save();
      this.ctx.strokeStyle = "black";
      for (let i in symbol.lines) {
        if (Number(i) > 3) {
          this.drawLine(symbol.lines[i]);
        }
      }
      this.ctx.restore();
    }
    else {
      for (let i in symbol.lines) {
        this.drawLine(symbol.lines[i]);
      }
    }
    for (let i in symbol.pins) {
      this.drawPin(symbol.pins[i]);
    }
    for (let i in symbol.arcs) {
      this.drawArc(symbol.arcs[i]);
    }
    for (let i in symbol.texts) {
      this.drawText(symbol.texts[i]);
    }
    let name = symbol.nameMsg.name;
    let nameX = symbol.nameMsg.nameX;
    let nameY = symbol.nameMsg.nameY;
    this.ctx.save()
    this.ctx.transform(1, 0, 0, -1, 0, nameY * 2);
    this.ctx.font = "80px Bangla Sangam MN";
    this.ctx.fillText(symbol.nameMsg.name, symbol.nameMsg.nameX, symbol.nameMsg.nameY);
    this.ctx.fillText(symbol.refDesMsg.refDes, symbol.refDesMsg.refDesX, symbol.refDesMsg.refDesY);
    this.ctx.restore();
    this.ctx.restore();
  }

}
