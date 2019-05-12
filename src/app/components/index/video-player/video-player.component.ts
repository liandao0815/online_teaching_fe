import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy, OnInit, Input } from '@angular/core';
import Player from 'utils/player';
import Barrage from 'utils/barrage';
import { NzNotificationService } from 'ng-zorro-antd';
import { LiveService, LiveMessage, INIT_LIVE_MESSAGE } from 'services/live.service';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import User from 'class/User';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() videoSrc: string;
  @Input() living: '0' | '1';

  @ViewChild('video') videoEr: ElementRef;
  @ViewChild('videoBox') videoBoxEr: ElementRef;
  @ViewChild('videoControl') videoControlEr: ElementRef;
  @ViewChild('barrageCanvas') barrageCanvasEr: ElementRef;

  private myPlayer: Player;
  private barrage: Barrage;
  private subscription = new Subscription();

  username: string;
  isFullscreen = false; // 是否全屏
  playing = false; // 默认是否自动播放
  volume = 100; // 默认滑块音量
  volumeBeforeMute = this.volume; // 静音前音量
  barrageValue = ''; // 弹幕框输入值
  barrageStatus = true; // 弹幕开启状态

  constructor(
    private nzNotification: NzNotificationService,
    private liveService: LiveService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const liveMessageSub = this.liveService.message$.subscribe(this.liveMessageObservable);
    const userSub = this.userService.userInfo$.subscribe((user: User) => (this.username = user.username));

    this.subscription.add(liveMessageSub);
    this.subscription.add(userSub);
    document.addEventListener('fullscreenchange', () => this.initBarrageCanvas());
  }

  ngAfterViewInit() {
    this.initVideoPlayer();
    this.initBarrageCanvas();
    this.initFullscreenEvent();
    this.checkFlashPlugin();
  }

  ngOnDestroy() {
    this.myPlayer.dispose();
    this.subscription.unsubscribe();
    document.removeEventListener('fullscreenchange', () => this.initBarrageCanvas());
  }

  handleSubmitBarrage(): void {
    const liveMessage: LiveMessage = {
      name: this.username,
      value: this.barrageValue.trim()
    };

    this.liveService.pushMessage(liveMessage);
    this.barrageValue = '';
  }

  handleBarrageSliderChange(e: boolean): void {
    if (e) {
      this.barrage.draw();
    } else {
      this.barrage.clear();
    }
    this.barrageStatus = e;
  }

  /**
   * @description 切换全屏
   * @param el 切换全屏的元素
   */
  toggleFullscreen(el: HTMLElement): void {
    this.isFullscreen ? document.exitFullscreen() : el.requestFullscreen();
  }

  /**
   * @description 切换播放状态
   */
  togglePlayingStatus(): void {
    if (this.playing) {
      this.myPlayer.pause();
    } else {
      this.myPlayer.play();
    }
    this.playing = this.myPlayer.getPlayerInfo().playing;
  }

  /**
   * @description 重载视频
   */
  reloadVideo(): void {
    this.myPlayer.reload();
    this.playing = this.myPlayer.getPlayerInfo().playing;
  }

  /**
   * @description 切换音量状态
   */
  toggleVolumeStatus(): void {
    if (this.volume === 0) {
      this.volume = this.volumeBeforeMute;
    } else {
      this.volumeBeforeMute = this.volume;
      this.volume = 0;
    }
    this.setPlayerVolume(this.volume);
  }

  /**
   * @设置播放器音量
   * @param value 音量值 范围 [0, 100]
   */
  setPlayerVolume(value: number): void {
    this.myPlayer.setVolume(value / 100);
  }

  /**
   * @description 播放器绑定键盘事件
   */
  handleVideoBoxKeydown(e: KeyboardEvent): void {
    if (document.activeElement.nodeName !== 'INPUT') {
      switch (e.code) {
        case 'Space':
          this.togglePlayingStatus();
          break;
        case 'Enter':
          this.toggleFullscreen(this.videoBoxEr.nativeElement);
          break;
        case 'ArrowUp':
          this.volume = this.volume >= 95 ? 100 : this.volume + 5;
          this.setPlayerVolume(this.volume);
          break;
        case 'ArrowDown':
          this.volume = this.volume <= 5 ? 0 : this.volume - 5;
          this.setPlayerVolume(this.volume);
          break;
        case 'KeyR':
          this.reloadVideo();
          break;
        case 'KeyM':
          this.toggleVolumeStatus();
          break;
      }
    }
  }

  liveMessageObservable = (livemessage: LiveMessage): void => {
    if (livemessage.name === INIT_LIVE_MESSAGE.name || !this.barrageStatus) {
      return;
    }
    this.barrage.add(livemessage.value);
  }

  private initVideoPlayer(): void {
    const $video = this.videoEr.nativeElement as HTMLVideoElement;
    $video.removeAttribute('autoplay');

    this.myPlayer = new Player($video, {
      volumn: this.volume / 100,
      playing: this.playing
    });
  }

  private initBarrageCanvas(): void {
    const $videoControl = this.videoControlEr.nativeElement as HTMLDivElement;
    const $barrageCanvas = this.barrageCanvasEr.nativeElement as HTMLCanvasElement;

    $barrageCanvas.width = $videoControl.clientWidth;
    $barrageCanvas.height = $videoControl.clientHeight * 0.65;

    this.barrage = new Barrage($barrageCanvas, { multiColor: true });

    if (this.barrageStatus) {
      this.barrage.draw();
    } else {
      this.barrage.clear();
    }
  }

  private initFullscreenEvent(): void {
    const $videoBox = this.videoBoxEr.nativeElement as HTMLDivElement;
    const document: any = window.document;

    $videoBox.addEventListener('fullscreenchange', () => {
      this.isFullscreen =
        document.fullscreenElement && (document.fullscreenElement as HTMLElement).id === 'videoBox';
    });
  }

  private checkFlashPlugin(): void {
    if (!navigator.plugins['Shockwave Flash']) {
      this.nzNotification.warning('播放器初始化失败', '请下载或打开浏览器的 Flash');
    }
  }
}
