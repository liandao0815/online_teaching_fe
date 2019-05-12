import { Component, OnInit } from '@angular/core';
import { UserRole, UserInfoForm, AdminInfoForm } from './user-manage';
import { UploadFile, NzTabChangeEvent, NzMessageService, NzModalService } from 'ng-zorro-antd';
import User from 'class/User';
import { EUserRole, UserService } from 'services/user.service';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import { TableInfo, RequestParamOfTable, ResponseDataOfTable } from 'config/table-config';

@Component({
  selector: 'app-admin-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.scss']
})
export class UserManageComponent implements OnInit {
  roleType = EUserRole;
  currentAddUserTab = 0; // 添加单个用户时的当前 tab index, 0(添加普通用户)，1(添加管理员)

  userQueryForm = new UserInfoForm();
  addAdminForm = new AdminInfoForm();
  editUserForm = new UserInfoForm();
  addUserForm = new UserInfoForm(EUserRole.student);
  userImportFile: UploadFile;
  currentEditUserId: number;

  // 各模态框状态
  addUserModalStatus = false;
  importUserModelStatus = false;
  editUserModelStatus = false;

  // 用户角色配置
  userRoles: UserRole[] = [
    { id: 0, name: '管理员', value: this.roleType.admin },
    { id: 1, name: '教师', value: this.roleType.teacher },
    { id: 2, name: '学生', value: this.roleType.student }
  ];

  // 用户表格信息
  userTableInfo: TableInfo<User> = {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    data: []
  };

  constructor(
    private message: NzMessageService,
    private userService: UserService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.searchUserData();
  }

  toggleModal(modalName: string): void {
    switch (modalName) {
      case 'addUserModalStatus':
        this.addUserModalStatus = !this.addUserModalStatus;
        break;
      case 'importUserModelStatus':
        this.importUserModelStatus = !this.importUserModelStatus;
        break;
      case 'editUserModelStatus':
        this.editUserModelStatus = !this.editUserModelStatus;
        break;
    }
  }

  handleTabsetChange(event: NzTabChangeEvent) {
    this.currentAddUserTab = event.index;
  }

  avatarBeforeUpload = (file: UploadFile): boolean => {
    this.addAdminForm.avatar = file;
    return false;
  }

  userImportBeforeUpload = (file: UploadFile): boolean => {
    this.userImportFile = file;
    return false;
  }

  downloadImportUserTpl(): void {
    location.href = 'http://cdn.liandao.site/importUserTemplate.xls';
  }

  /**
   * @description 处理添加单个用户信息
   */
  handleSaveAddUser(): void {
    const formData = new FormData();

    if (this.currentAddUserTab === 0) {
      const { account, username, role } = this.addUserForm;

      if (!account || !username) {
        this.message.warning('用户账号或者用户名不能为空');
        return;
      }

      formData.append('account', account);
      formData.append('username', username);
      formData.append('role', role);
    }

    if (this.currentAddUserTab === 1) {
      const { account, username, role, avatar } = this.addAdminForm;

      if (!account || !username) {
        this.message.warning('管理员账号或者管理员用户名不能为空');
        return;
      }

      formData.append('account', account);
      formData.append('username', username);
      formData.append('role', role);
      formData.append('avatar', avatar as any);
    }

    const messageId = this.message.loading('正在添加').messageId;

    this.userService.addUser(formData).subscribe((res: ResponseData<any>) => {
      this.message.remove(messageId);

      if (res.code === SUCCESS_CODE) {
        this.message.success('添加成功');
        this.addUserForm = new UserInfoForm(EUserRole.student);
        this.addAdminForm = new AdminInfoForm();
        this.toggleModal('addUserModalStatus');
        this.currentAddUserTab = 0;
        this.searchUserData(1);
      }
    });
  }

  /**
   * @description 处理批量导入用户信息
   */
  handleImportUser(): void {
    if (!this.userImportFile) {
      this.message.warning('导入用户信息文件不能为空');
      return;
    }

    if (this.userImportFile.type !== 'application/vnd.ms-excel') {
      this.message.warning('导入用户信息文件格式不正确');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.userImportFile as any);

    const messageId = this.message.loading('正在添加', { nzDuration: 0 }).messageId;
    this.userService.batchAddUser(formData).subscribe((res: ResponseData<any>) => {
      this.message.remove(messageId);

      if (res.code === SUCCESS_CODE) {
        this.message.success('添加成功');
        this.toggleModal('importUserModelStatus');
        this.userImportFile = null;
        this.searchUserData(1);
      }
    });
  }

  /**
   * @description 搜索用户列表
   * @param pageNo 页码数
   */
  searchUserData(pageNo?: number): void {
    const { account, username, role } = this.userQueryForm;
    const { pageNum, pageSize } = this.userTableInfo;
    const params: RequestParamOfTable = {
      pageNum: pageNo || pageNum,
      pageSize,
      account: account || '',
      username: username || '',
      role: role || ''
    };

    this.userTableInfo.pageNum = pageNo || pageNum;
    this.userTableInfo.loading = true;

    this.userService.getUserList(params).subscribe((res: ResponseDataOfTable<User>) => {
      this.userTableInfo.loading = false;

      if (res.code === SUCCESS_CODE) {
        this.userTableInfo.total = res.data.total;
        this.userTableInfo.data = this.formatUserTableData(res.data.list);
      }
    });
  }

  /**
   * @description 处理打开编辑用户模态框
   * @param id 用户id
   */
  handleOpenEditModal(id: number): void {
    this.userService.getUserById(id).subscribe((res: ResponseData<User>) => {
      if (res.code === SUCCESS_CODE) {
        const { account, username, role } = res.data;

        this.editUserForm.account = account;
        this.editUserForm.username = username;
        this.editUserForm.role = role;
        this.currentEditUserId = id;
        this.toggleModal('editUserModelStatus');
      }
    });
  }

  /**
   * @description 编辑用户信息
   */
  handleEditUser(): void {
    const { account, username, role } = this.editUserForm;

    if (!account || !username) {
      this.message.warning('用户账号或者用户名不能为空');
      return;
    }

    const params = { account, username, role };
    const messageId = this.message.loading('正在更新').messageId;

    this.userService.updateUserById(this.currentEditUserId, params).subscribe((res: ResponseData<any>) => {
      this.message.remove(messageId);

      if (res.code === SUCCESS_CODE) {
        this.message.success('更新成功');
        this.toggleModal('editUserModelStatus');
        this.searchUserData(this.userTableInfo.pageNum);
      }
    });
  }

  /**
   * @description 删除用户
   * @param id 用户id
   */
  handleDeleteUser(id: number): void {
    this.modal.warning({
      nzTitle: '确定删除此用户吗？',
      nzContent: '注意：删除此用户后，所用与此用户相关的数据都会被清除',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.userService.deleteUser(id).subscribe((res: ResponseData<any>) => {
          if (res.code === SUCCESS_CODE) {
            this.message.success('删除成功');
            this.searchUserData(1);
          }
        });
      }
    });
  }

  private formatUserTableData(data: User[]): User[] {
    const retData = data.map(user => ({
      id: user.id,
      account: user.account,
      username: user.username,
      role: this.userRoles.find(i => i.value === user.role).name,
      loginTime: user.loginTime,
      createTime: user.createTime,
      updateTime: user.updateTime
    }));

    return retData;
  }
}
