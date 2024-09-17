import { useState } from "react";

export default function InsertMultiple() {
  const [records, setRecords] = useState([{ name: "", position: "", level: "" }]);
  const [error, setError] = useState(null);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newRecords = records.map((record, i) => {
      if (i === index) {
        if (name.startsWith("level-")) {
          return { ...record, level: value };
        }
        return { ...record, [name]: value };
      }
      return record;
    });
    setRecords(newRecords);
  };

  const handleAddRecord = () => {
    setRecords([...records, { name: "", position: "", level: "" }]);
  };

  const handleRemoveRecord = (index) => {
    const newRecords = records.filter((_, i) => i !== index);
    setRecords(newRecords);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset error state

    try {
      const response = await fetch("http://localhost:5050/record/addMultiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(records),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
      setRecords([{ name: "", position: "", level: "" }]);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit records. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold p-4">Insert Multiple Records</h3>
      {error && <p className="text-red-500">{error}</p>}
      {records.map((record, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          <input
            type="text"
            name="name"
            value={record.name}
            onChange={(e) => handleChange(index, e)}
            placeholder="Name"
            className="block w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            name="position"
            value={record.position}
            onChange={(e) => handleChange(index, e)}
            placeholder="Position"
            className="block w-full mb-2 p-2 border rounded"
          />
          <div className="mb-2">
            <label className="mr-2">
              <input
                type="radio"
                name={`level-${index}`}
                value="Intern"
                checked={record.level === "Intern"}
                onChange={(e) => handleChange(index, e)}
              />
              Intern
            </label>
            <label className="mr-2">
              <input
                type="radio"
                name={`level-${index}`}
                value="Junior"
                checked={record.level === "Junior"}
                onChange={(e) => handleChange(index, e)}
              />
              Junior
            </label>
            <label>
              <input
                type="radio"
                name={`level-${index}`}
                value="Senior"
                checked={record.level === "Senior"}
                onChange={(e) => handleChange(index, e)}
              />
              Senior
            </label>
          </div>
          <button
            type="button"
            onClick={() => handleRemoveRecord(index)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddRecord}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Add Another Record
      </button>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ml-4"
      >
        Submit
      </button>
    </form>
  );
}
