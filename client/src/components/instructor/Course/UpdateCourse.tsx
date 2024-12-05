import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { Upload } from 'lucide-react';
import { authorizedAxios } from '../../../api/config';
import { useNavigate, useParams } from 'react-router-dom';
import { Course } from '../../../interfaces/course';

interface Category {
  id: string;
  category: string;
}

const UpdateCourse: React.FC = () => {
  const { courseId } = useParams();
  const [formData, setFormData] = useState<Course>({
    name: '',
    description: '',
    price: 0,
    image: '',
    level: 'Beginner',
    category: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
const navigate = useNavigate()
  useEffect(() => {
    const fetchCategoriesAndCourseData = async () => {
      try {
        const categoriesResponse = await authorizedAxios.get('/categories');
        setCategories(categoriesResponse.data);

        const courseResponse = await authorizedAxios.get(
            `/instructor/course/${courseId}`
          );
        const courseData = courseResponse.data;

        setFormData({
          name: courseData.name,
          description: courseData.description,
          price: courseData.price,
          level: courseData.level,
          category: courseData.category,
          image: courseData.image,
        });

        setThumbnailPreview(courseData.image);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCategoriesAndCourseData();
  }, [courseId]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData({ ...formData, description: content.replace(/<\/?p>/g, '') });
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);

      setFormData(prev => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('level', formData.level);
      formDataToSubmit.append('category', formData.category);
      formDataToSubmit.append('price', String(formData.price));
      if (formData.image instanceof File) {
        formDataToSubmit.append('image', formData.image);
      }

      const response = await authorizedAxios.put(`/instructor/updateCourse/${courseId}`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Update Response:", response)

      setSnackbar({
        open: true,
        message: 'Course updated successfully!',
        severity: 'success',
      });
      navigate('/instructor/courses')
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error updating course. Please try again.',
        severity: 'error',
      });

       console.log("Update error", error.response?.data?.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Update Course
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Course Description
              </Typography>
              <Editor
                apiKey="cpfnjdzxy2x3skaeme2548vxjpeqm5khbh4b3keov8u4eni9"
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
                  ],
                  toolbar:
                    'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                }}
                value={formData.description}
                onEditorChange={handleEditorChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Level</InputLabel>
                <Select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  label="Level"
                  disabled={loading}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advance">Advance</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="thumbnail-upload"
                type="file"
                onChange={handleThumbnailChange}
                disabled={loading}
              />
              <label htmlFor="thumbnail-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Upload />}
                  disabled={loading}
                >
                  Upload Course Image
                </Button>
              </label>

              {thumbnailPreview && (
                <Box mt={2}>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    style={{ maxWidth: '300px', maxHeight: '200px' }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Updating Course...' : 'Update Course'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateCourse;

