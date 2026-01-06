const ProgressBar = ({ value, max }) => {
  return (
    <div className="bg-gray-200 rounded">
      <div className="bg-blue-500 h-4 rounded" style={{ width: `${(value / max) * 100}%` }}></div>
    </div>
  );
};

export default ProgressBar;