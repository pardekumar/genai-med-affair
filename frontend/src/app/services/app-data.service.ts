import { Injectable } from '@angular/core';
import { EnvironmentService } from '../services/environment.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError,retryWhen,take,delay, retry,shareReplay } from 'rxjs/operators'
import { OktaAuthService } from '@okta/okta-angular';
@Injectable( {
  providedIn: 'root'
} )
export class AppDataService {
  serverUrl = "";
  selectedFunction: any;
  selectedTreatment: any;
  accessToken: string;
  headers = new HttpHeaders();
  constructor ( private environmentService: EnvironmentService,public oktaAuth: OktaAuthService,
    private http: HttpClient ) {
    this.serverUrl = this.environmentService.environment[ 'serverUrl' ];
   
    
    this.accessToken = this.oktaAuth.getAccessToken()
    this.setToken( this.accessToken );
    
  }

  setToken ( token ) {
    this.accessToken = token;
    this.headers = this.headers.set( 'Authorization', 'Bearer ' + this.accessToken );
  }

  setCurrentToken(){
    this.headers = this.headers.set( 'Authorization', 'Bearer ' + this.oktaAuth.getAccessToken() );
  }

  getProductList (): Observable<any> {
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/products";
    return this.http.get( uri, { headers: this.headers, withCredentials: true, observe: 'response' } );
  }

  getUploadUrl ( data ) {
    this.setCurrentToken()
    const uri =  this.serverUrl +"api/v1/get-upload-args";
   
    return this.http.post( uri, data ,{ headers: this.headers, withCredentials: true, observe: 'response' });
  }

  getProcessedFiles ( payload ): Observable<any> {
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/processed-files";
    return this.http.get( uri, {
      params: payload,
      headers: this.headers,
      withCredentials: true,
      observe: 'response'
    } );
  }

  uploadComplete ( uploadPayload ): Observable<any> {
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/upload-complete";
    return this.http.post( uri, uploadPayload, { headers: this.headers, withCredentials: true, observe: 'response' });
  }
  getHtml(token): Observable<any> {
    this.setCurrentToken()
    const uri = this.serverUrl+"api/v1/pdf-html/"+token;
    return this.http.get(uri ,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }

  getFunctionList (): Observable<any> {
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/mps-functions";
    return this.http.get( uri, { headers: this.headers, withCredentials: true, observe: 'response' } );
  }

  getLevels (): Observable<any> {
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/levels";
    return this.http.get( uri, { headers: this.headers, withCredentials: true, observe: 'response' } );
  }

  getSlideNumbers ( id ) {
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/slide-indexes/" + id;
    return this.http.get( uri, { headers: this.headers, withCredentials: true, observe: 'response' } );
  }

  getSimilarityScores ( analysisPayload ) {
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/similarity-scores";
    return this.http.get( uri, {
      params: analysisPayload,
      headers: this.headers,
      withCredentials: true,
      observe: 'response'
    } );
  }

  getUserName () {
    let token = JSON.parse( localStorage.getItem( "okta-token-storage" ) );
    let username = token[ 'idToken' ][ 'claims' ][ 'name' ];

    return username;
  }

  deleteFile ( fileId ) {
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/manuscripts/" + fileId;
    return this.http.delete( uri, { headers: this.headers, withCredentials: true, observe: 'response' } );
  }

  exportFile ( fileId ) {
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/summary/" + fileId;
    return this.http.get( uri, { headers: this.headers, withCredentials: true, observe: 'response' } );
  }
  
  
  getQuestionList(){
    this.setCurrentToken()
    //const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8',"Access-Control-Allow-Origin":'*'});
    const uri = this.serverUrl + "api/v1/questions";
   //const uri = thisapi/v1/questions"
    return this.http.get( uri,{ headers: this.headers, withCredentials: true, observe: 'response' });
   // { headers: this.headers, withCredentials: true, observe: 'response' }
  }
  sendAllSavedAnnotations(data){
    this.setCurrentToken()
    const uri =this.serverUrl + "api/v1/annotations";
    return this.http.post(uri ,data,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }
  getAllListSummaries(): Observable<any>{
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/manuscripts?status=1&status=3&status=4&status=5";
    return this.http.get( uri,{ headers: this.headers, withCredentials: true, observe: 'response' });
    
  }
  saveLaterAnnotation(data){
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/save-annotation-html";
    return this.http.post(uri,data,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }
  getSavedLater(): Observable<any>{
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/manuscripts?status=2";
    return this.http.get( uri,{ headers: this.headers, withCredentials: true, observe: 'response' });
  }
  editSaveLater(fileid):Observable<any>{
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/manuscripts/"+ fileid;
    return this.http.get(uri,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }

  getSavedPDFFileURL(manuscript_id){
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/get-file-url/"+ manuscript_id;
    return this.http.get(uri,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }

  getListComplexEntity():Observable<any>{
    this.setCurrentToken()
    const uri =this.serverUrl + "api/v1/entity"
    return this.http.get(uri,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }

  createComplexEntity(data){
    this.setCurrentToken()
    const uri =this.serverUrl + "api/v1/entity"
    return this.http.post(uri,data,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }

  updateEntity(entityId, data){
    this.setCurrentToken()
    const uri =this.serverUrl + "api/v1/entity/" + entityId
    return this.http.post(uri, data,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }

  deleteEntity(entityId){
    this.setCurrentToken()
    const uri =this.serverUrl + "api/v1/entity/" + entityId
    return this.http.delete(uri,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }

  syncDictionary(data){
    this.setCurrentToken()
    const uri =this.serverUrl + "api/v1/sync-dictionary"
    return this.http.post(uri, data, { headers: this.headers, withCredentials: true, observe: 'response' })
  }

  
  getDictionaryPagination(page):Observable<any>{
    this.setCurrentToken()
    const uri = this.serverUrl + `api/v1/entity?page=${page}&per_page=${10}`;
    return this.http.get(uri,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }
  
  searchDictionary(entityName, page):Observable<any>{
    this.setCurrentToken()
    const uri = this.serverUrl + `api/v1/entity?search=${entityName}&page=${page}&per_page=${10}`;
    return this.http.get(uri,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }

  getPagination(page):Observable<any>{
    this.setCurrentToken()
    const uri = this.serverUrl + `api/v1/manuscripts?status=1&status=3&status=4&status=5&page=${page}&per_page=${2}`;
    return this.http.get(uri,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }

  downloadDictionary(){
    this.setCurrentToken()
    const uri = this.serverUrl + `api/v1/umls-dictionary-detail`
    return this.http.get(uri,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }

  getUploadDictionary(data){
    this.setCurrentToken()
    const uri =  this.serverUrl +"api/v1/umls-dictionary-detail";  
    return this.http.post( uri, data ,{ headers: this.headers, withCredentials: true, observe: 'response' });
  }

  uploadDictionaryComplete(uploadPayload):Observable<any>{
    this.setCurrentToken()
    const uri = this.serverUrl + "api/v1/complete-dictionary-upload";
    return this.http.post( uri, uploadPayload, { headers: this.headers, withCredentials: true, observe: 'response' });
  }

  listTherapeuticArea():Observable<any>{
    this.setCurrentToken()
    const uri = this.serverUrl + `api/v1/therapuetic-area`
    return this.http.get(uri,{ headers: this.headers, withCredentials: true, observe: 'response' })
  }

  filterTherapeuticArea(data, page):Observable<any>{
    this.setCurrentToken()
    const uri = this.serverUrl + `api/v1/entity?per_page=${10}&page=${page}`;
    return this.http.get(uri,{ headers: this.headers, params: {'therapuetic_area': data}, withCredentials: true, observe: 'response' })
  }

  getCombinedFilterAndSearch(filterData, searchData, page):Observable<any>{
    this.setCurrentToken()
    const uri = this.serverUrl + `api/v1/entity?per_page=${10}&page=${page}`;
    return this.http.get(uri,{ headers: this.headers, params: {'therapuetic_area': filterData,'search': searchData}, withCredentials: true, observe: 'response' })
  }

}
