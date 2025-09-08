import React from "react";

type CourseCardProps = {
  title: string;
  description: string;
  image: string;
  author: string;
  price: number;
};

const CourseCard: React.FC<CourseCardProps> = ({ title, description, image, author, price }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-all w-72">
      <img src={image} alt={title} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        <p className="text-sm text-gray-500 mt-2">👨‍🏫 {author}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-blue-600 font-semibold">${price}</span>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
            Xem khoá học
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
