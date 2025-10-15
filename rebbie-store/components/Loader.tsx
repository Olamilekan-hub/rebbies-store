import { TbLoader3 } from "react-icons/tb";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-[100px]">
      <TbLoader3 className="animate-spin text-purple-600 dark:text-purple-400" size={40} />
    </div>
  );
};
