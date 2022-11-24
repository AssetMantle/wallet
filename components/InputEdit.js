import React, { useState } from "react";

export default function InputEdit({
  value = "thequickbrownfoxjumpsoverthelazydogfIfthedogr",
  setValue,
}) {
  const [CanEdit, setCanEdit] = useState(false);
  return (
    <div
      className={`p-3 py-2 d-flex rounded-2 gap-2 ${
        CanEdit ? "am-input" : ""
      } am-input`}
    >
      {CanEdit ? (
        <input
          className="bg-t"
          type="text"
          value={value}
          placeholder="Enter address"
          style={{ flex: "1", border: "none", outline: "none" }}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <p className="flex-grow-1">{value}</p>
      )}
      <button
        className="bg-gray-800 p-1 px-2 text-primary"
        onClick={() => setCanEdit(!CanEdit)}
      >
        {CanEdit ? "done" : "edit"}
      </button>
    </div>
  );
}
