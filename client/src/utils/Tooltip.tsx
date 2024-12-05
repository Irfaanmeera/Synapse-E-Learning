import { Tooltip, Typography } from "@material-tailwind/react";

interface TooltipCustomStylesProps {
  triggerElement: React.ReactElement;
  tooltipContent: React.ReactNode;
}

export const TooltipCustomStyles: React.FC<TooltipCustomStylesProps> = ({
  triggerElement,
  tooltipContent,
}) => {
  return (
    <Tooltip
      placement="bottom"
      className="borderf rounded-sm border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
      content={
        <div className="w-80">
          <Typography color="blue-gray" className="font-medium">
            {/* Material Tailwind */}
          </Typography>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal opacity-80 text-black"
          >
            {tooltipContent}
          </Typography>
        </div>
      }
    >
      {triggerElement}
    </Tooltip>
  );
};