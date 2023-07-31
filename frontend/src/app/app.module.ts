/*!
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {LoaderService} from './services/loader.service';
import {LoaderInterceptor} from './services/interceptor';
import {LoaderComponent} from './loadercop/loader.component';
import {NgxPaginationModule} from 'ngx-pagination';

import {
  OKTA_CONFIG,
  OktaAuthGuard,
  OktaAuthModule,
  OktaCallbackComponent,
} from '@okta/okta-angular';

import sampleConfig from './app.config';

const oktaConfig = Object.assign({
  onAuthRequired: (oktaAuth, injector) => {
    const router = injector.get(Router);
    // Redirect the user to your custom login page
    router.navigate(['/login']);
  }
}, sampleConfig.oidc);

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import { PdfjsViewerComponent, AnnotationDialog, EditAnnotationDialog } from './pdfjs-viewer/pdfjs-viewer.component';
import { MatTreeModule } from '@angular/material/tree';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatTooltipModule} from '@angular/material/tooltip';
import { OpenAiComponent } from './open-ai/open-ai.component';
import { OpenAIHomeComponent } from './open-ai-home/open-ai-home.component';
import { OpenAIPLSComponent } from './open-ai-pls/open-ai-pls.component';
import { OpenAIKnowledgeBaseComponent } from './open-ai-knowledge-base/open-ai-knowledge-base.component';
import { OpenAIQnAComponent } from './open-ai-qn-a/open-ai-qn-a.component';
import { DndDirective } from './dnd.directive';
import { ProgressComponent } from './progress/progress.component';

//import {AlertComponent}  from './alert/alert.component';
const appRoutes: Routes = [
  {
    path: '', pathMatch: 'full',
    component: DashboardComponent,
  },
  {
    path: 'login/callback',
    component: OktaCallbackComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    //canActivate: [ OktaAuthGuard ]
  },

  {
    path: 'annotation',
    component: AnnotationComponent,
    canActivate: [ OktaAuthGuard ],
  },

  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [ OktaAuthGuard ],
  },

  {
    path: 'pdfviewer/:id',
    component: PdfjsViewerComponent
  },

  {
    path: 'dictionary',
    component: DictionaryComponent,
  },
  {
    path: 'open-ai',
    component: OpenAiComponent,
    children: [
      {
        path:'', component: OpenAIPLSComponent
      },
      {
        path:'home', component: OpenAIHomeComponent
      },
      {
        path:'pls', component: OpenAIPLSComponent
      },
      {
        path:'knowledge-base', component: OpenAIKnowledgeBaseComponent
      },
      {
        path:'QnA', component: OpenAIQnAComponent
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    MessagesComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    FileUploadComponent,
    AnnotationComponent,
    LoaderComponent,
    DictionaryComponent,
    DialogBoxComponent,
    PdfjsViewerComponent,
    AnnotationDialog,
    EditAnnotationDialog,
    OpenAiComponent,
    OpenAIHomeComponent,
    OpenAIPLSComponent,
    OpenAIKnowledgeBaseComponent,
    OpenAIQnAComponent,
    DndDirective,
    ProgressComponent

   // AlertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes,{
      useHash: true,
    }),
    OktaAuthModule,
    FormsModule,ReactiveFormsModule,
  ProgressSpinnerModule,
    ButtonModule,BrowserAnimationsModule,NgxPaginationModule
   ,ProgressSpinnerModule,
    ButtonModule,BrowserAnimationsModule,NgxPaginationModule, MatButtonModule, MatTableModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatSelectModule, MatTableExporterModule, MatAutocompleteModule,
    MatSortModule, MatIconModule, MatTreeModule, DragDropModule, MatTooltipModule
  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: oktaConfig },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    DatePipe
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
