import React from "react";

interface ImagesTypes {
  images: string[];
  name: string;
}
function Images(props: ImagesTypes) {
  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 border-b pb-5">
        {props.images.length} photo{props.images.length > 1 && "s"}
      </h1>
      <div className="flex flex-wrap">
        {props.images.map((image, index) => (
          <img
            className="w-56 h-44 mr-1 mb-1"
            key={index}
            src={image}
            alt={`${props.name}-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Images;
