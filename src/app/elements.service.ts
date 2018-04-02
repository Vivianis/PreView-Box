import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ElementsSet } from './elements';

@Injectable()
export class FileService {
    private fileUrl = 'http://localhost:4200/outputFile.json';
    constructor(private http: Http) { }

    getElements(): Promise<ElementsSet> {
        return this.http.get(this.fileUrl)
            .toPromise()
            .then(response => response.json() as ElementsSet)
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}