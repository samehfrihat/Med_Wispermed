import * as React from "react";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import ModalFilters from "../components/ModalFilters";
import useAuth from "../hooks/useAuth";
import { url } from "../config";
import Autocomplete from "@mui/material/Autocomplete";

const SearchForm = ({ size = "medium", filters = false, ...search }) => {
  const { token } = useAuth();
  const { query, setQuery, onSubmit } = search;
  const [autocomplete, setAutoComplete] = React.useState();

  const setChange = async () => {
    if (query) {
      const res = await fetch(`${url}/autocomplete?query=${query}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
      });

      setAutoComplete(await res.json());
    }
  };

  return (
    <Box
  component="form"
  noValidate
  autoComplete="off"
  onSubmit={(e) => {
    e.preventDefault();
    onSubmit({ increase: true });
  }}
  onChange={setChange}
>
  <FormControl sx={{ m: 1, minWidth: 650 }} size={size}>
    <Autocomplete
      freeSolo
      value={query}
      options={autocomplete ? autocomplete.map((option) => option) : []}
      onChange={(event, value) => {
        setQuery(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder=' e.g. "BRAF conjunctival melanoma"' 
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                {filters && <ModalFilters icon search={search} />}
                <IconButton size={size} aria-label="search" type="submit">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  </FormControl>
</Box>
  );
};

export default SearchForm;
