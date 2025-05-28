import { Button, ButtonGroup } from "@mui/material";

import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import DialogContentText from "@mui/material/DialogContentText";

import { useTheme } from "@mui/material/styles";

import { Box } from "@mui/system";

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

function ReadabilityFilter({ search }) {
  const theme = useTheme();
  const values = search.params.readability || []
  
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

  const setReadability =(val)=>{
    
    if(values.indexOf(val) === -1){
      search.onSubmit({
        readability: [...values, val],
      })
    }else{
      search.onSubmit({
        readability: values.filter(v => v !== val),
      })

    }
 



  }

  return (
    <Box>
      <DialogContentText my={1}>Readability</DialogContentText>

      {/* <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
      > */}
        {readability.map((item, index) => (
          <Button
            key={item.value}
            variant={
              search.params.readability && search.params.readability.includes(item.value)
                ? "outlined"
                : "contained"
            }
            sx={{
              marginX:0.3,
              borderRadius:1,
              // borderRadiusTopright:
              //   index < readability.length - 1 ? 0 : undefined,
              // borderRadiusTopright:
              //   index < readability.length - 1 ? 0 : undefined,
            }}
            onClick={(value)=>setReadability(item.value)}            
          >
            {item.label}
          </Button>
        ))}
      {/* </ButtonGroup> */}
    </Box>
  );
}

export default ReadabilityFilter;
