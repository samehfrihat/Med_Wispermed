import * as React from "react";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CheckBox from "@mui/icons-material/CheckBox";
import { Box, Checkbox } from "@mui/material";
import { concepts, conceptsAsValues } from "../../utils/concepts";
export default function ConceptsFilter({ search }) {
  const [toggleAll, setToggleAll] = React.useState(true); // State to toggle all checkboxes

  const conceptsValue = search.params.concepts || [];


  const handleToggleAll = () => {
    setToggleAll(!toggleAll);

 

    if (!toggleAll) {
      search.onSubmit({ concepts: conceptsAsValues });
    } else {
      search.onSubmit({ concepts: [] });

    }

    console.log('search.params.concept',search.params.concept)
  };

  const handleChange = (event) => {
    const name = event.target.name;

    if (conceptsValue.includes(name)) {

      search.onSubmit({ concepts: conceptsValue.filter((v) => v !== name)})
    } else {

      search.onSubmit({ concepts: [...conceptsValue, name] })
    }
  };



//   <Box>
//   <DialogContentText my={2}>Date</DialogContentText>
//   <LocalizationProvider dateAdapter={AdapterDayjs}>
//     <DemoContainer components={["DatePicker", "DatePicker", "DatePicker"]}>
//       <Box
//         sx={{
//           display: "flex",
//           flex: 1,
//           justifyContent: "space-between",
//           gap: 2,
//         }}
//       >
//         <DatePicker
//           views={["year"]}
//           label={"Start Date"}
//           value={startDateObject}
//           onChange={handleStartDateChange}
//         />

//         <DatePicker
//           views={["year"]}
//           label={"End Date"}
//           value={endDateObject}
//           onChange={handleEndDateChange}
//         />
//       </Box>
//       <Button
//         onClick={() => {
//           search.onSubmit({
//             year: undefined,
//           });
//         }}
//         variant="outlined"
//       >
//         Clear
//       </Button>
//     </DemoContainer>
//   </LocalizationProvider>
// </Box>

  return (
    <Box sx={{ borderRadius: 1, paddingTop: 2 }}>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          gap: 2,
        }}
      >
      <FormControl component="concepts_fieldset" variant="standard">
        <FormLabel component="legend">
          <FormControlLabel
            sx={{ marginX: 1, gap: 1 }}
            control={
              <CheckBox
                sx={{ color: toggleAll ? "#237aaa" : "#c9c9c9" }} // Set checkbox color based on toggle state
                checked={toggleAll}
                onClick={handleToggleAll}
              />
            }
            label="BIOCONCEPTS"
          />
        </FormLabel>
        <FormGroup
          sx={{
            p: 1,
            m: 1,
            gap: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width:300
          }}
        >
          {concepts.map((concept) => (
            <FormControlLabel
              key={concept.value}
              sx={{ color: concept.color }}
              control={
                <Checkbox
                  sx={{ color: concept.color }}
                  name={concept.value}
                  checked={conceptsValue.includes(concept.value)}
                  onChange={handleChange}
                  disabled={!toggleAll}
                />
              }
              label={concept.value}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>

  </Box>
  );
}
