import { useState } from 'react';
import PropTypes from 'prop-types';

const Search = ({ employees, setFilteredEmployees }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const keyword = event.target.value.toLowerCase();
    setSearchTerm(keyword);

    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(keyword) ||
      employee.position.toLowerCase().includes(keyword)
    );

    setFilteredEmployees(filtered);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name or position"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

Search.propTypes = {
  employees: PropTypes.array.isRequired,
  setFilteredEmployees: PropTypes.func.isRequired,
};

export default Search;