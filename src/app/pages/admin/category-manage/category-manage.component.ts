import { Component } from '@angular/core';
import Category from 'class/category';
import { CategoryService } from 'services/category.service';
import { BehaviorSubject } from 'rxjs';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-admin-category-manage',
  templateUrl: './category-manage.component.html',
  styleUrls: ['./category-manage.component.scss']
})
export class CategoryManageComponent {
  modalType = {
    addCategory: 'ADD_CATEGORY',
    editCategory: 'EDIT_CATEGORY'
  };

  modalStatus = false;
  modalTitle: string;
  categoryName: string;
  currenCategoryId: number;
  currentModalType: string;

  constructor(private categoryService: CategoryService, private message: NzMessageService) {}

  get categoryList$(): BehaviorSubject<Category[]> {
    return this.categoryService.categoryList$;
  }

  toggleModal(type?: string, category?: Category): void {
    if (type) {
      let title: string;
      switch (type) {
        case this.modalType.addCategory:
          title = '添加分类';
          this.categoryName = '';
          break;
        case this.modalType.editCategory:
          title = '编辑分类';
          this.categoryName = category.name;
          this.currenCategoryId = category.id;
          break;
      }
      this.modalTitle = title;
      this.currentModalType = type;
    }
    this.modalStatus = !this.modalStatus;
  }

  handleOperateCategory(): void {
    switch (this.currentModalType) {
      case this.modalType.addCategory:
        this.handleAddCategory();
        break;
      case this.modalType.editCategory:
        this.handleEditCategory();
        break;
    }
  }

  handleAddCategory(): void {
    const category = new Category();
    category.name = this.categoryName;

    this.categoryService.addCategory(category).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('添加成功');
        this.categoryName = '';
        this.toggleModal();
        this.categoryService.getCategoryList();
      }
    });
  }

  handleEditCategory(): void {
    const category = new Category();
    category.name = this.categoryName;

    this.categoryService
      .updateCategory(this.currenCategoryId, category)
      .subscribe((res: ResponseData<any>) => {
        if (res.code === SUCCESS_CODE) {
          this.message.success('编辑成功');
          this.categoryName = '';
          this.toggleModal();
          this.categoryService.getCategoryList();
        }
      });
  }

  handleDeleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('删除成功');
        this.categoryService.getCategoryList();
      }
    });
  }
}
