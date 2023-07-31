import { Injectable } from '@angular/core';

@Injectable( {
  providedIn: 'root'
} )
export class GlobalService {

  public configObj: any;
  public selectedFunction: any;
  public selectedTreatment: any;

  constructor () { }

  setConfigObj ( configObj ) {
    this.configObj = configObj;
  }

  getConfigObj () {
    return this.configObj;
  }

  setSelectedFunction ( data ) {
    if ( data )
    {
      this.selectedFunction = data;

    }
  }
  getSelectedFunction () {
    return this.selectedFunction;
  }

  setSelectedTreatment ( data ) {
    if ( data )
    {
      this.selectedTreatment = data;
     
    }
  }
  getSelectedTreatment () {
    return this.selectedTreatment;
  }
}
