export interface LiveRoomStatus {
  name: string;
  value: string;
}

export class VerifyLiveRoomForm {
  type: number;
  reason: string;

  constructor(type?: number, reason?: string) {
    this.type = type;
    this.reason = reason;
  }
}
