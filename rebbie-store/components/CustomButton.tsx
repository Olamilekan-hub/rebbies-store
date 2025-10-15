import React from "react";

interface CustomButtonProps {
  paddingX?: number;
  paddingY?: number;
  text: string;
  buttonType?: "submit" | "reset" | "button";
  customWidth?: string;
  textSize?: string;
  textColor?: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const CustomButton = ({
  paddingX = 6,
  paddingY = 3,
  text,
  buttonType = "button",
  customWidth,
  textSize,
  textColor,
  variant = "primary",
  className = "",
  onClick,
  disabled = false
}: CustomButtonProps) => {

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return `
          relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700
          text-white font-semibold transition-all duration-300 ease-out
          hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-500/25
          active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent
          before:opacity-0 before:transition-opacity before:duration-300
          hover:before:opacity-100
        `;
      case "secondary":
        return `
          bg-white dark:bg-primary-700 text-gray-900 dark:text-white
          font-semibold transition-all duration-300 ease-out
          hover:bg-gray-50 dark:hover:bg-gray-700 
          hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        `;
      case "outline":
        return `
          bg-transparent text-white dark:border-white font-semibold
          transition-all duration-300 ease-out
          hover:bg-white hover:text-black dark:hover:text-black
          hover:shadow-md hover:shadow-black dark:hover:shadow-primary-500 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
        `;
      default:
        return "";
    }
  };

  const widthClass = customWidth && customWidth !== "no" ? `w-${customWidth}` : "";
  const paddingClass = `px-${paddingX} py-${paddingY}`;
  const textSizeClass = `text-${textSize}`;
  const textColorClass = `text-${textColor}`;

  return (
    <button
      type={buttonType}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${widthClass} ${paddingClass} ${textSizeClass} ${textColorClass}
        ${getVariantClasses()}
        rounded-2xl tracking-wide font-semibold
        focus:outline-none focus:ring-4 focus:ring-primary-500/20
        transition-all duration-300
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <span className="relative z-10">{text}</span>
    </button>
  );
};

export default CustomButton;
