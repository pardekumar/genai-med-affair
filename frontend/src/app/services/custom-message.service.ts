import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';

//import { CustomMessageComponent } from './../custom-message/custom-message.component';

@Injectable( {
  providedIn: 'root'
} )
export class CustomMessageService {
  constructor () { }

  // constructor ( private snackBar: MatSnackBar ) { }
  // public openSnackBar ( message, type, duration?) {
  //   const panelclass = 'error-Message';
  //   const _snackType = type !== undefined ? type : 'success';
  //   this.snackBar.openFromComponent( CustomMessageComponent, {
  //     duration: duration || 10000,
  //     horizontalPosition: 'center',
  //     verticalPosition: 'top',
  //     data: { message: message, snackType: _snackType, snackBar: this.snackBar },
  //     panelClass: panelclass || ''
  //   },
  //   );
  // }

  public openDialog ( severity, summary, message ) {

  }

  public closeSnackBar () {
    // this.snackBar.dismiss();
  }
}
