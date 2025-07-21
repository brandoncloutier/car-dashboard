const SimpleToggle = ({ checked, onChange }) => {
  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-[79.2px] h-[36.96px] rounded-full shadow-inner transition-colors duration-300 ${checked ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <div
          className={`absolute top-0.5 left-0.5 w-[32.4px] h-[32.4px] bg-white rounded-full shadow transform transition-transform duration-300 ${
            checked ? 'translate-x-[42.8px]' : ''
          }`}
        ></div>
      </div>
    </label>
  );
};

export default SimpleToggle;