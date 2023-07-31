import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  constructor(private http: HttpClient) { }

  loadData(uploadPayload): Observable<any> {
    const uri = "http://0.0.0.0:7/create_knowledge_base";
    return this.http.post( uri, uploadPayload, { withCredentials: true, observe: 'response' });
  }

  getAnswerQnA(question): Observable<any> {
    const uri = "http://0.0.0.0:7/qa";
    let payload = {"question": question}
    return this.http.post( uri, payload, { withCredentials: true, observe: 'response' });
  }

  getPLSData(plsData): Observable<any> {
    const uri = "http://localhost:5000/api/v1/pls";
    let payload = plsData;
    const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
    return this.http.post( uri, payload, { withCredentials: true, observe: 'response', 'headers': headers });
  }
}
