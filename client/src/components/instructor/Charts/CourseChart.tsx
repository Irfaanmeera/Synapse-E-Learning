// import React, { useEffect, useState } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import { ApexOptions } from 'apexcharts';
// import { fetchCoursesByAdmin } from '../../../api/adminApi';
// import { fetchInstructorCourses } from '../../../api/instructorApi';


// const ChartThree: React.FC = () => {
//   const [chartData, setChartData] = useState({ series: [], labels: [] });

//   const fetchChartData = async () => {
//     try {
//       const courses = await fetchInstructorCourses();
      
//       console.log(courses, "courses from chart")

//       // Map course names to labels and enrollment counts to series
//       const labels = courses.map((course: any) => course.name);
//       const series = courses.map((course: any) => course.enrolled);

//       setChartData({ labels, series });
//     } catch (error) {
//       console.error('Error fetching chart data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchChartData();
//   },[]);

//   const options: ApexOptions = {
//     chart: {
//       fontFamily: 'Satoshi, sans-serif',
//       type: 'donut',
//     },
//     colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF', '#F29C4E'],
//     labels: chartData.labels,
//     legend: {
//       show: false,
//       position: 'bottom',
//     },
//     plotOptions: {
//       pie: {
//         donut: {
//           size: '65%',
//           background: 'transparent',
//         },
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//   };

//   return (
//     <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
//       <div className="mb-3 flex justify-between gap-4 sm:flex">
//         <h5 className="text-xl font-semibold text-black dark:text-white">
//           Course Enrollments
//         </h5>
//       </div>

//       <div className="mb-2 flex justify-center">
//         {chartData.series.length > 0 ? (
//           <ReactApexChart
//             options={options}
//             series={chartData.series}
//             type="donut"
//           />
//         ) : (
//           <p>Loading chart data...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChartThree;
