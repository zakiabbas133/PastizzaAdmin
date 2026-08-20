import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Chip,
  useTheme,
  alpha,
  TablePagination,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import { commonTokens } from '../theme/tokens';

const Orders = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const orders = [
    { id: 'ORD-10294', customer: 'John Smith', product: 'Product A', amount: '$2,450', status: 'Completed', date: '2024-01-15' },
    { id: 'ORD-10293', customer: 'Sarah Williams', product: 'Product B', amount: '$1,890', status: 'Pending', date: '2024-01-14' },
    { id: 'ORD-10292', customer: 'Michael Brown', product: 'Product C', amount: '$3,210', status: 'Processing', date: '2024-01-13' },
    { id: 'ORD-10291', customer: 'Emily Davis', product: 'Product A', amount: '$1,560', status: 'Completed', date: '2024-01-12' },
    { id: 'ORD-10290', customer: 'David Wilson', product: 'Product D', amount: '$2,890', status: 'Cancelled', date: '2024-01-11' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Processing':
        return 'info';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: commonTokens.spacing.xxl }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: commonTokens.spacing.md }}>
              Orders
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage and track customer orders.
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />}>
            New Order
          </Button>
        </Box>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Box sx={{ marginBottom: commonTokens.spacing.lg, display: 'flex', gap: commonTokens.spacing.md }}>
              <TextField placeholder="Search orders..." size="small" sx={{ flex: 1 }} />
              <TextField type="date" size="small" sx={{ width: '200px' }} />
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                    <TableRow
                      key={order.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{order.amount}</TableCell>
                      <TableCell>
                        <Chip label={order.status} color={getStatusColor(order.status)} variant="outlined" size="small" />
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Button variant="text" size="small">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Orders;
