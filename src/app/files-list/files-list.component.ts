import { Component, OnInit } from '@angular/core';
import { FILES } from './files';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})
export class FilesListComponent implements OnInit {
  selectedFile: string;
  files = FILES;

  onSelect(file: string) {
    this.selectedFile = file;
  }
  constructor() { }

  ngOnInit() {
  }

}
