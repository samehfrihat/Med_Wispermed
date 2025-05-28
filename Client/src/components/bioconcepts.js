import * as React from 'react';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function SwitchesGroup() {
  const [state, setState] = React.useState({
    gene: true,
    disease: true,
    chemical: true,
    mutation: true,
    species: true,
    cellLine: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <FormControl component="concepts_fieldset" variant="standard">
      <FormLabel component="legend">BIOCONCEPTS</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
              <Switch color="warning" checked={state.gene} onChange={handleChange} name="gene" />
          }
          label="Gene"
        />
        <FormControlLabel
          control={
            <Switch color="secondary" checked={state.disease} onChange={handleChange} name="disease" />
          }
          label="Disease"
        />
        <FormControlLabel
          control={
            <Switch color="warning" checked={state.chemical} onChange={handleChange} name="chemical" />
          }
          label="Chemical"
        />
        <FormControlLabel
          control={
            <Switch color="default" checked={state.mutation} onChange={handleChange} name="mutation" />
          }
          label="Mutation"
        />        
        <FormControlLabel
          control={
            <Switch color="secondary" checked={state.species} onChange={handleChange} name="species" />
          }
          label="Species"
        />
        <FormControlLabel
          control={
            <Switch color="default" checked={state.cellLine} onChange={handleChange} name="cellLine" />
          }
          label="CellLine"
        />
      </FormGroup>
    </FormControl>
  );
}