import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, searchValue: string){
    if(value.length === 0 || searchValue === ''){
      return value;
    };

    const users = [];
    console.log(value);

    for (const user of value){

      if(user === searchValue){
        users.push(user);
      }
    }
    console.log(users);
    return users;
  }

}
