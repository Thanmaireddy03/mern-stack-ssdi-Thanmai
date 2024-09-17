import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import PropTypes from "prop-types";

const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.record.name}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.record.position}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.record.level}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

Record.propTypes = {
  record: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
  }).isRequired,
  deleteRecord: PropTypes.func.isRequired,
};

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilterredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filters, setFilters] = useState({
    intern: false,
    junior: false,
    senior: false,
  });
  const [openFilterDropDown, setOpenFilterDropDown] = useState(false);
  const handleFilterDropDown = () => {
    setOpenFilterDropDown(!openFilterDropDown);
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };
  const handleFormSubmit = (event)=>{
    event.preventDefault()
    const selectedFilters = Object.keys(filters).filter((key) => filters[key]);
    console.log(selectedFilters);
    if (selectedFilters.length === 0) {
      setFilterredRecords(records);

    } else {
      const temp = records.filter((record) =>
        selectedFilters.includes(record.level.toLowerCase())
      );
      setFilterredRecords(temp);
    }
    setOpenFilterDropDown(false);
  }

  useEffect(()=>{setFilterredRecords(records)},[records])

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
    return;
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  function recordList() {
    return filteredRecords
      .filter((record) =>
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by search query
      )
      .map((record) => {
        return (
          <Record
            record={record}
            deleteRecord={() => deleteRecord(record._id)}
            key={record._id}
          />
        );
      });
  }

  // This following section will display the table with the records of individuals.
  return (
    <>
    <input
  type="text"
  placeholder="Search by name..."
  className="p-2 border border-gray-300 rounded-md"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
/>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Position
                </th>
                <th className="h-12 flex relative justify-between items-center px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Level
                  <button onClick={handleFilterDropDown}>
                    <FaFilter size={14} />
                  </button>
                  {openFilterDropDown && (
                    <form onSubmit={handleFormSubmit} className="absolute flex flex-col gap-2 right-4 shadow-lg top-7 border border-[#eee] p-2 z-10 w-32 bg-white rounded-md ">
                      <div className=" flex items-center gap-1">
                        <input
                          type="checkbox"
                          name="intern"
                          checked={filters.intern}
                          onChange={handleCheckboxChange}
                        />

                        <label htmlFor="intern">Intern</label>
                      </div>
                      <div className=" flex items-center gap-1">
                        <input
                          type="checkbox"
                          name="junior"
                          checked={filters.junior}
                          onChange={handleCheckboxChange}
                        />

                        <label htmlFor="junior">Junior</label>
                      </div>
                      <div className=" flex items-center gap-1">
                        <input
                          type="checkbox"
                          name="senior"
                          checked={filters.senior}
                          onChange={handleCheckboxChange}
                        />

                        <label htmlFor="senior">Senior</label>
                      </div>
                      <button type="submit" className="bg-blue-400 text-white rounded-md px-2 py-1 cursor-pointer w-fit">Apply</button>
                    </form>
                  )}
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {recordList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}