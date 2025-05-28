import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
} from "@mui/material";
import { SubmitDemographicForm } from "../guest/api";
import { useHistory } from "react-router-dom";
import { url } from "../../config";
const DemographicForm = () => {
  const [formData, setFormData] = useState({
    occupation: "",
    gender: "",
    age: "",
    yearsOfExperience: "",
    englishSkills: "",
    germanSkills: "",
    previousSearchEngineUsage: "",
  });
  const [guest, setGuest] = useState(false);

  const navigate = useHistory();
  let previousOption = null; // Initialize the previous option

  const selectRandom = () => {
    // Make a decision based on the random number
    let selectedOption;
    let redirectUrl = "";
    do {
      // Generate a random number between 0 and 1
      const randomNum = Math.random();

      // Set a threshold value (e.g., 0.5) to determine the selection
      const threshold = 0.5;

      if (randomNum < threshold) {
        selectedOption = "WisPerMid";
        redirectUrl = "/";
      } else {
        selectedOption = "Pubmed";
        redirectUrl = "/search/pubmed";
      }
    } while (selectedOption === previousOption); // Keep generating until it's different

    // Update the previous option
    previousOption = selectedOption;
    return {
      option: selectedOption,
      redirectUrl: redirectUrl,
    };
  };

  const caseA = useMemo(selectRandom, []);

  if (guest) {
    // navigate.push("/studycase/task");
    navigate.push(caseA.redirectUrl);
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const skip =(e)=>{
  //   e.preventDefault();
  //   try {
  //     fetch(`${url}/guest/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //       body: JSON.stringify({user:'guest'}),
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {

  //         localStorage.setItem("user", JSON.stringify(res.user));
  //         localStorage.setItem("token", res.token);
  //         setGuest(true);
  //         navigate.push("/studycase/task");
  //       });

  //   } catch (error) {
  //   } finally {

  //   }
  //   navigate.push("/studycase/task")
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      fetch(`${url}/guest/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.user));
          localStorage.setItem("token", res.token);
          setGuest(true);
          // navigate.push(caseA.redirectUrl);
          navigate.push("/studycase/description");
        });
    } catch (error) {
    } finally {
      navigate.push("/studycase/description");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Demographic Data
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel> Occupation/Role</InputLabel>
            <Select
              required
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              label="Occupation/Role"
            >
              <MenuItem value="doctor">Medical Doctor</MenuItem>
              <MenuItem value="student">Medical Student</MenuItem>
              <MenuItem value="other">other</MenuItem>
            </Select>
          </FormControl>

          {formData.occupation === "doctor" && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <TextField
                required
                name="experienceLevel"
                id="filled-number"
                type="number"
                label="Years of Experience"
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 0, max: 70 } }}
                variant="outlined"
                value={formData.experienceLevel}
                onChange={handleChange}
              />
            </FormControl>
          )}

          {formData.occupation === "student" && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <TextField
                required
                name="experienceLevel"
                label="Years of Study"
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.experienceLevel}
                type="number"
                InputProps={{ inputProps: { min: 0, max: 15 } }}
                onChange={handleChange}
              />
            </FormControl>
          )}

          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              required
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Divers">Divers</MenuItem>
              <MenuItem value="No">Prefer not to say</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              required
              name="age"
              label="Age"
              type="number"
              fullWidth
              margin="normal"
              InputProps={{ inputProps: { min: 18, max: 80 } }}
              variant="outlined"
              value={formData.age}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>English Skills</InputLabel>
            <Select
              required
              name="englishSkills"
              value={formData.englishSkills}
              onChange={handleChange}
              label="English Skills"
            >
              <MenuItem value="B1">Beginner (B1)</MenuItem>
              <MenuItem value="B2">Intermediate (B2)</MenuItem>
              <MenuItem value="C1">Advanced (C1)</MenuItem>
              <MenuItem value="C2">Fluent (C2)</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>German Skills</InputLabel>
            <Select
              required
              name="germanSkills"
              value={formData.germanSkills}
              onChange={handleChange}
              label="German Skills"
            >
              <MenuItem value="B1">Beginner (B1)</MenuItem>
              <MenuItem value="B2">Intermediate (B2)</MenuItem>
              <MenuItem value="C1">Advanced (C1)</MenuItem>
              <MenuItem value="C2">Fluent (C2)</MenuItem>
            </Select>
          </FormControl>

          <FormControl component="fieldset" margin="normal">
            <Typography>
              Previous Medical Search Engine Usage Experience like PubMed:
            </Typography>
            <RadioGroup
              row
              required
              name="previousSearchEngineUsage"
              value={formData.previousSearchEngineUsage}
              onChange={handleChange}
            >
              <FormControlLabel
                required={true}
                value="none"
                control={<Radio />}
                label="None"
              />
              <FormControlLabel
                required={true}
                value="minimal"
                control={<Radio />}
                label="Minimal"
              />
              <FormControlLabel
                required={true}
                value="some"
                control={<Radio />}
                label="Some"
              />
              <FormControlLabel
                required={true}
                value="extensive"
                control={<Radio />}
                label="Extensive"
              />
            </RadioGroup>
          </FormControl>
          <FormControl
            sx={{ display: "flex", gap: 1 }}
            variant="outlined"
            margin="normal"
          >
            <Button type="submit" variant="contained" color="primary">
              Continue
            </Button>
          </FormControl>
        </Box>
      </form>
    </Container>
  );
};

export default DemographicForm;
