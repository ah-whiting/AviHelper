import { Injectable } from '@angular/core';
import {NwacCsvService} from './nwac-csv.service';

@Injectable({
  providedIn: 'root'
})
export class DataSelectionService {

  allData: object
  activeData:object
  selectedIssue:object
  constructor(
    private _nwac:NwacCsvService
  ) { }

  updateData(data) {
    this.allData = data;
  }

  selectData(activeData) {
    this.activeData = activeData
  }

  selectIssue(issue) {
    this.selectedIssue = issue;
  }
}
