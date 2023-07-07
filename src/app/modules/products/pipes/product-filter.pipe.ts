import {Pipe, PipeTransform} from '@angular/core';
import {Product} from "../interfaces/product";

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {
  transform(items: Array<Product>, searchText: string) {
    const data = searchText.toLowerCase();
    return items.filter(item =>
      item.description?.toLowerCase() === data ||
      item.brand?.toLowerCase() === data ||
      item.description?.toLowerCase().includes(data) ||
      item.brand?.toLowerCase().includes(data)
    );
  }
}
