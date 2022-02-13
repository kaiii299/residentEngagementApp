import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { SpreadsheetComponent, BeforeSaveEventArgs } from '@syncfusion/ej2-angular-spreadsheet';
import { DialogDataResident, ResidentInfoComponent } from '../resident-info/resident-info.component';
import { ResidentService } from '../resident.service';

@Component({
    selector: 'excel-import-residents',
    templateUrl: './excel-import-residents.html',
    styleUrls: ['./excel-import-residents.scss']
})
export class ExcelImportResidents {

    importedData = Array();
    

    constructor(private residentService: ResidentService) {

    }
    onFileChange(evt: any) {
        const target: DataTransfer = <DataTransfer>evt.target;
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            const wsName: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsName];
            this.importedData = XLSX.utils.sheet_to_json(ws);
        };

        reader.readAsBinaryString(target.files[0]);
    }
    uploadData(){
        // console.log("importedData..")
        // console.log(this.importedData)
        this.residentService.addResidentList(this.importedData).then((result) => {
            if(result){
                location.reload();
            }
        });
    }
}