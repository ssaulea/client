import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {

  bsmodalRef = inject(BsModalRef);
  title: string = '';
  message: string = '';
  btnOkText: string = '';
  btnCancelText: string = '';
  result = false;

  confirm() {
    this.result = true;
    this.bsmodalRef.hide();
  }

  decline() {
    this.bsmodalRef.hide();
  }
}
