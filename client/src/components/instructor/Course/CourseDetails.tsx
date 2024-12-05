/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Module } from "../../../interfaces/module";
import { Course } from "../../../interfaces/course";
import {
  addChapter,
  createModule,
  deleteCourse,
  listCourse,
} from "../../../api/instructorApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Modal,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { authorizedAxios } from "../../../api/config";
import {  EditIcon, SidebarCloseIcon } from "lucide-react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactPlayer from "react-player";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import toast from "react-hot-toast";


// CourseDetails component
const CourseDetails = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [newModuleName, setNewModuleName] = useState("");
  const [newChapterName, setNewChapterName] = useState("");
  const [newChapterVideoFile, setNewChapterVideoFile] = useState<File | null>(
    null
  );
  const [newChapterDescription, setNewChapterDescription] = useState("");
  const [newChapterContent, setNewChapterContent] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState({});
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [isListed, setIsListed] = useState(true); // Track whether the course is listed

  const toggleCourseStatus = async () => {
    try {
      console.log(courseId)
      if (isListed) {
        // Unlist the course
        await deleteCourse(courseId);
        toast.success(`Course ${course!.name} unlisted successfully`)
      } else {
        // Re-list the course if you have a separate endpoint for listing
        await listCourse(courseId);
        toast.success(`Course ${course!.name} listed successfully`)
      }
      // Toggle local state
      setIsListed((prevStatus) => !prevStatus);
    } catch (error) {
      console.error("Failed to toggle course status:", error);
    }
  };
  const navigate = useNavigate()

  const goToUpdateCoursePage = () => {
    // Replace `courseId` with the actual ID of the course
    navigate(`/instructor/updateCourse/${courseId}`);
  };
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const { data } = await authorizedAxios.get(
          `/instructor/course/${courseId}`
        );
        console.log("fetch course detials", data.modules);
        const extractedModules = data.modules.map((item) => ({
          id: item._id,
          moduleId: item.module.id, // Module ID
          name: item.module.name, // Module Name
          order: item.order, // Order
          status: item.module.status, // Status
          createdAt: item.module.createdAt, // Created At
          chapters: item.module.chapters || [], // Chapters (default to empty array if none)
        }));

        console.log(extractedModules, "emo");
        setCourse(data);
        setModules(extractedModules);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleAddModule = async () => {
    if (!newModuleName) return;

    const moduleData = {
      name: newModuleName,
      courseId: courseId,
    };

    try {
      const createdModule = await createModule(moduleData);
      setModules((prevModules) => [...prevModules, createdModule]);
      setNewModuleName("");
      setIsAddModuleModalOpen(false);
    } catch (error) {
      console.error("Failed to add module:", error);
    }
  };
  //
  const handleAddChapter = async () => {
    if (!newChapterName || !selectedModuleId) return;
  
    const chapterData = {
      title: newChapterName,
      description: newChapterDescription,
      content: newChapterContent || '', // Optional field
    };
  
    try {
      // Call addChapter function to create a new chapter
      const newChapter = await addChapter(
        selectedModuleId,
        chapterData,
        newChapterVideoFile || null, // Optional video file
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      );
  
      // Update modules state to reflect new chapter immediately
      setModules((prevModules) => {
        const updatedModules = prevModules.map((module) => {
          if (module.moduleId === selectedModuleId) {
            return {
              ...module, // spread module to ensure new reference
              chapters: [...(module.chapters || []), newChapter] // add new chapter with a new array reference
            };
          }
          return module;
        });
        console.log("Updated Modules:", updatedModules); // Debugging line to check updated modules
        return updatedModules; // Return new array to trigger re-render
      });
  
      // Reset form fields and close modal
      setNewChapterName("");
      setNewChapterDescription("");
      setNewChapterContent("");
      setNewChapterVideoFile(null);
      setUploadProgress(0);
      setIsAddChapterModalOpen((prev) => ({
        ...prev,
        [selectedModuleId]: false,
      }));
      setSelectedModuleId(null); // Clear selected module ID
  
    } catch (error) {
      console.error("Failed to add chapter:", error);
    }
  };
  
  

  const openAddChapterModal = (moduleId) => {
    setIsAddChapterModalOpen((prev) => ({ ...prev, [moduleId]: true }));
    setSelectedModuleId(moduleId); // Set selected module when opening the modal
  };

  // const handleDeleteCourse = async () => {
  //   try {
  //     const deletedCourse = await deleteCourse(courseId);
  //     console.log('Deleted course:', deletedCourse);
  //     alert('Course deleted successfully!');
  //   } catch (error: any) {
  //     alert(error.message);
  //   }
  // };

  useEffect(() => {
    const moduleId = modules.map((module) => module.moduleId);
    console.log("Modules state:", moduleId);
  }, [modules]);

  //

  //

  return (
    <div className="p-4">
       <Breadcrumb pageName={`Courses / ${course?.name}`} />

      <Card className="max-w-5xl ml-4 shadow-md">
        <CardContent className="flex items-center justify-between">
          <div>
            <Typography variant="h6" className="font-bold">
              {course?.name || "Course Name Not Available"}
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mt-2">
              {course?.description || "Course description not available."}
            </Typography>
            <div className="mt-4 space-y-1">
              <Typography variant="subtitle1" color="textSecondary">
                Level: {course?.level || "N/A"}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Price: ${course?.price || "0"}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Category: {course?.category?.category || "N/A"}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Approval:{" "}
                <span
                  style={{
                    color:
                      course?.approval === "Approved"
                        ? "green"
                        : course?.approval === "Pending"
                        ? "red"
                        : "inherit",
                  }}
                >
                  {course?.approval || "N/A"}
                </span>
              </Typography>
            </div>
          </div>

          <CardMedia
            component="img"
            image={course?.image || "default-course-image.jpg"}
            alt={course?.name || "Course Image"}
            className="-mt-17"
            sx={{
              height: 120,
              width: 200,
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        </CardContent>

        {/* <div className="flex justify-end -mt-14 mb-4 mr-4">
          <Button
            startIcon={<EditIcon />}
            variant="contained"
            sx={{
              backgroundColor: "#1E3A8A",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#1E40AF" },
            }}
            onClick={goToUpdateCoursePage} 
          >
            Edit Course
          </Button>
        </div> */}
        <div className="flex justify-end -mt-14 mb-4 mr-4 space-x-2"> 
  <Button
    startIcon={<EditIcon />}
    variant="contained"
    sx={{
      backgroundColor: "#1E3A8A",
      color: "#ffffff",
      "&:hover": { backgroundColor: "#1E40AF" },
    }}
    onClick={goToUpdateCoursePage} 
  >
    Edit Course
  </Button>

  <Button
    // startIcon={isListed ? <DeleteIcon /> : <AddIcon />} // Icon based on listing status
    variant="contained"
    color={isListed ? "primary" : "info"} // Color based on listing status
    onClick={toggleCourseStatus}
  >
    {isListed ? "Unlist Course" : "List Course"} {/* Toggle button text */}
  </Button>
</div>
       
      </Card>

      <div className="mt-8 ml-4">
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom:"25px" }}>
    <Typography variant="h6" className="font-bold mb-4 pl-4">
      Modules
    </Typography>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => setIsAddModuleModalOpen(true)}
      sx={{backgroundColor:"#6575E7"}}
    >
      Add Module
    </Button>
  </div>
  {modules?.map((moduleData) => (
    <Accordion key={moduleData.moduleId} className="mb-4" elevation={0} sx={{ boxShadow: 'none' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`module-${moduleData.moduleId}-content`}
        id={`module-${moduleData.moduleId}-header`}
        sx={{
          backgroundColor: "#F7F9FA",
          border: '1px solid #D3D3D3',  // Light gray border
          borderRadius: '4px',         // Optional: rounded corners
          boxShadow: 'none',
        }}
      >
        <Typography variant="inherit" className="text-graydark">
          {moduleData?.name || "Module Name Not Available"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
      <Box display="flex" justifyContent="flex-end" mb={2}>
    <Button
      variant="outlined"
      color="primary"
      startIcon={<AddIcon />}
      onClick={() => openAddChapterModal(moduleData.moduleId)}
      sx={{color:"#6575E7"}}
    >
      Add Chapter
    </Button>
  </Box>
        <div className="mt-2">
          {moduleData.chapters && moduleData.chapters.length > 0 ? (
            moduleData.chapters.map((chapter) => (
              <Accordion key={chapter.title} className="mt-2 ml-5" elevation={0} sx={{ boxShadow: 'none' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}  sx={{
          
            border: '1px solid #D3D3D3',  // Light gray border
            borderRadius: '4px',         // Optional: rounded corners
            boxShadow: 'none',
          }} >
                  <Typography className="text-midnightblue">{chapter.title}</Typography>
                </AccordionSummary>
                <AccordionDetails className="text-body">
                  {/* Chapter Content */}
                  <Typography>
                    {chapter.videoUrl ? (
                      <div>
                        <Typography>
                          Video:
                        </Typography>
                        
                        <ReactPlayer
  url={chapter.videoUrl} 
  controls
  width="100%"
  height="100%"
  config={{
    file: {
      attributes: {
        controlsList: 'nodownload' // Optional: disables download button
      },
      forceVideo: true // Forces ReactPlayer to use HTML5 video
    }
  }}
/>
                      </div>
                    ) : (
                      <Typography>
                        Video: N/A
                      </Typography>
                    )}
                  </Typography>
                  <Typography>
                    Content: {chapter.content || "N/A"}
                  </Typography>
                  <Typography>
                    Description: {chapter.description || "No description"}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography className="text-gray-500">
              No chapters available
            </Typography>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  ))}
</div>


      <Modal
        open={isAddModuleModalOpen}
        onClose={() => setIsAddModuleModalOpen(false)}
      >
        <div className="p-6 bg-white shadow-lg rounded-lg mx-auto max-w-sm mt-24">
          <Typography variant="h6" className="font-semibold">
            Add New Module
          </Typography>
          <TextField
            fullWidth
            label="Module Name"
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            className="mt-4"
          />
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsAddModuleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddModule}
            >
              Add Module
            </Button>
          </div>
        </div>
      </Modal>

      {modules.map((module) => (
        <div key={module.moduleId}>
          <Typography variant="h6"></Typography>
          <Button
            variant="contained"
            color="transparent"
            sx={{ display: 'none' }}
            onClick={() => openAddChapterModal(module.moduleId)}
          ></Button>

          <Modal
            open={isAddChapterModalOpen[module.moduleId] || false}
            onClose={() =>
              setIsAddChapterModalOpen((prev) => ({
                ...prev,
                [module.moduleId]: false,
              }))
            }
          >
            <div className="p-6 bg-white shadow-lg rounded-lg mx-auto max-w-sm mt-24">
              <IconButton
                style={{ position: "absolute", top: 10, right: 10 }}
                onClick={() =>
                  setIsAddChapterModalOpen((prev) => ({
                    ...prev,
                    [module.moduleId]: false,
                  }))
                }
              >
                <SidebarCloseIcon />
              </IconButton>
              <Typography variant="h6">Add Chapter</Typography>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                style={{ marginBottom: "15px" ,marginLeft:"10px", color:"blueviolet"}}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={newChapterDescription}
                onChange={(e) => setNewChapterDescription(e.target.value)}
                style={{ marginBottom: "15px" ,marginLeft:"10px", color:"blueviolet"}}
              />
              <TextField
                label="Content"
                variant="outlined"
                fullWidth
                value={newChapterContent}
                onChange={(e) => setNewChapterContent(e.target.value)}
                style={{ marginBottom: "15px" ,marginLeft:"10px", color:"blueviolet"}}
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setNewChapterVideoFile(e.target.files?.[0] || null)
                }
                style={{ marginBottom: "15px" }}
              />
              {uploadProgress > 0 && (
                <Typography variant="body2" color="textSecondary">
                  Upload Progress: {uploadProgress}%
                </Typography>
              )}
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setIsAddChapterModalOpen((prev) => ({
                      ...prev,
                      [module.moduleId]: false,
                    }));
                    setSelectedModuleId(null); // Clear selected module on close
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddChapter()}
                >
                  Add Chapter
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      ))}
    </div>
  );
};

export default CourseDetails;
