// /* eslint-disable @typescript-eslint/no-explicit-any */

// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { Link, useNavigate, useParams } from "react-router-dom";
// // import Ratings from "../../../instructor/utils/Ratings";
// import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
// // import CoursePlayer from "../../../services/CoursePlayer";
// // import CourseContentList from "../CourseContentList";
// // import {Elements} from "@stripe/react-stripe-js"
// // import CheckoutForm from "./CheckoutForm";

// type Props = {
//   course: any;
//   error: string;
// };

// const StudentViewCourseDetail: React.FC<Props> = ({ course ,error,}) => {

//   const [open, setOpen] = useState(false);

//   const params = useParams();
//   const navigate = useNavigate();
//   // console.log(params._id);

//   const user = useSelector((state: any) => state.login.user);

//   const discountPercentage =
//     course &&
//     ((course.estimatedPrice - course.price) / course.estimatedPrice) * 100;
//   const discountPercentagePrice = discountPercentage
//     ? discountPercentage.toFixed(0)
//     : "";

//   const isPurchased =
//     user &&
//     course &&
//     user?.courses?.find((item: any) => item === course._id);

//   const handleOrder = () => {
    
//     if (!user) {
//       navigate("/login", { state: { from: `/course_details/${params._id}` } });
//     }
//     setOpen(true);
//   };

//   return (
//     <div>
//       <div className="w-[90%] 800px:w-[90%] m-auto py-5">
//         {course && (
//           <div className="w-full flex flex-col-reverse 800px:flex-row">
//             <div className="w-full 800px:w-[65%] overflow-y-auto 800px:pr-5">
//               <h1 className="font-Poppins text-[25px] font-[600]">
//                 {course.courseTitle}
//               </h1>
//               <div className="flex items-center justify-between pt-3">
//                 <div className="flex items-center">
//                   {/* <Ratings rating={course.ratings} /> */}
//                   <h5>{course.reviews?.length} Reviews</h5>
//                 </div>
//                 <h5>{course.purchased} Students</h5>
//               </div>
//               <h1 className="text-[25px] font-Poppins font-[600] ">
//                 What you will learn from this course
//               </h1>
//               <div>
//                 {course.benefits?.map((item: any, index: number) => (
//                   <div
//                     className="w-full flex 800px:items-center py-2"
//                     key={index}
//                   >
//                     <div className="w-[15px] mr-1">
//                       <IoCheckmarkDoneOutline size={20} />
//                     </div>
//                     <p className="pl-2">{item.title}</p>
//                   </div>
//                 ))}
//                 <br />
//                 <br />
//               </div>
//               <h1 className="text-[25px] font-Poppins font-[600] ">
//                 What are the prerequisites of this course ?
//               </h1>
//               <div>
//                 {course.prerequisites?.map((item: any, index: number) => (
//                   <div
//                     className="w-full flex 800px:items-center py-2"
//                     key={index}
//                   >
//                     <div className="w-[15px] mr-1">
//                       <IoCheckmarkDoneOutline size={20} />
//                     </div>
//                     <p className="pl-2">{item.title}</p>
//                   </div>
//                 ))}
//                 <br />
//                 <br />
//                 <div>
//                   <h1 className="text-[25px] font-Poppins font-[600]">
//                     Course Overview
//                   </h1>
//                   {/* <CourseContentList courseId={course._id} data={course.courseData} isDemo={true} /> */}
//                 </div>
//                 <br />
//                 <br />
//                 {/* Course description */}
//                 <div className="w-full">
//                   <h1 className="text-[25px] font-Poppins font-[600]">
//                     Course Details
//                   </h1>
//                   <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden">
//                     {course.description}
//                   </p>
//                 </div>
//                 <br />
//                 <br />
//                 <div className="w-full">
//                   <div className="800px:flex items-center">
//                     {/* <Ratings rating={course.ratings} /> */}
//                     <div className="mb-2 800px:mb-[unset]" />
//                     <h5 className="text-[25px] font-Poppins">
//                       {Number.isInteger(course.ratings)
//                         ? course.ratings.toFixed(1)
//                         : course.ratings.toFixed(2)}
//                       Course Rating . {course.reviews.length} Reviews
//                     </h5>
//                   </div>
//                   <br />
//                   {(course.reviews && [...course.reviews].reverse()).map(
//                     (item: any, index: number) => (
//                       <div className="w-full pb-4" key={index}>
//                         <div className="flex">
//                           <div className="w-[50px] h-[50px]">
//                             <div className="w-[50px] h-[50px] bg-slate-600 rounded-[50px] flex items-center justify-center cursor-pointer">
//                               <h1 className="uppercase text-[18px]">
//                                 {item.user.name}
//                               </h1>
//                             </div>
//                           </div>
//                           <div className="hidden 800px:block pl-2">
//                             <div className="flex items-center">
//                               <h5 className="text-[18px] pr-2">
//                                 {item.user.name}
//                               </h5>
//                               {/* <Ratings rating={item.rating} /> */}
//                             </div>
//                             <p>{item.comment}</p>
//                             <small>{item.createdAt}</small>
//                           </div>
//                           <div className="pl-2 flex 800px:hidden items-center">
//                             <h5 className="text-[18px] pr-2">
//                               {item.user.name}
//                             </h5>
//                             {/* <Ratings rating={item.rating} /> */}
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="w-full 800px:w-[35%] overflow-y-none relative">
//               <div className="stick top-[100px] left-0 z-50 w-full">
//                 {/* <CoursePlayer videoUrl={course.demoUrl} width="100%" /> */}
//                 <div className="flex items-center">
//                   <h1 className="pt-5 text-[25px]">
//                     {course.price === 0 ? "Free" : course.price + "₹"}
//                   </h1>
//                   <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80">
//                     {course.estimatedPrice}₹
//                   </h5>
//                   <h4 className="pl-5 pt-4 text-[22px]">
//                     {discountPercentagePrice}% Off
//                   </h4>
//                 </div>
//                 <div className="flex items-center">
//                   {isPurchased ? (
//                     <Link
//                       to={`/course-access/${course._id}`}
//                       className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                     >
//                       Enter Course
//                     </Link>
//                   ) : (
//                     <div
//                       className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
//                       onClick={handleOrder}
//                     >
//                       Buy Now {course.price}₹
//                     </div>
//                   )}
//                 </div>
//                 <br />
//                 <li className="pb-1">Source code included</li>
//                 <li className="pb-1">Full lifetime access</li>
//                 <li className="pb-1">Certificate of completion</li>
//                 <li className="pb-3">Premium Support</li>
//               </div>
//             </div>
//           </div>
//         )}
//         {error && <p>Error: {error}</p>}
//       </div>
//       {
//         <>
//           {open && (
//             <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center">
//               <div className="bg-[#00000036] w-full h-full absolute top-0 left-0"></div>
//               <div className="w-[500px] h-[500px] bg-white rounded-xl shadow p-3 relative">
//                 <div className="absolute top-0 right-0">
//                   <IoCloseOutline
//                     size={40}
//                     className="text-black cursor-pointer"
//                     onClick={() => setOpen(false)}
//                   />
//                 </div>
//             {/* <div className="w-full">
//               {
//                 stripePromise && clientSecret && (
//                   <Elements stripe={stripePromise} options={{clientSecret}}>
//                     <CheckoutForm setOpen={setOpen} course={course} socket={socket} />
//                   </Elements>
//                 )
//               }
//             </div> */}

//               </div>
//             </div>
//           )}
//         </>
//       }
//     </div>
//   );
// };

// export default StudentViewCourseDetail;