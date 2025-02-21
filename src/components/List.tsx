import React, { useState } from "react";
import { useFishFarms } from "../hooks/useFishFarms";

const FishFarmList = () => {
  const [filters, setFilters] = useState({
    name: "",
    pageNumber: 1,
    pageSize: 2,
  });

  const { data, isLoading, error, refetch } = useFishFarms(filters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNextPage = () => {
    setFilters((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
  };

  return (
    <div>
      <h2>Fish Farms</h2>
      <input
        type="text"
        name="name"
        placeholder="Search by Name"
        value={filters.name}
        onChange={handleFilterChange}
      />
      <button onClick={() => refetch()}>Apply Filters</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading fish farms.</p>}
      <ul>
        {data?.fishFarms?.map((farm: any) => (
          <li key={farm.id}>{farm.name}</li>
        ))}
      </ul>
      <button onClick={handleNextPage}>Next Page</button>
    </div>
  );
};

export default FishFarmList;
