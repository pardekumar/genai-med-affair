import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTable} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { DatePipe } from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import { AppDataService } from '../services/app-data.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { map, catchError } from "rxjs/operators";
import { throwError, from } from "rxjs";
import {FormControl} from '@angular/forms';
import * as configData from '../../config/appData-config.json';

export interface PLS_Dictionary {
  entity;
  simplifiedTerm;
  therapeuticArea;
  replaceEntity;
  createdDate;
  id;
}

const ELEMENT_DATA: PLS_Dictionary[] = [];

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements AfterViewInit {
  fileTypeUpload;
  progress;
  dataSheetKey;
  uploadObj;
  fileSize;
  searchText: any;
  totalRows;
  p;
  entityCollection = {};
  listResponse;
  id;
  displayedColumns: string[] = ['entity', 'simplifiedTerm', 'therapeuticArea', 'replaceEntity', 'createdDate', 'action'];
  dataSource = new MatTableDataSource<PLS_Dictionary>(ELEMENT_DATA);
  therapeuticAreaList = [{key: 'Gastroenterology', value: 'gastroenterology'},{key: 'Neuroscience', value: 'neuroscience'},{key: 'Rare Hematology', value: 'Rare Hematology'}, {key: 'Rare Immunology', value: 'Rare Immunology'}, {key: 'Rare Genetic Disorders', value: 'Rare Genetic Disorders'}]
  therapeuticAreaForm = new FormControl();
  configObj: any = ( configData as any ).default;
  //dataSource = ELEMENT_DATA;
  
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('uploadFileInput') uploadFileInput;

  constructor(public dialog: MatDialog, public datepipe: DatePipe, private _liveAnnouncer: LiveAnnouncer, private http: AppDataService, private http1: HttpClient) { }

  ngOnInit() {
    this.onPageChange(1);
    this.therapeuticList()
   
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '50%',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data);
      }
    });
  }

  openDeleteDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '25%',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

    addRowData(row_obj){
      var d = new Date();
      this.entityCollection = {
        entity_name: row_obj.entity,
        entity_value: row_obj.entity,
        therapuetic_area: row_obj.therapeuticArea,
        replacement_type: row_obj.replaceEntity,
        replacement: row_obj.simplifiedTerm
      }
      //this.dataSource.data = data;
      
      this.http.createComplexEntity(this.entityCollection).subscribe(res => {
        //this.table.renderRows();
        this.onPageChange(this.p)
      }, err => {
        if (err.status === 400) {
          if(err.error.message.entity_name || err.error.message.replacement_type){
            alert(this.configObj.umls.mandatoryMsg)
          }
          else if(typeof(err.error.message) == "string") {
            alert(err.error.message)
          }
          else if(err.error.message){
            alert(JSON.stringify(err.error.message))
          }
          else{
            alert(this.configObj.ForRemaningErrorMsg)
          }
        }
      })
    }

    updateRowData(row_obj){
      var entityCollection = {
        entity_name: row_obj.entity,
        entity_value: row_obj.entity,
        therapuetic_area: row_obj.therapeuticArea,
        replacement_type: row_obj.replaceEntity,
        replacement: row_obj.simplifiedTerm
      }
      this.http.updateEntity(row_obj.id, entityCollection).subscribe(res => {
       // window.location.reload();
       this.onPageChange(this.p)
      }, err => {
        if (err.status === 400) {
          if(err.error.message.entity_name || err.error.message.replacement_type){
            alert(this.configObj.umls.mandatoryMsg)
          }
          else if(typeof(err.error.message) == "string") {
            alert(err.error.message)
          }
          else if(err.error.message){
            alert(JSON.stringify(err.error.message))
          }
          else{
            alert(this.configObj.ForRemaningErrorMsg)
          }
        }
      })
    }

    deleteRowData(row_obj){
      this.http.deleteEntity(row_obj.id).subscribe(res => {
        window.location.reload();
        //this.onPageChange(this.p)
      })
    }

    applyFilter(filterValue: string) {
      const tableFilters = [];
      tableFilters.push({
        id: 'entity',
        value: filterValue
      });
      //this.http.searchDictionary(JSON.stringify(tableFilters)).sub  
      this.dataSource.filter = JSON.stringify(tableFilters);
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }

    listData(){
      this.http.getListComplexEntity().subscribe(res => {
        //this.page = res.body.page
        this.onPageChange(1);  
      })
    }
  
    onPageChange(page: number){
      this.therapeuticList()
      if((this.searchText && this.searchText != "") || (this.therapeuticAreaForm.value && this.therapeuticAreaForm.value != "")){
        this.combinedFilterAndSearch(page)
      }
      else{
      this.http.getDictionaryPagination(page).subscribe(res => {
        this.listResponse = res.body.results; 
        this.totalRows = res.body.total
        this.p = page     
        //console.log(this.listResponse)
        var dataset = new MatTableDataSource<PLS_Dictionary>(ELEMENT_DATA);
        dataset.data = []
        this.listResponse.forEach(element => {
           dataset.data.push({entity: element.name,
            id: element.id, 
            simplifiedTerm: element.replacement, 
            therapeuticArea: element.therapuetic_area, 
            replaceEntity: element.replacement_type, 
            createdDate: new Date(element.created_on).toString()})
        });
        this.dataSource.data = dataset.data 
      })
      }
    }

    searchEntity(page=1){
      if(this.searchText == "" || this.searchText == null){
        this.onPageChange(1)
      }
      else{
      this.http.searchDictionary(this.searchText,page).subscribe(res => {
        this.listResponse = res.body.results;
        this.totalRows = res.body.total;
        this.p = page
        //console.log(this.listResponse)
        var dataset = new MatTableDataSource<PLS_Dictionary>(ELEMENT_DATA);
        dataset.data = []
        this.listResponse.forEach(element => {
           dataset.data.push({entity: element.name,
            id: element.id, 
            simplifiedTerm: element.replacement, 
            therapeuticArea: element.therapuetic_area, 
            replaceEntity: element.replacement_type, 
            createdDate: new Date(element.created_on).toString()})
        });
        this.dataSource.data = dataset.data 
      })
     }
    }

    downloadDictionary(){
      this.http.downloadDictionary().subscribe(response => {
        let exportUrl = response.body[ 'url' ];
        window.open( exportUrl, '_blank' );
      })
    }

    onFileSelect(event) {
      let f = event.target.files[0];
  
      this.fileSize = f.size / ( 1024 * 1024 );
      this.uploadObj = {"file_name": f.name,}
      let uploadUrl: any;
      const formData = new FormData();
  
      this.http.getUploadDictionary( this.uploadObj ).subscribe( data => {
        //console.log( "after subscribe getUploadUrl", data );
        this.dataSheetKey = data.body['fields']['key']
        formData.append( "key", data.body[ 'fields' ][ 'key' ] );
        //formData.append( "x-amz-security-token", data.body[ 'fields' ][ 'x-amz-security-token' ] );
        formData.append( "policy", data.body[ 'fields' ][ 'policy' ] );
        formData.append( "x-amz-signature", data.body[ 'fields' ][ 'x-amz-signature' ] );
        formData.append( "x-amz-algorithm", data.body[ 'fields' ][ 'x-amz-algorithm' ] );
        formData.append( "x-amz-credential", data.body[ 'fields' ][ 'x-amz-credential' ] );
        formData.append( "x-amz-date", data.body[ 'fields' ][ 'x-amz-date' ] );
  
        formData.append( "file", f );
  
  
        uploadUrl = data.body[ 'upload_url' ];
        this.progress = 1;
        let uploadCompletePayload = {
          "key": data.body[ 'fields' ][ 'key' ],
          "file_size": this.fileSize
        }
  
        this.http1.post( uploadUrl, formData, {
            reportProgress: true,
            observe: "events",
          
          } )
          .pipe(
            map( ( event: any ) => {
              if ( event.type == HttpEventType.UploadProgress )
              {
                this.progress = Math.round( ( 100 / event.total ) * event.loaded );
              }
           
            } ),
            catchError( ( err: any ) => {
              this.progress = null;
              this.fileTypeUpload = null;
              return throwError( err.message );
            } )
          )
          .toPromise().then( result => {
            // if ( this.progress === 100 )
            this.uploadFileInput.nativeElement.value = ''
            {
              this.http.uploadDictionaryComplete( uploadCompletePayload ).subscribe( response => {
                //console.log( "result of upload complete", response.body );
                this.onPageChange(1);
                }, err => {
                  if (err.status === 400) {                  
                    if(err.error.message == "The file contains duplicate entries"){
                      alert(this.configObj.umls.duplicateEntityMsg)
                    }
                    else if(err.error.message){
                      alert(this.configObj.umls.invalidCSVFileErrorMsg)
                    }
                    else{
                      alert(this.configObj.ForRemaningErrorMsg)
                    }
                  }
                })              
            }
          });
      });
    }

    therapeuticList(){
      this.http.listTherapeuticArea().subscribe(res => {    
        var therapList = res.body
        this.therapeuticAreaList = []
        therapList.forEach(element => {
          this.therapeuticAreaList.push(element.name)
        });
       this.therapeuticAreaList = this.therapeuticAreaList.sort()
      })
    }

    filterTherapeuticArea(page=1){
      if(this.therapeuticAreaForm.value == null){
        this.onPageChange(1)
      }
      else{
      this.http.filterTherapeuticArea(this.therapeuticAreaForm.value, page).subscribe(res =>{
        this.listResponse = res.body.results;
        this.totalRows = res.body.total;
        this.p = page
        var dataset = new MatTableDataSource<PLS_Dictionary>(ELEMENT_DATA);
        dataset.data = []
        this.listResponse.forEach(element => {
           dataset.data.push({entity: element.name,
            id: element.id, 
            simplifiedTerm: element.replacement, 
            therapeuticArea: element.therapuetic_area, 
            replaceEntity: element.replacement_type, 
            createdDate: new Date(element.created_on).toString()})
        });
        this.dataSource.data = dataset.data
      })
      }
    }

    combinedFilterAndSearch(page=1){
      if((this.therapeuticAreaForm.value == null) && (this.searchText == "" || this.searchText == null)){
        this.onPageChange(1)
      }
      else if(this.searchText == "" || this.searchText == null){
        this.filterTherapeuticArea(page)
      }
      else if(this.therapeuticAreaForm.value == null){
        this.searchEntity(page)
      }
      else{
        this.http.getCombinedFilterAndSearch(this.therapeuticAreaForm.value, this.searchText, page).subscribe(res => {
          this.listResponse = res.body.results;
          this.totalRows = res.body.total;
          this.p = page
          //console.log(this.listResponse)
          var dataset = new MatTableDataSource<PLS_Dictionary>(ELEMENT_DATA);
          dataset.data = []
          this.listResponse.forEach(element => {
            dataset.data.push({entity: element.name,
              id: element.id, 
              simplifiedTerm: element.replacement, 
              therapeuticArea: element.therapuetic_area, 
              replaceEntity: element.replacement_type, 
              createdDate: new Date(element.created_on).toString()})
          });
          this.dataSource.data = dataset.data 
        })
      }
    }

    confirmation(event){
      if(event.target.value.length != 0){
      var result = confirm(this.configObj.umls.uploadConfirmMsg);
            if (result == true) {
                this.onFileSelect(event)
            } 
      }
    }
}
