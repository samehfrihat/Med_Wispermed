import * as React from "react";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MuiDivider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Stack,
  Select,
  TextField,
} from "@mui/material";
import Logo from "./Logo";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import Slider, {
  SliderThumb,
  SliderValueLabelProps,
} from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import CustomizedSlider from "./CustomizedSlider";
import { FilterAlt, InfoRounded } from "@mui/icons-material";
import { useState } from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import customParseFormat from "dayjs/plugin/customParseFormat";
import minMax from "dayjs/plugin/minMax";

dayjs.extend(customParseFormat);
dayjs.extend(minMax);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: theme.spacing(2, -4),
}));

const readability = [
  // {
  //   label: "All",
  //   value: "all",
  //   color: "#d3bea5",
  // },
  {
    label: "Easy",
    value: "easy",
    color: "#027d40",
  },
  {
    label: "Medium",
    value: "medium",
    color: "#88d04dff",
  },
  {
    label: "Hard",
    value: "hard",
    color: "#fcd02f",
  },
  {
    label: "Expert",
    value: "expert",
    color: "#f47117",
  },
];
export default function ModalFilters({ icon = false, search }) {
  const [checked, setChecked] = React.useState([true, false]);

  const [selectedDateRange, setSelectedDateRange] = useState("");
  const article_type = [
    "Case Reports",
    "Clinical Study",
    "Clinical Trial",
    "Clinical Trial, Phase I",
    "Clinical Trial, Phase II",
    "Clinical Trial, Phase III",
    "Clinical Trial, Phase IV",
    "Comment",
    "Comparative Study",
    "Controlled Clinical Trial",
    "Meta-Analysis",
    "Multicenter Study",
    "Congress",
    "Abstract",
    "Randomized Controlled Trial",
    "Review",
    "Systematic Review",
  ];

  const { onSubmit, params } = search;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const min = 0;
  const max = 100;
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const BootstrapButton = styled(Button)({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    color: "#c4bebe",
    borderColor: "#c4bebe",
    borderRadius: 10,
    "&.MuiButton-contained": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.main,
    },
  });

  const TL_marks = [
    {
      value: 0,
    },
    {
      value: 10,
    },
    {
      value: 20,
    },
    {
      value: 30,
    },
    {
      value: 40,
    },
    {
      value: 50,
    },
    {
      value: 60,
    },
    {
      value: 70,
    },
    {
      value: 80,
    },
    {
      value: 90,
    },
    {
      value: 100,
    },
  ];

  const LE_marks = [
    {
      label: "1a",
      value: 0,
    },
    {
      label: "1b",
      value: 1,
    },
    {
      label: "2a",
      value: 2,
    },
    {
      label: "2b",
      value: 3,
    },
    {
      label: "3a",
      value: 4,
    },
    {
      label: "3b",
      value: 5,
    },
    {
      label: "4",
      value: 6,
    },
  ];
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReset = () => {

    search.setParams({
      levelOfEvidence: undefined,
    });

    search.setParams({
      article_type: undefined,
    });

    search.setParams({
      readability: undefined,
    });
    search.setParams({
      year: [undefined, undefined],
    });
    setArticlesType([]);

    setEndDate(undefined);
    setStartDate(undefined);

    search.setParams({
      age: undefined,
    });
    // search.setParams({
    //   gender: undefined,
    // });
  };

  const values = search.params.readability || []
  const [articlesType, setArticlesType] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setArticlesType(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    search.setParams({ article_type: event.target.value });
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);

    updateSearchParams(newValue, endDate);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    updateSearchParams(startDate, newValue);
  };

  const updateSearchParams = (start, end) => {
    let startYear = start ? dayjs(start, "YYYY") : undefined;
    let endYear = end ? dayjs(end, "YYYY") : undefined;

    if (startYear && !endYear) {
      endYear = startYear.add(1, "year");
    } else if (!startYear && endYear) {
      startYear = endYear.subtract(1, "year");
    }

    let _startYear = dayjs.min(startYear, endYear);
    endYear = dayjs.max(startYear, endYear);
    startYear = _startYear;
    
    // Update the "year" parameter in your search.params object
    search.setParams({
      year: [startYear.format("YYYY"), endYear.format("YYYY")],
    });

  };

  const startDateObject = search.params.year?.[0]
    ? dayjs(String(search.params.year[0]), "YYYY")
    : undefined;
  const endDateObject = search.params.year?.[1]
    ? dayjs(String(search.params.year[1]), "YYYY")
    : undefined;

  return (
    <>
      {!icon && (
        <Button variant="outlined" onClick={handleClickOpen}>
          Open Filters
        </Button>
      )}

      {icon && (
        <IconButton variant="outlined" onClick={handleClickOpen}>
          <FilterAlt />
        </IconButton>
      )}

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <Stack direction="row" justifyContent="space-between">
            <IconButton onClick={handleClose} >
              <CloseIcon />
            </IconButton>
            <Box> {"Filters"}</Box>
            <Logo width={30} height={30} />
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ paddingY: 1 }}>
          <Box>
            <DialogContentText my={1}>Readability</DialogContentText>

            <Stack direction="row" justifyContent="flex-start" sx={{gap:1}}>
              {readability.map((item) => (
                <BootstrapButton
                  disableElevation
                  key={item.value}
                  variant={
                    search.params.readability && search.params.readability.includes(item.value)
                    ? "outlined"
                    : "contained"
                  }
                  
                  sx={{ background: item.color, color: "#fff", }}
                  onClick={() =>
                    search.setParams({
                      readability: [...values, item.value],
                    })
                  }
                >
                  {item.label}
                </BootstrapButton>
              ))}
            </Stack>
          </Box>
          <Divider />
          
          <Box>
            <DialogContentText my={2}>Level Of Evidence</DialogContentText>
            <CustomizedSlider
              aria-label="Level Of Evidence slider"
              value={search.params.levelOfEvidence || [0, 6]}
              min={0}
              max={6}
              onChange={(e, value) => {
                search.setParams({
                  levelOfEvidence: value,
                });
              }}
              valueLabelDisplay={"off"}
              marks={LE_marks}
            />
          </Box>
          <Divider />

          

          <Box>
            <DialogContentText my={2}> Article type</DialogContentText>

            <FormControl sx={{ width: 250 }}>
              <InputLabel>
                Select article type{" "}
              </InputLabel>
              <Select
                // multiple
                value={articlesType}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {article_type.map((articleType) => (
                  <MenuItem key={articleType} value={articleType}>
                    {/* <Checkbox
                      checked={articlesType.indexOf(articleType) > -1}
                    /> */}
                    <ListItemText primary={articleType} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          

          <Box>
            <DialogContentText my={2}>Date</DialogContentText>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DatePicker", "DatePicker", "DatePicker"]}
              >
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
                    value={startDateObject}
                    onChange={handleStartDateChange}
                  />

                  <DatePicker
                    views={["year"]}
                    label={"End Date"}
                    value={endDateObject}
                    onChange={handleEndDateChange}
                  />
                </Box>
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          <Divider />
        </DialogContent>
        {/* <Divider sx={{ marginBottom: 0 }} /> */}
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-Between",
            flexShrink: 0,
          }}
        >
          <Button onClick={handleReset}>Reset Filters</Button>

          <Button
            color="primary"
            variant="outlined"
            disableElevation
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
              handleClose();
            }}
          >
            Apply Filters
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
