import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


// interface CourseContentProps {
//     course: Course | undefined;
// }

const CourseContent: React.FC = ({ course }) => {

    console.log("Course content student", course?.modules?.map(item => item?.module?.chapters));

    return (
        <div className="mt-8 ml-4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: "25px" }}>
                <Typography variant="h6" className="font-bold mb-4 pl-2">
                    Course Content
                </Typography>
            </div>
            {course?.modules?.map((moduleData) => (
    <Accordion key={moduleData.module.id}  elevation={0} sx={{ boxShadow: 'none' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`module-${moduleData.module.id}-content`}
        id={`module-${moduleData.module.id}-header`}
        sx={{
            backgroundColor: "#F7F9FA",
            border: '1px solid #D3D3D3',  
            borderRadius: '4px',         
            boxShadow: 'none',
          }}
      >
        <Typography variant="inherit" className="text-graydark ">
          {moduleData?.module.name || "Module Name Not Available"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        
        <div>
          {moduleData?.module?.chapters && moduleData.module.chapters.length > 0 ? (
            moduleData.module.chapters.map((chapter) => (
              <Accordion key={chapter.title}  elevation={0} sx={{ boxShadow: 'none' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className="text-midnightblue">{chapter.title}</Typography>
                </AccordionSummary>
                <AccordionDetails className="text-body">
                 
                  <Typography className="mb-4">
                   {chapter.description || "No description"}
                  </Typography> 
                  <Typography sx={{ marginTop: '16px' }}>
                   {chapter.content || "No description"}
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
    );
};

export default CourseContent;
