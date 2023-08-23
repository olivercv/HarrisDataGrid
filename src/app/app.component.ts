import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ColDef, GridSizeChangedEvent, } from 'ag-grid-community';
import { Observable } from 'rxjs';

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
  wrapperStyles = 'width:100%; height: 30%;';

  // patients json data 
  rowData: any[] = [
    { patientName: 'Francis, Henry', resource: 'Mc Coy Henry', apptType: 'Sick Visit', apptTime: '2020-05-30T10:01:00' , status: 'Ready for Provider 9:26 AM', wait: '00:05' },
    { patientName: 'Murphy, Catrine', resource: 'Mc Coy Henry', apptType: 'Sick Visit', apptTime:'2015-04-21T16:30:00' , status: '', wait: '' },
    { patientName: 'Murphy, Alicia', resource: 'Anna Bates', apptType: 'Sick Visit', apptTime:'2010-02-19T12:02:00' , status: 'Checked in 9:57 AM', wait: '00:05' },
    { patientName: 'Murphy, Alicia', resource: 'Mc Coy Henry', apptType: 'Sick Visit', apptTime:'1995-10-04T03:27:00' , status: '', wait: '' },
    { patientName: 'Francis, Henry', resource: 'Mc Coy Henry', apptType: 'Sick Visit', apptTime:'1995-10-04T03:27:00' , status: 'In Re-schedule Queue', wait: '' },
    { patientName: 'Pandy, Peggy', resource: 'Mc Coy Henry', apptType: 'CQM New', apptTime:'1995-10-04T03:27:00' , status: '', wait: '' },
    { patientName: 'Murphy, Alicia', resource: 'Anna Bates', apptType: 'Sick Visit', apptTime:'1995-10-04T03:27:00' , status: 'Checked in 9:57 AM', wait: '00:05' },
    { patientName: 'Murphy, Alicia', resource: 'Mc Coy Henry', apptType: 'Sick Visit', apptTime:'1995-10-04T03:27:00' , status: '', wait: '' },
    { patientName: 'Murphy, Alicia', resource: 'Anna Bates', apptType: 'Sick Visit', apptTime:'1995-10-04T03:27:00' , status: 'Checked in 9:57 AM', wait: '00:05' },
    { patientName: 'Murphy, Alicia', resource: 'Mc Coy Henry', apptType: 'Sick Visit', apptTime:'1995-10-04T03:27:00' , status: '', wait: '' }
  ];
  // configuration grid json data

  colDefs: ColDef[] = [
    { headerName: 'PATIENT NAME', field: 'patientName', sortable: true, headerCheckboxSelection: true, checkboxSelection: true, showDisabledCheckboxes: true, minWidth: 250},
    { headerName: 'RESOURCE', field: 'resource', sortable: true, minWidth: 250 },
    { headerName: 'APPT TYPE', field: 'apptType', sortable: true, minWidth: 150 },
    { headerName: 'APPT TIME', field: 'apptTime', cellClass: 'dateISO', sortable: true, minWidth: 150, valueFormatter: (params) => {
      var date = new Date(params.value);
      var day = date.getDate().toString().padStart(2, '0');
      var month = (date.getMonth() + 1).toString().padStart(2, '0');
      var year = date.getFullYear().toString();
      var hourNum = date.getHours() % 12;
      var hour = (hourNum === 0 ? 12 : hourNum).toString().padStart(2, '0');
      var min = date.getMinutes().toString().padStart(2, '0');
      var sec = date.getSeconds().toString().padStart(2, '0');
      var amPM = date.getHours() < 12 ? 'AM' : 'PM';
      return ( day +'/' +month +'/' +year +' ' +hour +':' +min +' ' +amPM);
    } },
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
      this.objRowDataStr = JSON.stringify((this.rowData));
      this.objColDefsStr= JSON.stringify((this.colDefs));
      

  }

  // default column configuration
  public defaultColDef: ColDef = {
    resizable: true,
  };


  changeScroll() {
    
    
    
  }
  

  onGridSizeChanged(params: GridSizeChangedEvent) {
    // get the current grids width
    var gridWidth = document.getElementById('grid-wrapper')!.offsetWidth;
    // keep track of which columns to hide/show
    var columnsToShow = [];
    var columnsToHide = [];
    // iterate over all columns (visible or not) and work out
    // now many columns can fit (based on their minWidth)
    var totalColsWidth = 0;
    var allColumns = params.columnApi.getColumns();
    if (allColumns && allColumns.length > 0) {
      for (var i = 0; i < allColumns.length; i++) {
        var column = allColumns[i];
        totalColsWidth += column.getMinWidth() || 0;
        if (totalColsWidth > gridWidth) {
          columnsToHide.push(column.getColId());
        } else {
          columnsToShow.push(column.getColId());
        }
      }
    }
    
    // show/hide columns based on current grid width
    params.columnApi.setColumnsVisible(columnsToShow, true);
    params.columnApi.setColumnsVisible(columnsToHide, false);
    // fill out any available space to ensure there are no gaps
    if(this.scrollMode == 'vertical'){
      params.api.sizeColumnsToFit();
    }
   
  }

  updateGrid() {
    // update patients data from textbox change string to Json format
    this.rowData = JSON.parse(this.objRowDataStr);
    // update grid column definition form textbox change string to Json format
    this.colDefs = JSON.parse(this.objColDefsStr);
  }

}
