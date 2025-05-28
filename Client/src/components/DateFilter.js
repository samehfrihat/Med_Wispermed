import * as React from "react";
import DialogContentText from "@mui/material/DialogContentText";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Box } from "@mui/system";

import customParseFormat from "dayjs/plugin/customParseFormat";
import minMax from "dayjs/plugin/minMax";
import { Button, IconButton } from "@mui/material";
import { Clear } from "@mui/icons-material";

dayjs.extend(customParseFormat);
dayjs.extend(minMax);

function DateFilter({ search }) {
  const startDateObject = React.useMemo(
    () =>
      search.params.year?.[0]
        ? dayjs(String(search.params.year[0]), "YYYY")
        : undefined,
    [search.params.year]
  );
  const endDateObject = React.useMemo(
    () =>
      search.params.year?.[1]
        ? dayjs(String(search.params.year[1]), "YYYY")
        : undefined,
    [search.params.year]
  );


  const handleReset = () => {
  
    search.onSubmit({
      year: [undefined, undefined],
    });
  };

  const updateSearchParams = (start, end) => {
    let startYear = start ? dayjs(start, "YYYY") : undefined;
    let endYear = end ? dayjs(end, "YYYY") : undefined;

    if (startYear && !endYear) {
      const currentYear = dayjs().year(); // Extract the current year as a number

      // Create a Day.js object for the first day of the current year at midnight (00:00:00)
      endYear = dayjs().year(currentYear).startOf("year");
    } else if (!startYear && endYear) {
      startYear = endYear.subtract(1, "year");
    }

    let _startYear = dayjs.min(startYear, endYear);
    endYear = dayjs.max(startYear, endYear);
    startYear = _startYear;

    // Update the "year" parameter in your search.params object
    search.onSubmit({
      year: [startYear.format("YYYY"), endYear.format("YYYY")],
    });
  };

  const handleStartDateChange = (newValue) => {
    updateSearchParams(newValue, endDateObject);
  };

  const handleEndDateChange = (newValue) => {
    updateSearchParams(startDateObject, newValue);
  };

  return (
    <Box>
      <DialogContentText my={2}>Date</DialogContentText>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker", "DatePicker", "DatePicker"]}>
          <Box
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <DatePicker
              views={["year"]}
              label={"Start Date"}
              value={startDateObject||null}
              onChange={handleStartDateChange}
            />

            <DatePicker
              views={["year"]}
              label={"End Date"}
              value={endDateObject ||null}
              onChange={handleEndDateChange}
            />
          </Box>
          <Button onClick={handleReset} variant="outlined">
            Clear
          </Button>
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  );
}

export default DateFilter;
