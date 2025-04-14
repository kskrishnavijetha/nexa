
import React from 'react';
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, fallback = '/assets/images/placeholder.jpg', alt, ...props }, ref) => {
    const [isError, setIsError] = React.useState(false);
    
    return (
      <img
        className={cn("object-cover", className)}
        ref={ref}
        alt={alt}
        onError={() => setIsError(true)}
        src={isError ? fallback : props.src}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";

export { Image };
