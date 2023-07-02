import { Pipe, PipeTransform } from '@angular/core';
import {Customer} from "../interfaces/customer";

@Pipe({
  name: 'customerFilter'
})
export class CustomerFilterPipe implements PipeTransform {

  transform(items: Array<Customer>, searchText: string) {
    const data = searchText.toLowerCase();
    return items.filter(item =>
      item.fullName?.toLowerCase() === data ||
      item.email?.toLowerCase() === data ||
      item.fullName?.toLowerCase().includes(data) ||
      item.email?.toLowerCase().includes(data)
    );
  }
}
