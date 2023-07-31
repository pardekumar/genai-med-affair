import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable( {
  providedIn: 'root'
} )
export class EnvironmentService {
  environment: any = {};

  constructor () {
    this.environment = environment;
  }
  // loadJSON ( filePath ) {
  //   const json = this.loadTextFileAjaxSync( filePath, "application/json" );
  //   return JSON.parse( json );
  // }
  // loadTextFileAjaxSync ( filePath, mimeType ) {
  //   const xmlhttp = new XMLHttpRequest();
  //   xmlhttp.open( "GET", filePath, false );
  //   if ( mimeType != null )
  //   {
  //     if ( xmlhttp.overrideMimeType )
  //     {
  //       xmlhttp.overrideMimeType( mimeType );
  //     }
  //   }
  //   xmlhttp.send();
  //   if ( xmlhttp.status == 200 )
  //   {
  //     // console.log("Configuration", filePath, xmlhttp.responseText);
  //     return xmlhttp.responseText;
  //   } else
  //   {
  //     console.log( "Cannot load configuration..." )
  //     return null;
  //   }
  // }

}
