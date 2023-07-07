import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {User} from "@angular/fire/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../../products/services/category.service";
import {Category} from "../../../products/interfaces/category";
import {Timestamp} from "firebase/firestore";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-settings-products-categories',
  templateUrl: './settings-products-categories.component.html',
  styleUrls: ['./settings-products-categories.component.scss']
})
export class SettingsProductsCategoriesComponent implements OnInit, OnDestroy {
  @Input() firebaseUser = {} as User;
  @Output() outTemplate = new EventEmitter<string>();

  /** VARIABLES **/
  newCategoryForm: FormGroup;
  private unsubscribe$ = new Subject<boolean>();
  listCategories: Category[] = [];

  constructor(private categoryService: CategoryService, private fb: FormBuilder) {
    this.newCategoryForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.listCategories = res;
      });
  }

  getTemplate(template: string) {
    this.outTemplate.emit(template);
  }

  async deleteCategory(category: Category) {
    try {
      await this.categoryService.deleteCategory(category);
    } catch (e) {
      console.log(e);
    }
  }

  async onSubmit(firebaseUser: User) {
    let newCategory: Category;
    if (this.newCategoryForm.valid) {
      newCategory = this.newCategoryForm.value;
      newCategory.name = newCategory.name.toUpperCase();
      newCategory.createdAt = Timestamp.fromDate(new Date());
      newCategory.updatedAt = Timestamp.fromDate(new Date());
      newCategory.createdBy = firebaseUser.uid;
      newCategory.updatedBy = firebaseUser.uid;

      try {
        await this.categoryService.addCategory(newCategory);
        this.newCategoryForm.reset();
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("error");
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
