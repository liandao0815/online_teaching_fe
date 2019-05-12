import { UploadFile } from 'ng-zorro-antd';
import { EUserRole } from 'services/user.service';

export interface UserRole {
  id: number;
  name: string;
  value: string;
}

export class UserInfoForm {
  account: string;
  username: string;
  role: string;

  constructor(role?: string) {
    this.role = role;
  }
}

export class AdminInfoForm {
  account: string;
  username: string;
  avatar: UploadFile;
  role = EUserRole.admin;
}
