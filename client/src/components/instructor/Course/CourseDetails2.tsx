// import { useLocation } from "react-router-dom";
// import { useEffect, useState, useRef } from "react";
// import { Module } from '../../../interfaces/module';
// import { Course } from '../../../interfaces/course';
// import { addChapter, createModule, fetchSingleCourseDetails } from '../../../api/instructorApi';



// interface ModuleFormData {
//   moduleName: string;
//   moduleDescription: string;
//   videoFile: File | null;
// }

// const CourseOverview = () => {
//   const location = useLocation();
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [course, setCourse] = useState<Course>();
//   const [enrollments, setEnrollments] = useState<EnrolledCourse[]>();
//   const [showPopup, setShowPopup] = useState<boolean>(false);
//   const [updating, setUpdating] = useState(false);
//   const [err, setErr] = useState("");
//   const [selectedTime, setSelectedTime] = useState<number>(0);
//   const [chapter, setChapter] = useState<string>("");
//   const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       try {
//         const { data } = await authorizedAxios.get(`/instructor/course/${courseId}`);
//         console.log(data.modules)
//         setCourse(data);
//         setModules(data.modules || []);
//       } catch (error) {
//         console.error('Error fetching course details:', error);
//       }
//     };

//     fetchCourseDetails();
//   }, [courseId]);

//   const handleAddModule = async () => {
//     if (!newModuleName) return;

//     const moduleData = {
//       name: newModuleName,
//       courseId: courseId,
//     };

//     try {
//       const createdModule = await createModule(moduleData);
//       setModules((prevModules) => [...prevModules, createdModule]);
//       setNewModuleName('');
//       setIsAddModuleModalOpen(false);
//     } catch (error) {
//       console.error('Failed to add module:', error);
//     }
//   };


//   const handleAddChapter = async () => {
//     console.log(chapter, "mo");
//     if (currentModuleId && chapter.trim() !== "") {
//       const formData = new FormData();
//       formData.append("chapter", chapter.trim());
//       formData.append("time", selectedTime?.toString() || "");
//       formData.append("moduleId", currentModuleId);
//       try {
//         console.log([...formData.entries()], "data");
//         await addChapter(formData);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

 
//   const handleAddModuleClick = () => {
//     setShowPopup(true);
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//   };

//   const handleAddModuleSubmit = async (moduleData: ModuleFormData) => {
//     try {
//       const formData = new FormData();
//       formData.append("name", moduleData.moduleName);
//       formData.append("description", moduleData.moduleDescription);
//       formData.append("file", moduleData.videoFile!);
//       formData.append("courseId", location.state.courseId);
//       const response = await createModule(formData);
//       if (response) {
//         const updatedCourse = { ...response };
//         setCourse(updatedCourse);
//         return { success: true };
//       } else {
//         return { success: false };
//       }
//     } catch (error) {
//       return { success: false };
//     }
//   };

//   const handleClick = (moduleId: string) => {
//     setCurrentModuleId(moduleId);
//     const modal = document.getElementById(
//       "my_modal_5"
//     ) as HTMLDialogElement | null;
//     if (modal) {
//       modal.showModal();
//     }
//   };

//   const handleImageUploadClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files && event.target.files[0];
//     if (file) {
//       try {
//         const formData = new FormData();
//         formData.append("image", file);
//         console.log(file, "file");

//         formData.append("courseId", location.state.courseId);
//         setUpdating(true);
//         const response = await addCourseImage(formData);
//         if (response) {
//           setUpdating(false);
//           setCourse({ ...response });
//         }
//       } catch (error) {
//         setErr("Fail to update image");
//         setTimeout(() => {
//           setErr("");
//         }, 1000);
//       }
//     }
//   };

//   useEffect(() => {
//     getCourse();
//   }, []);
//   return (
//     <>
//       <div className="pt-32 p-6 flex justify-center bg-slate-100 text-black">
//         <div className="p-6 shadow-lg container grid grid-cols-1 md:grid-cols-3 bg-white">
//           <div className="px-8 md:max-w-[300px]  flex justify-center items-center">
//             {course?.image ? (
//               <img src={course.image} alt="" />
//             ) : (
//               <div
//                 className="bg-cover w-full justify-center items-center flex  h-[200px] bg-slate-200"
//                 onClick={handleImageUploadClick}
//               >
//                 {updating ? (
//                   <div
//                     className="w-12 h-12 rounded-full animate-spin
//                       border-8 border-solid border-blue-700 border-t-transparent"
//                   ></div>
//                 ) : (
//                   <h1 className="font-semibold">Upload image</h1>
//                 )}

//                 {err && <h1 className="font-semibold text-red-700">{err}</h1>}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   ref={fileInputRef}
//                   style={{ display: "none" }}
//                   onChange={handleFileChange}
//                 />
//               </div>
//             )}
//           </div>
//           <div className="col-span-2">
//             <h1 className="font-bold text-2xl">{course?.name}</h1>
//             <h5 className="font-semibold text-sm italic text-slate-600 pt-2">
//               <i className="fa-solid fa-rectangle-list text-base px-2"></i>
//               {typeof course?.category === "object"
//                 ? course.category.category
//                 : course?.category}
//             </h5>
//             <h5 className="font-semibold text-sm italic text-slate-600 pb-2">
//               <i className="fa-solid fa-language text-base px-2"></i>
//               {typeof course?.language === "object"
//                 ? course.language.language
//                 : course?.language}
//             </h5>
//             {course?.approval === "approved" && (
//               <h4 className="text-base font-semibold text-green-600">
//                 Approved
//               </h4>
//             )}
//             {course?.approval === "rejected" && (
//               <h4 className="text-base font-semibold text-red-600">Rejected</h4>
//             )}
//             {course?.approval === "pending" && (
//               <h4 className="text-base font-semibold text-blue-600">Pending</h4>
//             )}

//             <h2 className="font-bold">
//               {"₹ "}
//               {course?.price}
//             </h2>
//           </div>
//         </div>
//       </div>
//       <div className="pt-1 p-6 flex justify-center bg-slate-100 text-black">
//         <div className="p-6 shadow-lg container bg-white">
//           <div className="w-full flex justify-between px-3">
//             <h1 className="font-bold text-lg">Modules</h1>

//             <button
//               className="bg-green-700 text-white font-semibold px-4 py-1 rounded-t-sm shadow-lg"
//               onClick={handleAddModuleClick}
//             >
//               Add module
//             </button>

//             {showPopup && (
//               <AddModulePopup
//                 onClose={handleClosePopup}
//                 onSubmit={handleAddModuleSubmit}
//               />
//             )}
//           </div>
//           <div id="modal-root"></div>
//           {course?.modules && course?.modules?.length > 0 ? (
//             <div className="py-5">
//               {course.modules.map((module, index) => (
//                 <div key={index} className="w-full">
//                   <div className="icon flex justify-between items-center px-3 mb-3">
//                     <div>
//                       <i className="fa-regular fa-circle-play px-2"></i>
//                       <span className="px-2 font-semibold">
//                         {typeof module?.module === "object"
//                           ? module.module.name
//                           : module?.module}
//                       </span>
//                     </div>
//                     <div className="flex justify-end">
//                       <h4 className="text-right font-semibold ">
//                         {typeof module?.module === "object"
//                           ? module.module.duration
//                           : module?.module}
//                       </h4>
//                     </div>

//                     <div>
//                       <button
//                         className=" text-sm text-white bg-[#2F327D] px-2 py-1"
//                         onClick={() =>
//                           handleClick(
//                             typeof module?.module === "object"
//                               ? (module?.module.id as string)
//                               : module.module
//                           )
//                         }
//                       >
//                         Add chapters
//                       </button>
//                       <dialog
//                         id="my_modal_5"
//                         className="modal modal-bottom sm:modal-middle text-black "
//                       >
//                         <div className="modal-box bg-white">
//                           <h3 className="font-bold text-lg">Hello!</h3>
//                           <p className="py-4">
//                             Selected time is : {selectedTime}
//                           </p>
//                           <div className="modal-action">
//                             <div className="flex flex-col w-full gap-4">
//                               <div className="flex flex-row justify-between">
//                                 <input
//                                   type="text"
//                                   placeholder="Enter text"
//                                   value={chapter}
//                                   onChange={(e) => setChapter(e.target.value)}
//                                   className="bg-slate-300 rounded-md shadow-lg placeholder:text-black placeholder:italic border px-4"
//                                 />
//                                 <TimeInput
//                                   maxTime={
//                                     typeof module?.module === "object" &&
//                                     module.module?.duration
//                                       ? module.module.duration
//                                       : "00:00:00"
//                                   }
//                                   onTimeChange={handleTimeChange}
//                                   onClose={handleClosePopup}
//                                 />
//                               </div>
//                               <div className="flex-row flex gap-2">
//                                 <button
//                                   onClick={() => handleAddChapter()}
//                                   className="text-sm bg-[#2F327D] text-white px-3 py-1 rounded-md"
//                                 >
//                                   Add chapter
//                                 </button>
//                                 <form method="dialog">
//                                   {/* if there is a button in form, it will close the modal */}
//                                   <button className="text-sm bg-red-700 text-white px-3 py-1 rounded-md">
//                                     Close
//                                   </button>
//                                 </form>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </dialog>
//                     </div>
//                   </div>
//                   <hr className="mb-2" />
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="w-full h-5 ">
//               <h1 className="font-semibold text-lg text-center">
//                 No course found
//               </h1>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="pt-1 p-6 flex justify-center bg-slate-100 text-black">
//         <div className="p-6 shadow-lg container bg-white">
//           <div className="w-full px-3">
//             <h1 className="font-bold text-lg">Description</h1>
//           </div>
//           <div className="text-md px-3">
//             <p>{course?.description}</p>
//           </div>
//         </div>
//       </div>
//       <div className="pt-1 p-6 flex justify-center bg-slate-100 text-black">
//         <div className="p-6 shadow-lg container bg-white">
//           <div className="w-full px-3">
//             <h1 className="font-bold text-lg">Enrolled Students</h1>
//           </div>
//           <div className="text-md px-3">
//             <EnrolledStudentsTable
//               modules={course?.modules?.length as number}
//               enrollments={enrollments!}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CourseOverview;