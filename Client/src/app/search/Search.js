import { createPortal } from "react-dom";

import * as React from "react";
import { styled } from "@mui/material/styles";
import "./search.css";
import Box from "@mui/material/Box";

import SearchForm from "../../components/SearchForm";
import Image from "../../components/Image";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { grey } from "@mui/material/colors";
import ModalFilters from "../../components/ModalFilters";
import { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TaskBanner from "../../components/TaskBanner";
import { useSearch } from "../../contexts/SearchProvider";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 60,
  height: 34,
  padding: 8,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#18AB86",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 30,
    height: 30,
    "&:before": {
      // backgroundColor: '#18AB86',
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
    "&:after": {
      // backgroundColor: '#8ECAE6',
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#8ECAE6",
    borderRadius: 20 / 2,
  },
}));

const Search = () => {
  
  const search = useSearch();
  const [portalTarget, setPortalTarget] = useState();
  const [value, setValue] = React.useState("medicalAbstracts");
  // const[autocomplete,setAutoComplete] = useState()
  const handleChange = (event) => {
    setValue(event.target.value);

    const params = {};
    if (event.target.value === "medicalAbstracts") {
      params.medicalAbstracts = true;
      params.clinicalTrials = undefined;
    } else {
      params.clinicalTrials = true;
      params.medicalAbstracts = undefined;
    }
    search.setParams(params);
  };
  useEffect(() => {
    setPortalTarget(document.getElementById("header-nav-placeholder"));
    search.setParams({
      clinicalTrials: undefined,
      medicalAbstracts: true,
    });
  }, []);


  useEffect(()=>{
    search.resetFilters()
  },[])


  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="container" style={{ marginTop: "10vh" }}>
          <Box sx={{ paddingBottom: "8vh" }}>
            <Image src="../WisPerMed_ENG.png" />
          </Box>
          <SearchForm {...search} hasCategory={true} />


          {/* <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <FormControlLabel
                value="clinicalTrials"
                control={<Radio />}
                label="Clinical Trials"
              />
              <FormControlLabel
                value="medicalAbstracts"
                control={<Radio />}
                label="Medical Abstracts"
              />
            </RadioGroup>
          </FormControl> */}
          {/* <FormControlLabel
              sx={{
                marginLeft: 0,
                marginRight: 0,
                color: grey[700],
              }}
              control={
                <MaterialUISwitch
                  onChange={(e) => {
                    const params = {};
                    if (e.target.checked) {
                      params.medicalAbstracts = true;
                      params.clinicalTrials = undefined;
                    } else {
                      params.clinicalTrials = true;
                      params.medicalAbstracts = undefined;
                    }
                    search.setParams(params);
                  }}
                  checked={search.params.medicalAbstracts === true}
                />
              }
              label={
                <span>
                  <b>
                    {search.params.medicalAbstracts && "Medical Abstracts"}
                    {!search.params.medicalAbstracts === true &&
                      "Clinical Trials"}
                  </b>
                </span>
              }
            /> */}
          {/* content: '"Clinical Trials"', */}

          {!!portalTarget &&
            createPortal(
              <ModalFilters search={search} icon={true} />,
              portalTarget
            )}
        </div>
      </div>
    </div>
  );
};

export default Search;
