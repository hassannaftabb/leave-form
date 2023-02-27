import React from "react";

const Heading = ({ text }) => {
  return (
    <div className='w-full flex items-center justify-center'>
      <h1 className={`text-3xl text-black py-6 font-bold`}>{text}</h1>
    </div>
  );
};

export default Heading;
