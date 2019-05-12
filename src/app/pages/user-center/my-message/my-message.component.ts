import { Component } from '@angular/core';
import { MessageService } from 'services/message.service';
import { BehaviorSubject } from 'rxjs';
import Message from 'class/message';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Component({
  selector: 'app-my-message',
  templateUrl: './my-message.component.html',
  styleUrls: ['./my-message.component.scss']
})
export class MyMessageComponent {
  messageDetailModal = false;
  currentMessageId = 0;
  currentMessageDetail: Message;

  constructor(private messageService: MessageService) {}

  get messageList$(): BehaviorSubject<Message[]> {
    return this.messageService.messageList$;
  }

  toggleModalSatus(id?: number): void {
    if (id) {
      this.currentMessageDetail = null;
      this.currentMessageId = id;
      this.messageService
        .getMessageDetail(this.currentMessageId)
        .subscribe((res: ResponseData<Message>) => {
          if (res.code === SUCCESS_CODE) {
            this.currentMessageDetail = res.data;
            this.messageDetailModal = !this.messageDetailModal;
            this.messageService.getMessageList();
          }
        });
    } else {
      this.messageDetailModal = !this.messageDetailModal;
    }
  }

  trackByMessageList(index: number, message: Message): number {
    return message.id;
  }
}
