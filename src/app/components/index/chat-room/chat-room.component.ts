import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  Input
} from '@angular/core';
import { ChatData } from './chat-room';
import { LiveService, LiveMessage, INIT_LIVE_MESSAGE } from 'services/live.service';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import User from 'class/User';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() banner: string;
  @Input() living: '0' | '1';

  @ViewChild('chatList') chatListEr: ElementRef;

  private MAX_CHAT_LIST_LEN = 100; // 最多显示聊天记录条数
  private chatListScrollStatus = false; // 聊天列表是否滚动状态
  private subscription = new Subscription();

  username: string;
  chatInputValue = ''; // 聊天框输入值
  chatRecoreds: ChatData[] = [{ id: 0, name: '系统', value: '聊天记录列表' }];

  constructor(private liveService: LiveService, private userService: UserService) {}

  ngOnInit() {
    const liveMessageSub = this.liveService.message$.subscribe(this.liveMessageObservable);
    const userSub = this.userService.userInfo$.subscribe((user: User) => (this.username = user.username));

    this.subscription.add(liveMessageSub);
    this.subscription.add(userSub);
  }

  ngAfterViewChecked() {
    if (this.chatListScrollStatus) {
      this.scrollElToBottom(this.chatListEr.nativeElement as HTMLElement);
      this.chatListScrollStatus = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  trackByChatRecoreds(index: number, item: ChatData): number {
    return item.id;
  }

  /**
   * @description 提交聊天信息
   */
  submitChatValue(): void {
    this.liveService.pushMessage({
      name: this.username,
      value: this.chatInputValue.trim()
    });
  }

  liveMessageObservable = (livemessage: LiveMessage): void => {
    if (livemessage.name === INIT_LIVE_MESSAGE.name) {
      return;
    }

    const chatItem: ChatData = {
      ...livemessage,
      id: this.chatRecoreds[this.chatRecoreds.length - 1].id + 1
    };

    if (this.chatRecoreds.length > this.MAX_CHAT_LIST_LEN) {
      this.chatRecoreds.splice(0, Math.floor(this.MAX_CHAT_LIST_LEN / 2));
    }

    this.chatRecoreds.push(chatItem);
    this.chatInputValue = '';
    this.chatListScrollStatus = true;
  }

  private scrollElToBottom(el: HTMLElement): void {
    el.scrollTo(0, el.scrollHeight);
  }
}
