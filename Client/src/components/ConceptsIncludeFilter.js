import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import AddIcon from "@mui/icons-material/Add";
import MinimizeIcon from "@mui/icons-material/Minimize";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { Box, FormControlLabel, IconButton, Stack } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

import useAuth from "../hooks/useAuth";
import { url } from "../config";

export default function ConceptsIncludeFilter({ search, tabs }) {
  const [open, setOpen] = React.useState({});
  const conceptsValue = search.params.concepts || [];
  const handleClick = (index) => {
    setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
  };

  const onEntitySelect = (entity, isSelected) => {
    if (isSelected) {
      search.onSubmit({
        concepts_include: [...search.params.concepts_include, entity],
      });
    } else {
      search.onSubmit({
        concepts_include: search.params.concepts_include.filter(
          (item) => item !== entity
        ),
      });
    }
  };

  // Flatten the 'entities' arrays
  const flatEntities = tabs.flatMap((item) => item.entities);


  // Count the entities for each type
  const entityCounts = {};

  flatEntities.forEach((entity) => {
    const type = entity.type;
    const id = entity.id;

    if (!entityCounts[type]) {
      entityCounts[type] = {};
    }

    if (!entityCounts[type][id]) {
      entityCounts[type][id] = 0;
    }

    entityCounts[type][id]++;
  });

  // Sort the entities for each type by count in descending order
  const topEntitiesByType = {};

  
  for (const type in entityCounts) {
    console.log('1' ,entityCounts[type] , 'entityCounts' , entityCounts)
    const entitiesOfType = Object.keys(entityCounts[type]);
    console.log('entitiesOfType' , entitiesOfType)
    entitiesOfType.sort(
      (a, b) => entityCounts[type][b] - entityCounts[type][a]
    );
    
    topEntitiesByType[type] = entitiesOfType.map((id) => {
       const x = flatEntities.filter(
        (entity) => entity.id === id && entity.type === type
      );


      return x
    });
  }


  const topEntitiesArray = Object.keys(topEntitiesByType).map((type) => ({
    type,
    entities: topEntitiesByType[type].flatMap(item => item).slice(0, 5),
  }));

 
  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Concepts List
        </ListSubheader>
      }
    >
      {topEntitiesArray &&
        topEntitiesArray.map((tab, index) => (
          <SingleItem
            key={index}
            search={search}
            tab={tab}
            open={open[index]}
            onEntitySelect={onEntitySelect}
            selectedEntities={search.params.concepts_include}
            setOpen={(open) =>
              setOpen((prevState) => ({ ...prevState, [index]: open }))
            }
            isSelected={conceptsValue.includes(tab.type?.toLowerCase?.())}
            onSelect={() => {
              const value = tab.type?.toLowerCase?.();

              if (conceptsValue.includes(value)) {
                search.onSubmit({
                  concepts: conceptsValue.filter((v) => v !== value),
                });
              } else {
                search.onSubmit({ concepts: [...conceptsValue, value] });
              }
            }}
          />
        ))}
    </List>
  );
}

const SingleItem = ({
  tab,
  setOpen,
  open,
  isSelected,
  onSelect,
  onEntitySelect,
  selectedEntities,
}) => {
  // const [open,setOpen] = React.useState(false)

  return (
    <>
      <ListItemButton
        onClick={() => setOpen(!open)}
        sx={{ fontSize: 14, p: 0, m: 0, minWidth: 200 }}
      >
        {/* <FormControlLabel
          key={tab.value}
          control={
            <Checkbox
              name={tab.value}
              checked={isSelected}
              onChange={onSelect}
              //   disabled={!toggleAll}
            />
          }
          label={tab.value}
        /> */}
        <Box p={0.5} m={0.5}>
          {tab.type}
        </Box>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      {tab.entities.map((entity) => (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 2, paddingBottom: 0, marginBottom: 0 }}>
              <ListItemIcon>
                <IconButton
                  disabled={entity && selectedEntities.includes(entity.id)}
                  onClick={() => onEntitySelect(entity.id, true)}
                  sx={{ margin: 0, padding: 0 }}
                  color="success"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
                <IconButton
                  disabled={entity && !selectedEntities.includes(entity.id)}
                  onClick={() => onEntitySelect(entity.id, false)}
                  sx={{ margin: 0, padding: 0 }}
                  color="success"
                >
                  <MinimizeIcon fontSize="small" sx={{ marginBottom: 1.5 }} />
                </IconButton>
              </ListItemIcon>

              <ListItemText>
                <Box sx={{ fontSize: 12 }}>{entity.entity}</Box>
              </ListItemText>
            </ListItemButton>
          </List>
        </Collapse>
      ))}
    </>
  );
};
