import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements AfterViewInit {
panelOpenState = false;
search=""
committeesValue =""
userTypeValue =""

userTypes: string[] = [
  "Admin",
  "CC staff",
  "Key Ccc",
  "RN Manager",
  "Key RN Manager",
  "Normal RN Manager"
]

committees: string[] = [
  "Taman Jurong Zone A RN",
  "Taman Jurong Zone B RC",
  "Taman Jurong Zone C RN",
  "Taman Jurong Zone D RC",
  "Taman Jurong Zone E RC",
  "Taman Jurong Zone F RC",
  "Taman Jurong Zone G RN",
  "9 @ Yuan Ching NC",
  "Caspian NC",
  "Lakefront Residences NC",
  "Lakeholmz Condo NC",
  "Lakelife RN",
  "Lakepoint Condo NC",
  "Lakeside Grove NC",
]

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
  }

  columns = [
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: PeriodicElement) => `${element.name}`,
    },
    {
      columnDef: 'committee',
      header: 'Committee',
      cell: (element: PeriodicElement) => `${element.weight}`,
    },
    {
      columnDef: 'Block',
      header: 'Block',
      cell: (element: PeriodicElement) => `${element.name}`,
    },
    {
      columnDef: 'UserType',
      header: 'User Type',
      cell: (element: PeriodicElement) => `${element.symbol}`,
    },
        {
      columnDef: 'Status',
      header: 'Status',
      cell: (element: PeriodicElement) => `${element.name}`,
    },
    {
      columnDef: 'Gender',
      header: 'Gender',
      cell: (element: PeriodicElement) => `${element.symbol}`,
    },
    {
      columnDef: 'Race',
      header: 'Race',
      cell: (element: PeriodicElement) => `${element.symbol}`,
    },
    {
      columnDef: 'Email',
      header: 'Email',
      cell: (element: PeriodicElement) => `${element.symbol}`,
    },
  ];

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns = this.columns.map(c => c.columnDef);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    // (event.target as HTMLInputElement).value = "home"
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

