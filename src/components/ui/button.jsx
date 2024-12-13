import { cn } from "@/lib/utils";

export const buttonVariants = ({ variant = "default" } = {}) => {
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };
  return cn("px-4 py-2 rounded", variants[variant]);
};

export const Button = ({ variant, className, ...props }) => {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props} />
  );
};
