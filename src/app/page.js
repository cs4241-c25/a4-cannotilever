import Image from "next/image";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import theme from './theme';
import {AppBar, CircularProgress, Container, Icon, IconButton, Paper, Toolbar} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(r => r.json())

function inventoryTable() {
    let userId = 1; // TODO: TEMPORARY
    const { data, error, isLoading } = useSWR(`/api/pantry/${userId}`, fetcher)
    if (error) return (
    <ErrorOutlineIcon />
    )
    if (isLoading) return (
        <CircularProgress />
    )
    const paginationModel = { page: 0, pageSize: 15 };

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 15, 20]}
            autoPageSize={true}
            checkboxSelection
            sx={{ border: 2 }}
        />
    )
}

export default function Home() {
  return (
      <theme>
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
          <Paper sx={{ height: 400, width: '100%' }}>
              {inventoryTable()}
          </Paper>
      </theme>

  );
}
