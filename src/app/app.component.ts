import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ColDef, GridSizeChangedEvent, } from 'ag-grid-community';
import { Observable } from 'rxjs';
import patients from './util/patient.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Harris Angular Grid';
  public rowData$!: Observable<any[]>;
  scrollMode = 'vertical';
  objRowDataStr: any;
  objColDefsStr: any;
  
  
  
  // patients json data 
  rowData: any[] = patients;
  
  // configuration grid json data

  colDefs: ColDef[] = [
    { headerName: 'PATIENT NAME', field: 'patientName', sortable: true, headerCheckboxSelection: true, checkboxSelection: true, showDisabledCheckboxes: true, minWidth: 250},
    { headerName: 'RESOURCE', field: 'resource', sortable: true, minWidth: 250 },
    { headerName: 'APPT TYPE', field: 'apptType', sortable: true, minWidth: 150 },
    { headerName: 'APPT TIME', field: 'apptTime', cellClass: 'dateISO', sortable: true, minWidth: 150, valueFormatter: this.dateFormatter},
    { headerName: 'STATUS', field: 'status', sortable: true, minWidth: 300 },
    { headerName: 'WAIT', field: 'wait', sortable: true, minWidth: 150 }
  ];

  //format data configuration
  excelStyles: any = [
    {
        id: 'dateISO',
        dataType: 'DateTime',
        numberFormat: {
            format: 'dd/mm/yyy h:mm AM/PM'
        }
    }
  ];

  constructor(private http: HttpClient) {
      // change data from http api
      // this.rowData$ = this.http.get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
      // convert Json format to String input textbox
      this.objRowDataStr = JSON.stringify(this.rowData, undefined, 2);
      this.objColDefsStr= JSON.stringify(this.colDefs, undefined, 2);
      
  }

  // default column configuration
  public defaultColDef: ColDef = {
    resizable: true,
  };

  // date formatting
  public dateFormatter(params: any): string {
    let date = new Date(params.value);
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear().toString();
    let hourNum = date.getHours() % 12;
    let hour = (hourNum === 0 ? 12 : hourNum).toString().padStart(2, '0');
    let min = date.getMinutes().toString().padStart(2, '0');
    let sec = date.getSeconds().toString().padStart(2, '0');
    let amPM = date.getHours() < 12 ? 'AM' : 'PM';
    return ( day +'/' +month +'/' +year +' ' +hour +':' +min +' ' +amPM);
  }
  
  // run when Grid Size event changed
  public onGridSizeChanged(params: GridSizeChangedEvent): void {
    // get the current grids width
    let gridWidth = document.getElementById('grid-wrapper')!.offsetWidth;
    // keep track of which columns to hide/show
    let columnsToShow = [];
    let columnsToHide = [];
    // iterate over all columns (visible or not) and work out
    // now many columns can fit (based on their minWidth)
    let totalColsWidth = 0;
    let allColumns = params.columnApi.getColumns();
    
    if (allColumns && allColumns.length > 0) {
      for (let i = 0; i < allColumns.length; i++) {
        let column = allColumns[i];
        totalColsWidth += column.getMinWidth() || 0;
        if (totalColsWidth > gridWidth) {
          columnsToHide.push(column.getColId());
        } else {
          columnsToShow.push(column.getColId());
        }
      }
    }
    // show/hide columns based on current grid width
    if(this.scrollMode == 'both'){
      params.columnApi.setColumnsVisible(columnsToHide, true);
    } else {
      params.columnApi.setColumnsVisible(columnsToShow, true);
      params.columnApi.setColumnsVisible(columnsToHide, false);
    }

     // fill out any available space to ensure there are no gaps
     params.api.sizeColumnsToFit();
   
  }

  public updateGrid(): void {
    // update patients data from textbox change string to Json format
    this.rowData = JSON.parse(this.objRowDataStr);
    // update grid column definition form textbox change string to Json format
    this.colDefs = JSON.parse(this.objColDefsStr);
  }

}
