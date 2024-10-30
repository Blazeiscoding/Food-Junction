import React from "react";

const Header: React.FC = () => {
  return (
    <nav className="w-full shadow sticky top-0 z-50 bg-gray-200 text-white">
      <div className="container mx-auto p-2 max-w-6xl flex justify-between items-center">
        <div className="text-xl">
          <span>Foood</span>
          <span className="font-bold">Food</span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
