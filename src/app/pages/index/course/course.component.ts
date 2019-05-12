import { Component, OnInit, OnDestroy } from '@angular/core';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CourseService } from 'services/course.service';
import { CategoryService } from 'services/category.service';
import { UserService, EUserRole } from 'services/user.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import Course from 'class/course';
import Category from 'class/category';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import * as uuidv1 from 'uuid/v1';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import User from 'class/User';
import { environment } from 'environments/environment';
import { RequestParamOfTable, ResponseDataOfTable } from 'config/table-config';
import { BriefItem } from 'components/index/brief-item/brief-item';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  roleType = EUserRole;
  courseFile: UploadFile; // 上传课程视频文件
  posterFile: UploadFile; // 上传课程海报文件
  courseForm = new Course(); // 上传课程表单
  pageNum = 1;
  pageSize = 20;
  loading = false;
  userInfo: User;
  courseList: Course[] = [];
  currentCategoryId = 0;

  progressBarStatus = false;
  progressBarPercent = 0;
  uploadCourseModalStatus = false;
  uploadLoading = false;

  constructor(
    private sanitizer: DomSanitizer,
    private courseService: CourseService,
    private categoryService: CategoryService,
    private message: NzMessageService,
    private userService: UserService
  ) {}

  get categoryList$(): BehaviorSubject<Category[]> {
    return this.categoryService.categoryList$;
  }

  ngOnInit() {
    const userInfoSub = this.userService.userInfo$.subscribe((userInfo: User) => {
      this.userInfo = userInfo;
    });

    this.subscription.add(userInfoSub);
    this.getCourseList();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleModalStatus(): void {
    this.uploadCourseModalStatus = !this.uploadCourseModalStatus;
  }

  trackByCouseList(index: number, briefItem: BriefItem) {
    return briefItem.id;
  }

  courseBeforeUpload = (file: UploadFile): boolean => {
    this.courseFile = file;
    this.progressBarStatus = false;
    this.progressBarPercent = 0;
    return false;
  }
  posterBeforeUpload = (file: UploadFile): boolean => {
    this.posterFile = file;
    return false;
  }
  get posterLocalUrl(): string | SafeUrl {
    const objectUrl = this.posterFile ? window.URL.createObjectURL(this.posterFile) : '';
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }

  /**
   * @description 处理tab点击事件
   */
  handleClickTab(categoryId: number): void {
    if (this.currentCategoryId === categoryId) {
      return;
    }

    this.pageNum = 1;
    this.courseList = [];
    this.currentCategoryId = categoryId;
    this.getCourseList();
  }

  /**
   * @description 获取课程列表
   */
  getCourseList(): void {
    const params: RequestParamOfTable = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      categoryId: this.currentCategoryId
    };

    this.loading = true;
    this.courseService.getCourseList(params).subscribe((res: ResponseDataOfTable<Course>) => {
      this.loading = false;

      if (res.code === SUCCESS_CODE) {
        this.pageNum += 1;
        this.courseList = [...this.courseList, ...res.data.list];
      }
    });
  }

  /**
   * @description 上传课程
   */
  handleUploadCourse(): void {
    const uploadCourseFormData = new FormData();
    const courseName = this.formatFileName(this.courseFile.name);

    uploadCourseFormData.append('file', this.courseFile as any);
    uploadCourseFormData.append('key', courseName);

    this.uploadLoading = true;
    this.progressBarStatus = true;

    this.courseService.uploadCourse(uploadCourseFormData).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progressBarPercent = Math.round((100 * event.loaded) / event.total);
      } else if (event instanceof HttpResponse && event.status === 200) {
        const link = `${environment.qiniuUrlPrefix}/${courseName}`;
        const { name, introduction, categoryId } = this.courseForm;
        const createCourseFormData = new FormData();

        createCourseFormData.append('name', name);
        createCourseFormData.append('introduction', introduction);
        createCourseFormData.append('categoryId', String(categoryId));
        createCourseFormData.append('poster', this.posterFile as any);
        createCourseFormData.append('link', link);

        this.handleCreateCourse(createCourseFormData);
      }
    });
  }

  /**
   * @description 创建课程
   */
  handleCreateCourse(formData: FormData): void {
    const messageId = this.message.loading('正在创建课程信息', { nzDuration: 0 }).messageId;

    this.courseService.createCourse(formData).subscribe((res: ResponseData<any>) => {
      this.uploadLoading = false;
      this.message.remove(messageId);

      if (res.code === SUCCESS_CODE) {
        this.message.success('上传成功');
        this.toggleModalStatus();
        this.posterFile = null;
        this.courseFile = null;
        this.courseForm = new Course();
        this.progressBarStatus = false;
        this.progressBarPercent = 0;

        this.pageNum = 1;
        this.courseList = [];
        this.getCourseList();
      }
    });
  }

  /**
   * @description 检查上传课程表单提交状态
   */
  checkCourseFormStatus(): boolean {
    const { name, introduction, categoryId } = this.courseForm;
    const formItemArray = [name, introduction, categoryId, this.posterFile, this.courseFile];

    return formItemArray.every(item => !!item);
  }

  /**
   * @description 格式化文件名
   * @param fileName 文件名
   */
  private formatFileName(fileName: string): string {
    if (!fileName) {
      throw new Error('文件名不能为空');
    }

    if (!fileName.includes('.')) {
      throw new Error('请选取正确的文件名');
    }

    const fileExtName = fileName.substring(fileName.lastIndexOf('.') + 1);
    return `${uuidv1()}.${fileExtName}`;
  }
}
