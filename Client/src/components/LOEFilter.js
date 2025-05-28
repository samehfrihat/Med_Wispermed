import DialogContentText from "@mui/material/DialogContentText";
import CustomizedSlider from "./CustomizedSlider";
import { Box, Button } from "@mui/material";
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

function LOEFilter({ search }) {
  // ... LOE filter code ...

  const handleReset = () => {
    search.setParams({
      levelOfEvidence: undefined,
    });
  };

  return (
    <Box sx={{ width: 300, px: 2 }}>
      <DialogContentText my={2}>Level Of Evidence</DialogContentText>
      <CustomizedSlider
        aria-label="Level Of Evidence slider"
        value={search.params.levelOfEvidence || [0, 6]}
        min={0}
        max={6}
        onChange={(e, value) => {
          search.onSubmit({
            levelOfEvidence: value,
          });
        }}
        valueLabelDisplay={"off"}
        marks={LE_marks}
      />

      <Button sx={{paddingTop:1}} onClick={handleReset}>Reset Filter</Button>
    </Box>
  );
}

export default LOEFilter;
