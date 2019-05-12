import videojs from 'video.js';
import 'videojs-flash';

export interface IPlayer {
  play: () => void;
  pause: () => void;
  reload: (src: string, type?: string) => void;
  setVolume: (value: number) => void;
  getPlayerInfo: () => PlayerInfo;
  dispose: () => void;
}

export interface PlayerInfo {
  volumn?: number;
  playing?: boolean;
}

export default class Player implements IPlayer {
  private INIT_VOLUME = 0.5; // 默认音量
  private INIT_PLAYING = false; // 默认是否播放

  private playerInfo: PlayerInfo;
  private vPlayer: videojs.Player;

  constructor(video: HTMLVideoElement, options?: PlayerInfo) {
    this.vPlayer = videojs(video);
    this.initPlayerInfo(options);
  }

  play(): void {
    this.vPlayer.play();
    this.playerInfo.playing = true;
  }

  pause(): void {
    this.vPlayer.pause();
    this.playerInfo.playing = false;
  }

  setVolume(value: number): void {
    this.vPlayer.volume(value);
  }

  reload(): void {
    this.vPlayer.load();
    this.play();
  }

  dispose(): void {
    this.vPlayer.dispose();
  }

  getPlayerInfo(): PlayerInfo {
    return this.playerInfo;
  }

  private initPlayerInfo(options?: PlayerInfo): void {
    const initOptions = {
      volume: this.INIT_VOLUME,
      playing: this.INIT_PLAYING
    };

    this.playerInfo = { ...initOptions, ...options };
    this.setVolume(this.playerInfo.volumn);

    if (this.playerInfo.playing) {
      this.vPlayer.play();
    }
  }
}
