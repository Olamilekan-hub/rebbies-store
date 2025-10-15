import React from 'react'

interface HeadingProps {
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const Heading = ({
  title,
  size = 'lg',
  align = 'center',
  className = ''
}: HeadingProps) => {
  const sizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl lg:text-5xl',
    lg: 'text-4xl md:text-5xl lg:text-6xl',
    xl: 'text-5xl md:text-6xl lg:text-7xl'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <h2 className={`
      ${sizeClasses[size]}
      ${alignClasses[align]}
      font-bold
      text-gray-900
      dark:text-white
      mb-6
      ${className}
    `}>
      {title}
    </h2>
  );
};

export default Heading;