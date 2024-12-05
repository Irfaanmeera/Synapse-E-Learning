import React, { useEffect, useState } from "react";
import { PlayCircle, Globe } from "lucide-react";
import { getEnrolledCourse, addProgression } from "../../../api/studentApi";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import ReactPlayer from "react-player";
import { io, Socket } from "socket.io-client";
import ChatPage from "../../chats/ChatPage"; 
import ModuleContent from "./Module";
import { enrolledCourseActions } from "../../../redux/enrolledCourseSlice";

const SingleEnrolledCourse = () => {
  const user = useSelector((store: RootState) => store.user.user);
  const [activeTab, setActiveTab] = useState("overview");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [currentChapterName, setCurrentChapterName] = useState<string | null>(
    null
  );
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io("http://localhost:4000");
    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const enrolledCourse = await getEnrolledCourse(courseId!);
        setCourse(enrolledCourse);
  
        // Update Redux completedChapters
        if (enrolledCourse?.progression) {
          dispatch(enrolledCourseActions.setCompletedChapters(enrolledCourse.progression));
        }
      } catch (err) {
        setError("Failed to load course. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourse();
  }, [courseId, dispatch]);
  
  const handleVideoSelect = (videoUrl: string, currentChapterName: string) => {
    setCurrentVideoUrl(videoUrl);
    setCurrentChapterName(currentChapterName);
  };

  const handleVideoComplete = async (chapterTitle: string) => {
    if (!course?.id) return;
    try {
      await addProgression(course.id, chapterTitle);
      dispatch(enrolledCourseActions.addChapterToProgression(chapterTitle));
    } catch (err) {
      console.error("Error marking chapter as completed:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex">
      {/* Main Content Area */}
      <div className="flex-1">
        <div
          className="relative bg-gray-blue border-2 border-gray w-11/12 aspect-video"
          style={{
            backgroundImage: currentVideoUrl
              ? "none"
              : `url(${course?.courseId?.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {currentVideoUrl ? (
            <ReactPlayer
              url={currentVideoUrl}
              controls
              width="100%"
              onEnded={() => handleVideoComplete(currentChapterName!)}
              config={{
                file: { attributes: { controlsList: "nodownload" } },
              }}
            />
          ) : (
            <button className="absolute inset-0 m-auto w-20 h-20 text-black opacity-20 hover:opacity-100">
              <PlayCircle className="w-full h-full" />
            </button>
          )}
          {currentChapterName && (
            <div className="absolute mt-2 left-2 text-darkgray font-bold font-serif text-lg px-4 py-1 rounded-md">
              {currentChapterName}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-blue">
          <div className="max-w-5xl mx-auto">
            <div className="flex space-x-8 px-4">
              {["Overview", "Chat Room"].map((tab) => (
                <button
                  key={tab}
                  className={`py-4 px-2 border-b-2 ${
                    activeTab === tab.toLowerCase()
                      ? "border-blue text-blue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto p-6">
          {activeTab === "overview" ? (
            <>
              <h1 className="text-2xl font-medium mb-6">
                {course?.courseId?.name}
              </h1>
              <div className="text-gray-600">
                {course?.courseId?.enrolled} Students
              </div>
            </>
          ) : (
            socket && <ChatPage socket={socket} course={course} />
          )}
        </div>
      </div>

      {/* Course Content Sidebar */}
      <div className="w-100 bg-white border-l border-gray-blue">
        <div className="flex items-center p-4 border-b">
          <h2 className="font-bold">Course content</h2>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {course?.courseId?.modules?.map((module) => (
            <ModuleContent
              key={module.id}
              module={module}
              onVideoSelect={handleVideoSelect}
              onVideoComplete={handleVideoComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleEnrolledCourse;
