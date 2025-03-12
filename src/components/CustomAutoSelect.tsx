import React, { useState } from "react";

interface Option {
  name: string;
  is: string;
}

interface CustomDropdownProps {
  defaultValue: Option;
  options: Option[];
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  defaultValue,
  options,
}) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue.name);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Option>(defaultValue);

  // Handles input change, logs each keystroke
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Input changed: ", value); // Logs every typed or deleted character
    setInputValue(value);
    setIsOpen(true);
  };

  // Handles selection from the dropdown list
  const handleSelect = (option: Option) => {
    setSelected(option);
    setInputValue(option.name);
    setIsOpen(false);
  };

  // Filters options based on input value
  const filteredOptions = options.filter(
    (option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      option.is !== selected.is
  );

  return (
    <div
      className="custom-dropdown"
      style={{ position: "relative", width: "250px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontWeight: "bold" }}>{selected.name}</span>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
          style={{ flex: 1, padding: "8px", boxSizing: "border-box" }}
          placeholder="Type or select..."
        />
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <ul
          className="dropdown-list"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            border: "1px solid #ccc",
            maxHeight: "150px",
            overflowY: "auto",
            margin: 0,
            padding: 0,
            listStyle: "none",
            background: "#fff",
            zIndex: 1000,
          }}
        >
          {filteredOptions.map((option) => (
            <li
              key={option.is}
              onClick={() => handleSelect(option)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onMouseDown={(e) => e.preventDefault()} // Prevents input from losing focus
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
