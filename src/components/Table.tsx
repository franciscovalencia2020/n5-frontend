import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';

interface TableProps<T> {
  rows: T[];
  columns: GridColDef[];
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  totalCount: number;
}

const Table = <T,>({ rows, columns, paginationModel, setPaginationModel, totalCount }: TableProps<T>) => (
  <DataGrid
    rows={rows}
    columns={columns}
    pageSizeOptions={[10]}
    paginationModel={paginationModel}
    onPaginationModelChange={setPaginationModel}
    paginationMode="server"
    rowCount={totalCount}
    checkboxSelection
    disableRowSelectionOnClick
    autoHeight
    sx={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f0f4f8', fontSize: '16px', fontWeight: 'bold', borderRight: '1px solid #e0e0e0' },
      '& .MuiDataGrid-cell': { fontSize: '14px', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' },
      '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #e0e0e0' },
    }}
  />
);

export default Table;
