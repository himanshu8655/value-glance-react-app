import axios from "axios";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

function HomePage() {
  const fmpKey = import.meta.env.VITE_APP_FMP_KEY;
  const baseUrl = "https://financialmodelingprep.com";
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minRevenue: "",
    maxRevenue: "",
    minNetIncome: "",
    maxNetIncome: "",
  });

  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  useEffect(() => {
    setError(null);
    
    const getFinancialData = () => {
        axios.get(`${baseUrl}/api/v3/income-statement/AAPL?period=annual&apikey=${fmpKey}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          setError(err.message);
        });
    }

    getFinancialData();
    
  }, []);

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    const inDateRange =
      (!startDate || itemDate >= startDate) &&
      (!endDate || itemDate <= endDate);

    const inRevenueRange =
      (!filters.minRevenue || item.revenue >= Number(filters.minRevenue)) &&
      (!filters.maxRevenue || item.revenue <= Number(filters.maxRevenue));

    const inNetIncomeRange =
      (!filters.minNetIncome || item.netIncome >= Number(filters.minNetIncome)) &&
      (!filters.maxNetIncome || item.netIncome <= Number(filters.maxNetIncome));

    return inDateRange && inRevenueRange && inNetIncomeRange;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Financial Data</h1>
      <Box sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.endDate}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
        />
        <TextField
          label="Min Revenue"
          type="number"
          value={filters.minRevenue}
          onChange={(e) => handleFilterChange("minRevenue", e.target.value)}
        />
        <TextField
          label="Max Revenue"
          type="number"
          value={filters.maxRevenue}
          onChange={(e) => handleFilterChange("maxRevenue", e.target.value)}
        />
        <TextField
          label="Min Net Income"
          type="number"
          value={filters.minNetIncome}
          onChange={(e) => handleFilterChange("minNetIncome", e.target.value)}
        />
        <TextField
          label="Max Net Income"
          type="number"
          value={filters.maxNetIncome.toLocaleString()}
          onChange={(e) => handleFilterChange("maxNetIncome", e.target.value)}
        />
      </Box>

      <Box sx={{ minWidth: 200, marginBottom: "16px", display: 'flex', gap: '16px' }}>
  <FormControl>
    <InputLabel id="sort-label">Sort</InputLabel>
    <Select
      labelId="sort-label"
      id="sort-select"
      value={sortField}
      label="Sort"
      onChange={handleSortFieldChange}
    >
      <MenuItem value={"date"}>Date</MenuItem>
      <MenuItem value={"revenue"}>Revenue</MenuItem>
      <MenuItem value={"netIncome"}>Net Income</MenuItem>
    </Select>
  </FormControl>

  <FormControl>
    <InputLabel id="filter-label">View</InputLabel>
    <Select
      labelId="filter-label"
      id="filter-select"
      value={sortOrder}
      label="View"
      onChange={handleSortOrderChange}
    >
      <MenuItem value={"asc"}>Ascending</MenuItem>
      <MenuItem value={"desc"}>Descending</MenuItem>
    </Select>
  </FormControl>
</Box>


      {error && <p className="text-red-500">Error: {error}</p>}

      {!error && sortedData.length > 0 && (
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Revenue</th>
              <th className="border border-gray-300 px-4 py-2">Net Income</th>
              <th className="border border-gray-300 px-4 py-2">Gross Profit</th>
              <th className="border border-gray-300 px-4 py-2">EPS</th>
              <th className="border border-gray-300 px-4 py-2">Operating Income</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, i) => (
              <tr key={i}>
                <td className="border border-gray-300 px-4 py-2">{item.date}</td>
                <td className="border border-gray-300 px-4 py-2">{item.revenue.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{item.netIncome.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{item.grossProfit.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{item.eps}</td>
                <td className="border border-gray-300 px-4 py-2">{item.operatingIncome.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!error && sortedData.length === 0 && <p>No data matches the filters.</p>}
    </div>
  );
}

export default HomePage;
