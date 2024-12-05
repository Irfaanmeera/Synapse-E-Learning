import React from "react";
import { Course } from "../../interfaces/course";
import { useNavigate } from "react-router-dom";
import { TooltipCustomStyles } from "../../utils/Tooltip";
import { toTitleCase } from "alter-case";


interface SingleCourseProps {
  course?: Course | undefined;
  learning?: boolean;
  progression?: string[];
}
const SingleCourse: React.FC<SingleCourseProps> = ({
  progression,
  learning,
  course,
}) => {
  const navigate = useNavigate();
  const category =
    typeof course!.category === "object"
      ? course!.category.category
      : course!.category;
  const level =
    typeof course!.level === "object" ? course!.level.level : course!.level;
  const formattedCategory = toTitleCase(category!);
  const formattedLevel = toTitleCase(level!);

  const calculateCompletionPercentage = (
    totalModules: number,
    completedModules: string[]
  ): number => {
    if (totalModules === 0 || completedModules.length === 0) {
      return 0;
    }

    const uniqueCompletedModules = [...new Set(completedModules)];
    const completionPercentage =
      (uniqueCompletedModules.length / totalModules) * 100;

    return Math.round(completionPercentage);
  };

  const completionPercentage = calculateCompletionPercentage(
    course!.modules?.length || 0,
    progression || []
  );

  return (
    <div
      className="md:w-auto  shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] w-full block cursor-pointer rounded-lg   hover:scale-105 ease-in-out duration-300 bg-white overflow-hidden relative group"
      onClick={() => {
        navigate("/view-course", {
          state: { courseId: course!.id },
        });
      }}
    >
      <div className="relative aspect-w-16 h-44  overflow-hidden group-hover:opacity-75 transition-opacity duration-300">
        <img
          className="object-cover w-full h-full"
          src={course!.image ? course!.image : "/image not found.png"}
          alt=""
        />
        <div>
          <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Add your icon here, for example: */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-12 h-w-12"
          >
            <path
              fill="#000"
              fillRule="evenodd"
              d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="p-6 flex flex-col h-full">
        <h3 className="mb-2 text-lg font-bold leading-tight text-neutral-800 h-12 overflow-hidden">
          <TooltipCustomStyles
            triggerElement={
              <span className="line-clamp-2">
                {toTitleCase(course!.name as string)}
              </span>
            }
            tooltipContent={course!.name}
          />
        </h3>
        <p className="mb-1 font-medium text-sm text-neutral-600 h-12 overflow-hidden">
          <TooltipCustomStyles
            triggerElement={
              <span className="line-clamp-2">{course!.description}</span>
            }
            tooltipContent={course!.description}
          />
        </p>
        {!learning && (
          <h4 className="font-semibold text-[#2F327D]">
            Enrollment fee: ₹ {course!.price}
          </h4>
        )}
        <div className="flex items-center my-2">
          <TooltipCustomStyles
            tooltipContent={formattedCategory}
            triggerElement={
              <h4 className="font-medium px-3 py-1 text-sm truncate rounded-full text-[#2F327D] bg-[#cecfcf]">
                {formattedCategory}
              </h4>
            }
          />

          <span className="mx-1"></span>
          <h4 className="font-medium px-3 py-1 text-sm rounded-full text-[#2F327D] bg-[#cecfcf]">
            {formattedLevel}
          </h4>
        </div>
        {learning && (
          <div className=" w-full rounded-full bg-grey-light pt-1">
            <h6 className="text-sm font-semibold">Course progression</h6>
            <div
              className={`text-xs rounded-full w-1/5 leading-none py-1 text-center ${
                completionPercentage > 0
                  ? "text-white"
                  : " text-[#2F327D] font font-semibold"
              }`}
              style={{
                width: `${completionPercentage || 0}%`,
                backgroundColor: "#2F327D",
              }}
            >
              <h5>{completionPercentage}%</h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleCourse;