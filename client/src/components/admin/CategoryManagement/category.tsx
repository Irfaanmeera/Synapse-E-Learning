import React, { useEffect, useState } from "react";
import {Pagination,Table,TableBody, TableCell,TableContainer,TableHead,TableRow,Paper,TextField,Button,Modal,Box} from "@mui/material";
import {fetchCategories,addCategory,editCategory,listCategory,unlistCategory} from "../../../api/adminApi"; // Replace with actual API imports
import { Category } from "../../../interfaces/Category"; // Define Category interface for type safety
import toast from "react-hot-toast";
import { EditIcon } from "lucide-react";

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState<string>("");

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        setOriginalCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategoriesData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      const filtered = categories.filter((category) =>
        category.category.toLowerCase().includes(query)
      );
      setCategories(filtered);
    } else {
      setCategories(originalCategories);
    }
  };

  const handleAddCategory = async () => {
    try {
      const newCategory = await addCategory(newCategoryName); // Get the category object returned from the API
      console.log();
      setCategories((prevCategories) => [...prevCategories, newCategory]); // Add the newly added category to the list
      setOpenModal(false); // Close the modal
      setNewCategoryName(""); // Clear the input field for the new category
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleEditCategory = async () => {
    if (editingCategoryId) {
      try {
        // Make sure you're sending just the category name (a string) in the API request
        await editCategory(editingCategoryId, editingCategoryName);

        // Update the local categories list with the new category name
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === editingCategoryId
              ? { ...category, category: editingCategoryName } // Update the 'category' field in the object
              : category
          )
        );

        // Reset the editing state after successful update
        setEditingCategoryId(null);
        setEditingCategoryName("");
      } catch (error) {
        console.error("Failed to update category:", error);
      }
    }
  };

  // Handle listing a category
  const handleListCategory = async (
    id: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const response = await listCategory(id);
      if (response) {
        const updatedCategories = categories.map((category) =>
          category.id === id ? { ...category, status: true } : category
        );
        setCategories(updatedCategories);
        // Update filtered list
        toast.success("Category listed successfully!");
      }
    } catch (error) {
      console.error("Failed to list category:", error);
    }
  };

  // Handle unlisting a category
  const handleUnlistCategory = async (
    id: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const response = await unlistCategory(id);
      if (response) {
        const updatedCategories = categories.map((category) =>
          category.id === id ? { ...category, status: false } : category
        );
        setCategories(updatedCategories);
        toast.success("Category unlisted successfully!");
      }
    } catch (error) {
      console.error("Failed to unlist category:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <h4 className="mb-4 text-xl font-semibold text-black">Categories</h4>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "47px",
        }}
      >
        {/* Search Field */}
        <TextField
          label="Search Categories"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ mb: 3 }} // flexGrow makes the TextField take up available space
        />

        {/* Add Category Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{ mb: 2 }}
        >
          Add Category
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-bodydark2">
              <TableCell
                align="left"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                S.No
              </TableCell>
              <TableCell
                align="left"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Category Name
              </TableCell>
              <TableCell
                align="left"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Status
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Actions
              </TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentCategories.map((category, index) => (
              <TableRow
                key={category.id}
                sx={{
                  "&:hover": { bgcolor: "grey.200", cursor: "pointer" }, // Add hover effect
                }}
              >
                <TableCell align="left">
                  {index + 1 + indexOfFirstItem}
                </TableCell>
                <TableCell align="left">{category.category}</TableCell>
                <TableCell align="left">
                  {category.status ? "Listed" : "Unlisted"}
                </TableCell>
                <TableCell align="left">
                  <Button
                    onClick={() => {
                      setEditingCategoryId(category?.id);
                      setEditingCategoryName(category.category); // Prefill the category name
                    }}
                  >
                    <EditIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  {category.status ? (
                    <button
                      onClick={(e) => handleUnlistCategory(category.id, e)}
                      style={{
                        backgroundColor: "#1C2434", // Unblock button style
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Unlist
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleListCategory(category.id, e)}
                      style={{
                        backgroundColor: "#8A99AF", // Block button style
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      List
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(categories.length / itemsPerPage)}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      />

      {/* Add Category Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            padding: 3,
            backgroundColor: "white",
            borderRadius: 2,
            maxWidth: 400,
            margin: "auto",
            marginTop: "20%",
          }}
        >
          <h3>Add New Category</h3>
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
          >
            Add Category
          </Button>
        </Box>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        open={Boolean(editingCategoryId)}
        onClose={() => setEditingCategoryId(null)}
      >
        <Box
          sx={{
            padding: 3,
            backgroundColor: "white",
            borderRadius: 2,
            maxWidth: 400,
            margin: "auto",
            marginTop: "20%",
          }}
        >
          <h3>Edit Category</h3>
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={editingCategoryName}
            onChange={(e) => setEditingCategoryName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditCategory}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminCategories;
