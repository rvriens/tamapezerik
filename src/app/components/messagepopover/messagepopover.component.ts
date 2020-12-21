import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-messagepopover',
  templateUrl: './messagepopover.compontent.html',
  styleUrls: ['./messagepopover.component.scss'],
})
export class MessagePopoverComponent implements OnInit {
    @Input() message: string;
    ngOnInit(): void {
    }
}
