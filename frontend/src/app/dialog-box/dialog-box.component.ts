import { Component, OnInit, Inject, Optional  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AppDataService } from '../services/app-data.service';
import { debug } from 'console';
import * as configData from '../../config/appData-config.json';

export interface UsersData {
  entity;
  simplifiedTerm;
  therapeuticArea;
  replaceEntity;
  createdDate;
}

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent {
  form: FormGroup;
  myControl = new FormControl();
  therapeuticArea;
  ngOnInit(): void {
    this.therapeuticList()
    
  } 
  private _filter(value: string): string[] {
    const filterValue = value;

    return this.therapAreaList.filter(option => option.toLowerCase().includes(filterValue));
  }
  action:string;
  local_data:any;
  dictActionList = [{key: 'Acronym', value: 'acronym'} , {key: 'Glossary', value: 'glossary'}, {key: 'Replace', value: 'replace'}, {key: 'Ignore', value: 'ignore'}];
  therapAreaList: any[]
  filteredOptions: Observable<string[]>;
  configObj: any = ( configData as any ).default;
  constructor(
    fb: FormBuilder, public dialogRef: MatDialogRef<DialogBoxComponent>,  private http: AppDataService,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData) {
    //console.log(data);
    this.local_data = {...data};
    this.form = fb.group({
      id: this.local_data.id,
      entity: [this.local_data.entity, Validators.required],
      simplifiedTerm: this.local_data.simplifiedTerm,
      therapeuticArea: this.local_data.therapeuticArea,
      replaceEntity: [this.local_data.replaceEntity, Validators.required]
  });
    this.therapeuticArea = this.form.value.therapeuticArea
    this.action = this.local_data.action;
  }

  doAction(){
    this.form.value.therapeuticArea = this.therapeuticArea
    if(this.form.valid){
      this.dialogRef.close({event:this.action,data:this.form.value});
    }
    else{
      if(!this.form.value.entity)
      alert(this.configObj.mandatoryEntityMsg)
      else if(!this.form.value.replaceEntity)
      alert(this.configObj.mandatoryReplaceMsg)
    }
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  therapeuticList(){
    this.http.listTherapeuticArea().subscribe(res => {    
      var therapList = res.body
      this.therapAreaList = []
      therapList.forEach(element => {
        this.therapAreaList.push(element.name)
      });
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      this.therapAreaList = this.therapAreaList.sort()
    })
  }

}
