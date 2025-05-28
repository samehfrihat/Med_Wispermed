import * as React from "react";

import DialogContentText from "@mui/material/DialogContentText";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import Checkbox from "@mui/material/Checkbox";

import { FormControl, Select } from "@mui/material";

import { Box } from "@mui/system";

import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
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

function ArticleTypeFilter({ search }) {
  // ... Article type filter code ...

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    search.onSubmit({ article_type:value });
  };

  

  const articlesType = search.params.article_type || [];

  return (
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
          renderValue={(selected) => [selected].join(",")}
          MenuProps={MenuProps}
        >
          {article_type.map((articleType) => (
            <MenuItem key={articleType} value={articleType}>
              <ListItemText primary={articleType} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default ArticleTypeFilter;
