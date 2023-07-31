import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppDataService } from './../services/app-data.service';
import { GlobalService } from './../services/global.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders, HttpEventType } from '@angular/common/http';
import { FileUpload } from './file-upload';
import { map, catchError } from "rxjs/operators";
import { throwError, from } from "rxjs";
import { EnvironmentService } from '../services/environment.service';
import * as configData from '../../config/appData-config.json';
import { OktaAuthService } from '@okta/okta-angular';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService]
})
export class DashboardComponent implements OnInit {
  public percentDone: number;
  public uploadSuccess: boolean;
  public functionList: Array<any> = [];
  public selectedFunction: any;
  public accessToken: string;
  public dashboardForm: FormGroup;
  public formSubmitted: boolean = false;
  public uploadButtonTooltip: any;
  public analysisButtonTooltip: any;
  public functionDropTooltip: any;
  public delayTooltip: any;
  public bannerImage: any;
  public errMsg: any;
  public showSpinner: boolean;
  public tokenErrMsg: any;
  public viewdata;
  public username: string
  public uploadObj = {}
  public uploadresult;
  public progress: number;
  public fileTypeUpload: any;
  public pdf_key
  public summariesdata
  public summaries
  public headers = new HttpHeaders();
  public serverUrl = "";
  public tokenbase;
  public savelater;
  p: number = 1;
  public page;
  public total;
  pag;
  change
  isAuthenticated: boolean;
  @ViewChild('ipt', { static: true }) template: ElementRef;
  configObj: any = (configData as any).default;
  constructor(private environmentService: EnvironmentService, public oktaAuth: OktaAuthService, private appDataService: AppDataService, private messageService: MessageService, private globalService: GlobalService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.serverUrl = this.environmentService.environment['serverUrl'];
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  ngOnInit(): void {
    sessionStorage.removeItem('isReAnnotation')
    this.showSpinner = true;
    this.getAllSummaries()

    this.getSaveLaterSumaries()
   
    this.bannerImage = this.globalService.configObj.bannerImages.dashboardPage;
    let tokenObject = JSON.parse(localStorage.getItem('okta-token-storage'));
    this.username = tokenObject.idToken.claims.name.split(' ').slice(0, 1).join(' ').replace(/,/, "");


    this.accessToken =  this.oktaAuth.getAccessToken()


    this.appDataService.setToken(this.accessToken);
   




  }

  goToPdfViewer(){
    this.router.navigate(['pdfviewer']);
  }
  uploadPDF(event){
    var file = event.target.files[0];
    var fileName = { "file_name": file.name }
    var fileSize = file.size / (1024 * 1024)
    let uploadUrl: any;
    const formData = new FormData();
    this.appDataService.getUploadUrl(fileName).subscribe(data => {
      var pdf_key = data.body['fields']['key']
      formData.append("key", data.body['fields']['key']);
      //formData.append( "AWSAccessKeyId", data[ 'fields' ][ 'AWSAccessKeyId' ] );
      // formData.append( "x-amz-security-token", data.body[ 'fields' ][ 'x-amz-security-token' ] );
      formData.append("policy", data.body['fields']['policy']);
      formData.append("x-amz-signature", data.body['fields']['x-amz-signature']);
      formData.append("x-amz-algorithm", data.body['fields']['x-amz-algorithm']);
      formData.append("x-amz-credential", data.body['fields']['x-amz-credential']);
      formData.append("x-amz-date", data.body['fields']['x-amz-date']);
      formData.append("file", file);

      uploadUrl = data.body['upload_url'];

      this.http
        .post(uploadUrl, formData, {
          reportProgress: true,
          observe: "events",

        })
        .toPromise().then(result => {
              let navigationExtras: NavigationExtras = {
                state: {
                  fileData: file,
                  key: pdf_key,
                  upload: true
                }
              }
              this.router.navigate(['pdfviewer/ '],navigationExtras);
          })
    })
  }
  
  files: FileUpload[];
  allowNull: boolean;
  fileSize
  onFileSelect(event) {

    let f = event.target.files[0];

    this.fileSize = f.size / (1024 * 1024);
    this.uploadObj = { "file_name": f.name, }
    let uploadUrl: any;
    const formData = new FormData();




    this.appDataService.getUploadUrl(this.uploadObj).subscribe(data => {

      this.pdf_key = data.body['fields']['key']
      formData.append("key", data.body['fields']['key']);
      //formData.append( "AWSAccessKeyId", data[ 'fields' ][ 'AWSAccessKeyId' ] );
       formData.append( "x-amz-security-token", data.body[ 'fields' ][ 'x-amz-security-token' ] );
      formData.append("policy", data.body['fields']['policy']);
      formData.append("x-amz-signature", data.body['fields']['x-amz-signature']);
      formData.append("x-amz-algorithm", data.body['fields']['x-amz-algorithm']);
      formData.append("x-amz-credential", data.body['fields']['x-amz-credential']);
      formData.append("x-amz-date", data.body['fields']['x-amz-date']);

      formData.append("file", f);


      uploadUrl = data.body['upload_url'];
      this.progress = 1;
      let uploadCompletePayload = {
        "key": data.body['fields']['key'],
        "file_size": this.fileSize
      }

      this.http
        .post(uploadUrl, formData, {
          reportProgress: true,
          observe: "events",

        })
        .pipe(
          map((event: any) => {
            if (event.type == HttpEventType.UploadProgress) {
              this.progress = Math.round((100 / event.total) * event.loaded);
            }

          }),
          catchError((err: any) => {
            this.progress = null;
            this.fileTypeUpload = null;

            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 5000 })

            return throwError(err.message);
          })
        )
        .toPromise().then(result => {
          // if ( this.progress === 100 )
          {
            this.appDataService.uploadComplete(uploadCompletePayload).subscribe(response => {


              let navigationExtras: NavigationExtras = {
                state: {
                  html: response.body.pdf_token,
                  name: f.name,
                  key: response.body.key,
                  upload: true


                }
              }

              this.router.navigate(['annotation'], navigationExtras);

              sessionStorage.removeItem('hand');
              sessionStorage.removeItem('datas');





              if(response.body.message){
                let message = this.globalService.configObj['fileUploadMessage'][response.body.message];
                this.messageService.add({ severity: 'info', summary: 'Info Message', detail: message, life: 5000 })
              }
            });
          }
        });
    });
  }

  showMsg: boolean = false;
  deleteFile(file) {
    this.appDataService.deleteFile(file.id).subscribe(result => {
      this.showMsg = true
      this.getAllSummaries();
      this.getSaveLaterSumaries();
    })
  }
  exportFiles(file) {
    let fileId = file.id;
    if (fileId) {
      this.appDataService.exportFile(fileId).subscribe(response => {
        let exportUrl = response.body['url'];
        window.open(exportUrl, '_blank');
      })
    }

  }
  removedata() {

  }
  navannotate() {
    this.router.navigateByUrl('/annotation')
  }
  getAllSummaries() {
    this.appDataService.getAllListSummaries().subscribe(res => {

      this.page = res.body.page

      this.serverPagination(1)

    })
  }
  getSaveLaterSumaries() {
    this.appDataService.getSavedLater().subscribe(res => {
      this.savelater = res.body.results
      this.savelater.forEach(item => {
        if (item.job_queued_on) {
          item.date = new Date(item.job_queued_on + 'Z').toString()
        }
      })

    })
  }
  editSaveLater(file) {
    this.appDataService.editSaveLater(file.id).subscribe(result => {

      let my: NavigationExtras = {
        state: {
          html1: result.body.annotation_html,
          annotation: result.body.annotations.annotations,
          name: result.body.name,
          pdf_key: result.body.s3_path,
          id: result.body.id,
          handel: result.body.annotations.handler


        }
      }

      this.router.navigate(['annotation'], my);
    })
  }
  reAnnotateManuscript(file) {
    this.appDataService.editSaveLater(file.id).subscribe(result => {

      let my: NavigationExtras = {
        state: {
          html1: result.body.annotation_html,
          annotation: result.body.annotations.annotations,
          name: result.body.name,
          pdf_key: result.body.s3_path,
          //id: result.body.id,
          handel: result.body.annotations.handler


        }
      }

      this.router.navigate(['annotation'], my);
    })
  }
  editSavedFile(file){
    let reAnnotationCheck: NavigationExtras = {
      state: {
        reAnnotation: false,
      }
    }
    this.router.navigate(['pdfviewer/'+ file.id], reAnnotationCheck);
  }

  reAnnotateFile(file) {
    let reAnnotationCheck: NavigationExtras = {
      state: {
        reAnnotation: true,
      }
    }
    this.router.navigate(['pdfviewer/'+ file.id], reAnnotationCheck);
  }

  logout() {
    this.oktaAuth.signOut('http://localhost:8080');
    this.router.navigateByUrl('/login')
    localStorage.removeItem('okta-cache-storage');
    localStorage.removeItem('okta-token-storage');
    localStorage.removeItem('okta-pkce-storage');
  }
  refresh() {
    this.getAllSummaries()
  }
  goToDictionary() {
    this.router.navigateByUrl('/dictionary')
  }
  goToOpenAI() {
    this.router.navigateByUrl('/open-ai')
  }
  serverPagination(page: number) {
    this.appDataService.getPagination(page).subscribe(res => {
      this.summaries = res.body.results;
      this.summaries.forEach(item => {
        if (item.job_queued_on) {
          item.date = new Date(item.job_queued_on + 'Z').toString()
        }
      })

      this.total = res.body.total;
      this.p = page

    })
  }


}
