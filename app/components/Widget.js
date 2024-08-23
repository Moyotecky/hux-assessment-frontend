"use client";

const Widget = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
      <div className="icon text-3xl mr-4">{icon}</div>
      <div>
        <h4 className="text-xl font-semibold">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default Widget;
