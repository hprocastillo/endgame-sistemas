import {Pipe, PipeTransform} from '@angular/core';
import {Category} from "../../products/interfaces/category";

@Pipe({
  name: 'categoryFilter'
})
export class CategoryFilterPipe implements PipeTransform {

  transform(items: Array<Category>, searchText: string) {
    const data = searchText.toLowerCase();
    return items.filter(item =>
      item.name?.toLowerCase() === data ||
      item.name?.toLowerCase().includes(data)
    );
  }
}
