import {Component, Input} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-content',
    templateUrl: './template/modal.component.html'
})
export class NgbdModalContent {
    @Input() name;
    constructor(public activeModal: NgbActiveModal) {}
}

@Component({
    selector: 'app-modal-component',
    templateUrl: './template/modal.component.html'
})
export class NgbdModalComponent {
    constructor(private modalService: NgbModal) {}
    open() {
        const modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.name = 'World';
    }
}
