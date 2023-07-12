import {Pipe, PipeTransform} from '@angular/core';
import {Brand} from "../../products/interfaces/brand";

@Pipe({
  name: 'brandFilter'
})
export class BrandFilterPipe implements PipeTransform {
  transform(items: Array<Brand>, searchText: string) {
    const data = searchText.toLowerCase();
    return items.filter(item =>
      item.name?.toLowerCase() === data ||
      item.name?.toLowerCase().includes(data)
    );
  }
}
