import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry, Theme, themeQuartz } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-table',
  imports: [AgGridAngular],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table {
  // Row Data: The data to be displayed.
  rowData = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
  ];

  theme: Theme | "legacy" = myTheme;
}

const myTheme = themeQuartz.withParams({
  backgroundColor: "hsl(243, 23%, 24%)",
  foregroundColor: "hsl(250, 6%, 84%)",
  headerTextColor: "hsl(250, 6%, 84%)",
  headerBackgroundColor: "hsl(243, 27%, 20%)",
  oddRowBackgroundColor: "rgb(0, 0, 0, 0.03)",
  headerColumnResizeHandleColor: "rgb(126, 46, 132)",
});
