import React, { useEffect, useMemo, useState } from "react";
import "./../app/searchPubmed/search.css";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import { Container, Stack, Button, TextField, Divider,Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { submit } from "../app/TaskPage/api";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import qs from 'qs';
import queryString from 'query-string';
export default function FeedbackPage() {
  const [reviews, setReviews] = useState({});
  const [feedback, setFeedbackText] = useState("");
  const [done, setDone] = useState(false);
  const history = useHistory();
  const useStyles = makeStyles((theme) => ({
    container: {
      padding: theme.spacing(2),
    },
    listItem: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  }));

  const handleReviews = (e) => {
    setReviews((reviews) => ({ ...reviews, [e.target.name]: e.target.value }));
  };

 
  const { search: data } = useLocation();
  const parsed = qs.parse(data, { ignoreQueryPrefix: true });

  // Function to handle feedback input change
  const handleFeedbackChange = (event) => {
    setFeedbackText(event.target.value);
  };

  const finishTask = async () => {
    const requestStartTime = new Date();
    const objA = { numOfQueryA: parsed.numA?.queryA, option: parsed.numA?.option };
    const objB = { numOfQueryB: parsed.numB?.queryB,option: parsed.numB?.option };

    const timeObjA = { timeA: parsed.timers[0], option: parsed.numA?.option };
    const timeObjB = { timeB: parsed.timers[1], option: parsed.numB?.option };
console.log(  'objA',    objA,
  objB,
  timeObjA,
  timeObjB,
  feedback,
  parsed.pageLoadTime.toString(),
  requestStartTime,
 'reviews', reviews)

    const res = await submit(
      objA,
      objB,
      timeObjA,
      timeObjB,
      feedback,
      parsed.pageLoadTime.toString(),
      requestStartTime,
      reviews
    );
    if (res) {
      setDone(true);
      history.push("/studycase/done");
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          finishTask();
        }}
      >
      <Box sx={{padding:2}}>


      <Box>
        <Stack sx={{ width: "80%" }}>
          {/* Section: Level of Evidence */}
          <Box sx={{ padding: 1 , marginBottom:4}}>
          Vielen Dank, dass Sie an unserer Studie teilgenommen haben. Hier ist der letzte Schritt. Bitte geben Sie Feedback zu Ihrer Erfahrung mit der WisPerMed-Suchmaschine. Eine der Suchmaschinen zeigte zusätzliche Informationen zu den Artikeln an, z. B. das Evidenzniveau und hervorgehobene Konzepte:
          <img src="/article.PNG" alt={"WisPerMed search engine snapshot"} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
            <Divider/><Divider/><Divider/><Divider/>
          </Box>
        </Stack>
      </Box>






      <Box>
        <Stack sx={{ width: "80%" }}>
          {/* Section: Level of Evidence */}
          <Box sx={{ padding: 1 }}>
            1. Level of Evidence (LoE)
            <img src="/loe2.PNG" alt={"LoE"} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
          </Box>
            
          <Box sx={{ display: 'flex', alignItems: 'center', margin: 1, marginLeft: 2, width: "100%" }}>
            <FormControl component="fieldset" sx={{ marginRight: 2 }}>
              <FormLabel component="legend">Waren Sie sich vorher des LoE-Konzepts bewusst?</FormLabel>
            </FormControl>

            <RadioGroup
              row
              aria-label="LoE_aware"
              name="LoE_aware"
              onChange={handleReviews}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Ja" />
              <FormControlLabel value="no" required control={<Radio />} label="Nein" />
            </RadioGroup>
          </Box>
            
          <Box sx={{ display: 'flex', alignItems: 'center', margin: 1, marginLeft: 2, width: "100%" }}>
            <FormControl component="fieldset" sx={{ marginRight: 2 }}>
              <FormLabel component="legend">Wie hilfreich fanden Sie die LoE-Informationen, um die Aufgabe zu erledigen?</FormLabel>
            </FormControl>

            
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>Überhaupt nicht hilfreich</span>
                <RadioGroup
                    row
                    aria-label="review-scale"
                    name="loeScale"
                    onChange={handleReviews}
                >
                    {[1, 2, 3, 4, 5].map((value) => (
                        <FormControlLabel
                            key={value}
                            value={String(value)}
                            control={<Radio />}
                            label={""}
                        />
                    ))}
                </RadioGroup>
                <span>Sehr hilfreich</span>
            </div>
          </Box>

            <Divider sx={{ marginY: 2 }} />
        </Stack>
      </Box>

      <Box>
        <Stack sx={{ width: "80%" }}>
          {/* Section: Bio Concepts */}
          <Box sx={{ padding: 1 }}>
          2. Bio Concepts 
          <img src="/abstract.PNG" alt={"Bio Concepts"} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} /> 
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', margin: 1, marginLeft: 2, width: "100%" }}>
            <FormControl component="fieldset" sx={{ marginRight: 2 }}>
              <FormLabel component="legend">Wie hilfreich war die Farbgebung der bio-medizinischen Konzepte für Ihre Suche?</FormLabel>
            </FormControl>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>Überhaupt nicht hilfreich</span>
                <RadioGroup
                    row
                    aria-label="review-scale"
                    name="bioConceptsScale"
                    onChange={handleReviews}
                >
                    {[1, 2, 3, 4, 5].map((value) => (
                        <FormControlLabel
                            key={value}
                            value={String(value)}
                            control={<Radio />}
                            label={""}
                        />
                    ))}
                </RadioGroup>
                <span>Sehr hilfreich</span>
            </div>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', margin: 1, marginLeft: 2, width: "100%" }}>
            <FormControl component="fieldset" sx={{ marginRight: 2 }}>
              <FormLabel component="legend">Inwiefern hat es Ihnen geholfen, die Relevanz des Artikels zu beurteilen?</FormLabel>
            </FormControl>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>Überhaupt nicht hilfreich</span>
                <RadioGroup
                    row
                    aria-label="review-scale"
                    name="extentbioConcepts"
                    onChange={handleReviews}
                >
                    {[1, 2, 3, 4, 5].map((value) => (
                        <FormControlLabel
                            key={value}
                            value={String(value)}
                            control={<Radio />}
                            label={""}
                        />
                    ))}
                </RadioGroup>
                <span>Sehr hilfreich</span>
            </div>
          </Box>
          
          <Divider sx={{ marginY: 2 }} />
        </Stack>
      </Box>

      <Box>
        <Stack sx={{ width: "80%" }}>
        {/* Section: Word Cloud */}
          <Box sx={{ padding: 1 }}>
          3. Word Cloud 
          <img src="/wordcloud.PNG" alt={"Word Cloud"} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
          </Box>
        
          <Box sx={{ display: 'flex', alignItems: 'center', margin: 1, marginLeft: 2, width: "100%" }}>
            <FormControl component="fieldset" sx={{ marginRight: 2 }}>
              <FormLabel component="legend">Wie hilfreich war die Wortwolke für Ihre Suche?</FormLabel>
            </FormControl>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>Überhaupt nicht hilfreich</span>
                <RadioGroup
                    row
                    aria-label="review-scale"
                    name="wordCloudScale"
                    onChange={handleReviews}
                >
                    {[1, 2, 3, 4, 5].map((value) => (
                        <FormControlLabel
                            key={value}
                            value={String(value)}
                            control={<Radio />}
                            label={""}
                        />
                    ))}
                </RadioGroup>
                <span>Sehr hilfreich</span>
            </div>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', margin: 1, marginLeft: 2, width: "100%" }}>
            <FormControl component="fieldset" sx={{ marginRight: 2 }}>
              <FormLabel component="legend">Inwiefern hat es Ihnen geholfen, die Relevanz des Artikels zu beurteilen?</FormLabel>
            </FormControl>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>Überhaupt nicht hilfreich</span>
                <RadioGroup
                    row
                    aria-label="review-scale"
                    name="extentwordcloud"
                    onChange={handleReviews}
                >
                    {[1, 2, 3, 4, 5].map((value) => (
                        <FormControlLabel
                            key={value}
                            value={String(value)}
                            control={<Radio />}
                            label={""}
                        />
                    ))}
                </RadioGroup>
                <span>Sehr hilfreich</span>
            </div>
          </Box>
          <Divider sx={{ marginY: 2 }} />
        </Stack>
      </Box>

        <Box>
          <Stack sx={{ width: "80%"}}>
            <Box sx={{ padding: 1 }}>
              4. Bitte geben Sie abschließend ein Feedback zu Ihrer Gesamterfahrung mit der WisPerMed-Suchmaschine.
            </Box>
            <TextField
              name="likes"
              label="Was hat Ihnen gefallen?"
              variant="outlined"
              multiline
              rows={2}
              sx={{ margin: 1, width: "100%" }}
              onChange={handleReviews}
            />
            <TextField
              onChange={handleReviews}
              label="Was hat Ihnen nicht gefallen?"
              variant="outlined"
              multiline
              rows={2}
              sx={{ margin: 1, width: "100%" }}
              name="notLikes"
            />
            <TextField
              label="Was haben Sie vermisst?"
              name="missed"
              variant="outlined"
              multiline
              rows={2}
              sx={{ margin: 1, width: "100%" }}
              onChange={handleReviews}
            />

            <TextField
              sx={{ padding: 1 }}
              label="Empfehlungen?"
              name="recommendations"
              variant="outlined"
              multiline
              rows={3}
              value={feedback}
              onChange={handleFeedbackChange}
            />

            <Box sx={{ padding: 1 }}>
              <Button type="submit" variant="contained">
              EINREICHEN
              </Button>
            </Box>
          </Stack>
        </Box>

      </Box>
      </form>
    </>
  );
}
