'use client'
import Box from '@mui/material/Box';
import * as React from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import CssBaseline from '@mui/material/CssBaseline';
import {
    AppBar,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid2,
    MenuItem,
    Paper,
    TextField,
    Toolbar
} from "@mui/material";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import theme from './theme';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {DataGrid} from '@mui/x-data-grid';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import useSWR from 'swr';
import {ThemeProvider} from "@mui/material/styles";

const fetcher = url => fetch(url).then(r => r.json())

const userId = '65d1f9c6e1d3a3b4c2d9a001'; // TODO: TEMPORARY


function inventoryTable() {
    const { data, error, isLoading } = useSWR(`/api/pantry/${userId}/view`, fetcher)
    if (error) return (
        <Box justifyContent={'center'} alignItems={'center'}>
            <ErrorOutlineIcon />
        </Box>
    )
    if (isLoading) return (
        <Box justifyContent={'center'} alignItems={'center'}>
            <CircularProgress />
        </Box>
    )
    const paginationModel = { page: 0, pageSize: 15 };
    const columns = [
        { field: 'name', headerName: 'Item Name', minWidth: 120, flex: 1 },
        { field: 'category', headerName: 'Category', minWidth: 100, flex: 1},
        {
            field: 'purchase_date',
            headerName: 'Date Purchased',
            type: 'date',
            minWidth: 90,
            flex: 1,
            valueGetter: (value) => new Date(value), // Convert to Date
        },
        {
            field: 'isSafe',
            headerName: 'Safe to use',
            description: 'This column presents weather the item is safe to use or not based on category and purchase date',
            minWidth: 70,
            flex: 1,
            type: 'boolean',
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            minWidth: 70,
            flex: 1,
            renderCell: (params) => (
                <Grid2 container spacing={2} alignItems={'center'} justifyContent={'center'}>
                    <Grid2 size='auto'>
                        <button onClick={() => handleEdit(params.row)}>
                            <EditIcon />
                        </button>
                    </Grid2>
                    <Grid2 size='auto'>
                        <button onClick={() => handleDelete(params.row)}>
                            <DeleteOutlinedIcon />
                        </button>
                    </Grid2>
                </Grid2>
            ),
        }
    ];
    const rows = data.map((item) => ({
        id: item._id,
        name: item.name,
        category: item.category,
        purchase_date: item.purchase_date,
        isSafe: item.safe,
    }));
    return (
        <DataGrid
            rows={rows}
            columns={columns}
            density={'comfortable'}
            // autosizeOnMount={true}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 15, 20]}
            disableRowSelectionOnClick
        />
    )
}

function handleEdit(row) {
    console.log("Edit row:", row)
}
async function handleDelete(row) {
    console.log("Delete row:", row)
    const response = fetch(`/api/pantry/${userId}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: row.id })
    });
}


export default function Home() {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme/>
          <Box sx={{ flexGrow: 1 }}>
              <AppBar position="static">
                  <Toolbar>
                      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                          Kitchen Inventory Manager
                      </Typography>
                      <Button color="inherit">Login</Button>
                  </Toolbar>
              </AppBar>
          </Box>

          <Box justifyContent={'center'} alignItems={'center'} sx={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
              <Paper elevation={2} sx={{ width: '85%' }}>
                  {inventoryTable()}
              </Paper>
          </Box>
            <Box justifyContent={'center'} alignItems={'center'} sx={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                <Fab size="large" color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 10, right: 10 }} onClick={handleClickOpen}>
                    <AddIcon />
                </Fab>
            </Box>
          <Dialog
              open={open}
              onClose={handleClose}
              slotProps={{
                  paper: {
                      component: 'form',
                      onSubmit: (event) => {
                          event.preventDefault();
                          const formData = new FormData(event.currentTarget);
                          const formJson = Object.fromEntries(formData.entries());
                          console.log(formJson);
                          // POST to api endpoint
                          const response = fetch(`/api/pantry/${userId}/add`, {
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'application/json'
                              },
                              body: JSON.stringify(formJson)
                          });
                          if (response.ok) {
                              console.log("Item added successfully");
                          }
                          handleClose();
                      },
                  },
              }}
          >
              <DialogTitle>Add New Item</DialogTitle>
              <DialogContent>
                  <DialogContentText>
                      Input the information for your new pantry item.
                  </DialogContentText>
                  <Box marginBottom={2}>
                  <TextField
                      autoFocus
                      required
                      margin="cozy"
                      id="name"
                      name="itemname"
                      label="Item Name"
                      type="text"
                      fullWidth
                      variant="standard"
                  />
                  </Box>
                  <Box marginBottom={2}>
                  <TextField
                      required
                      margin="cozy"
                        id="category"
                        name="category"
                        label="Category"
                        select
                        fullWidth
                      >
                      <MenuItem value="Fruit">Fruit</MenuItem>
                      <MenuItem value="Vegetable">Vegetable</MenuItem>
                      <MenuItem value="Meat">Meat</MenuItem>
                      <MenuItem value="Dairy">Dairy</MenuItem>
                      <MenuItem value="Grain">Grain</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                  </Box>
                  <Box marginBottom={2}>
                    <TextField
                        required
                        margin="cozy"
                        id="purchase_date"
                        name="purchase_date"
                        label="Purchase Date"
                        type="date"
                        fullWidth
                        variant="standard"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Box>

              </DialogContent>
              <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit">Submit</Button>
              </DialogActions>
          </Dialog>

      </ThemeProvider>

  );
}
