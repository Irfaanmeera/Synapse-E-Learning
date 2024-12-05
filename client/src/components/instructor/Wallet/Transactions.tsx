import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { RootState } from '../../../redux/store';

const WalletTransactions = () => {
  const user = useSelector((store: RootState) => store.user.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState("date"); // Options: "date", "amount"
  const [searchQuery, setSearchQuery] = useState(""); // Search for description
  const itemsPerPage = 5;

  const walletTransactions = user?.walletHistory || [];

  // Filter transactions based on search query (by description)
  const filteredTransactions = walletTransactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered transactions based on selected criteria
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortCriteria === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortCriteria === "amount") {
      return b.amount - a.amount;
    }
    return 0;
  });

  // Pagination calculations
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = sortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(date));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
     <div className="flex items-center justify-between mb-6  text-slategray">
  <h4 className="text-xl font-semibold text-slategray dark:text-white">Wallet Transactions</h4>
  <h4 className="text-base font-sans text-black dark:text-white">Total Amount: ₹ {Math.floor(user.wallet)}</h4>
</div>
      {/* Search and Sorting Controls */}
      <div className="mb-4 flex gap-4 items-center">
        <TextField
          label="Search by Description"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="amount">Amount</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden", mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow className='bg-bodydark2'>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>S.No</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Description</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTransactions.map((transaction, index) => (
              <TableRow key={transaction._id} sx={{ "&:nth-of-type(even)": { bgcolor: "grey.100" } }}>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {indexOfFirstTransaction + index + 1}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {transaction.description}
                </TableCell>
                <TableCell align="center" sx={{ color: "success.main", fontWeight: "medium" }}>
                  ${transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default WalletTransactions;
