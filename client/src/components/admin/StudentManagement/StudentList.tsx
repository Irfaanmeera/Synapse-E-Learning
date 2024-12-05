import { useEffect, useState } from 'react';
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { blockStudent, getAllStudents, unblockStudent } from '../../../api/adminApi';
import { User } from '../../../interfaces/User';

const StudentList = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [filteredList, setFilteredList] = useState<User[]>([]);  // List after applying search filter
  const [searchQuery, setSearchQuery] = useState<string>('');  // Search query
  const [currentPage, setCurrentPage] = useState<number>(1);  // Current page for pagination
  const [itemsPerPage] = useState<number>(5);  // Number of items per page

  const getUsers = async () => {
    try {
      const response = await getAllStudents();
      console.log("Response in student list by admin:", response);
      setUserList(response); // Assuming `response.data.students` is the array of students
      setFilteredList(response); // Initialize filteredList with all users
    } catch (error) {
      console.log(error);
    }
  };

  // Handle block action
  const handleBlock = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await blockStudent(id!);
    console.log("Response in block", response);
    if (response) {
      const newList = userList.map((user) =>
        user?.id === id ? { ...user, isBlocked: true } : user
      );
      setUserList(newList);
      setFilteredList(newList); // Update filtered list after block action
    }
  };

  // Handle unblock action
  const handleUnblock = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await unblockStudent(id!);
    if (response) {
      const newList = userList.map((user) =>
        user.id === id ? { ...user, isBlocked: false } : user
      );
      setUserList(newList);
      setFilteredList(newList); // Update filtered list after unblock action
    }
  };

  // Filter students based on search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = userList.filter((user) =>
        user.name.toLowerCase().includes(query)
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(userList);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="rounded-sm  dark:bg-midnightblue dark:text-white border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Students</h4>

      {/* Search Bar */}
      <TextField
        label="Search by Student Name"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3}}
      />

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden", mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow className="bg-bodydark2 ">
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>S.No</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Student</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Email</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Mobile</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Blocked</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((user, index) => (
              <TableRow key={user?.id || index} sx={{
        
                "&:hover": { bgcolor: "grey.200", cursor: "pointer" }, // Add hover effect
              }}>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {index + 1}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {user.name}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {user.email}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {user.mobile}
                </TableCell>
                <TableCell align="center" sx={{ color: user.isBlocked ? "error.main" : "success.main" }}>
                  {user.isBlocked ? "Blocked" : "Active"}
                </TableCell>
                <TableCell align="center">
                  {user.isBlocked ? (
                    <button
                      onClick={(e) => handleUnblock(user.id ?? "", e)}
                      style={{
                        backgroundColor: "#8A99AF",  // Unblock button style
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleBlock(user.id ?? "", e)}
                      style={{
                        backgroundColor: "#1C2434",  // Block button style
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Block
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Pagination
        count={Math.ceil(filteredList.length / itemsPerPage)}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
};

export default StudentList;
