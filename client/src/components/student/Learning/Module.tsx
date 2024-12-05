import React, { useEffect, useState } from 'react';
import { PlayCircle, ChevronDown, FileText } from 'lucide-react';
import { Module } from '../../../interfaces/module';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Checkbox } from '@mui/material';

interface Chapter {
  title: string;
  description: string;
  videoUrl: string;
  completed?: boolean; 
}

interface ModuleProps {
  module: Module;
  onVideoSelect: (videoUrl: string,ChapterTitle:string) => void;
  onVideoComplete: (ChapterTitle: string) => void;
  

}

const ModuleContent: React.FC<ModuleProps> = ({ module,onVideoSelect,onVideoComplete,}) => {
  const completedChapters = useSelector((state: RootState) => state.enrolledCourse.completedChapters);
 
  console.log("completed chapters", completedChapters)
  console.log("Module Component/:" ,module.module)
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);

  const handleCheckboxChange = (chapterTitle: string) => {
    
    onVideoComplete(chapterTitle);
  };
  useEffect(() => {

  }, [completedChapters]);



  return (
    <div className="border-b ">
      {/* Module Header */}
      <div className='bg-gray-blue'>
      <button
        className="w-full px-4 py-2 flex justify-between items-center hover:bg-gray"
        onClick={toggleExpand}
      >
        <div className="text-left">
          <div className="text-base font-serif">{module?.module?.name}</div>
          <div className="text-sm font-serif text-darkbrown">
           {module?.module?.chapters?.length} Chapters 
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 transform transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      </div>

      {/* Chapter Details */}
      {expanded && (
        <div >
          {module?.module?.chapters?.map((chapter) => (
            <div
              key={chapter.title}
              className="flex items-center px-4 py-1 hover:bg-gray border border-gray border-opacity-75  cursor-pointer"
              onClick={() => onVideoSelect(chapter.videoUrl,chapter.title)}
            >
             <Checkbox
      checked={completedChapters.includes(chapter.title)}
      disabled
      // onChange={() => handleCheckboxChange(chapter.title)}
      sx={{
        color: 'gray', 
        '&.Mui-checked': {
          color: 'gray', 
        },
     
      }}
    />
              <div className="flex-1">
                <div className="flex items-center ">
                  {chapter.videoUrl ? (
                    <PlayCircle className="w-4 h-4 mr-2 text-slategray" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2 text-slategray" />
                  )}
                  <span className="text-sm font-serif  text-slategray">{chapter.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleContent;
