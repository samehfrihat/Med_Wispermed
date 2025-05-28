import { Box, Button, Container, Stack } from '@mui/material';
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Image from '../../components/Image';


const WelcomePage = () => {
  const [readConditions, setReadConditions] = useState(false);
  const [isEighteenOrOlder, setIsEighteenOrOlder] = useState(false);

  return (
    <Container className="welcome-page" sx={{margin:4,padding:4,display:'flex' ,flexDirection:'column'}}>
                <Box sx={{ padding: "1vh" , justifyContent:'flex-start'  }}>
            <Image src="../WisPerMed.png" />
          </Box>
      <Box sx={{fontSize:"1.5rem" , fontWeight:'bold',margin:2 }}>Willkommen zu unserer Studie zur medizinischen Literatursuche!</Box>
      <Stack spacing={2} paddingX={2} marginX={2}>
      <Box>
      Vielen Dank, dass Sie an unserer Studie teilnehmen, die darauf abzielt, Suchmaschinen für medizinisches Fachpersonal zu verbessern.
      </Box>
      <Box>
      Diese Studie ist Teil des WisPerMed RTG. Wir sind ein interdisziplinäres Team aus Informatikern, Psychologen und Ärzten. Unser Ziel ist es, die Personalisierung von medizinischem Wissen und die datenbasierte Entscheidungsunterstützung am Point of Care voranzutreiben.
      </Box>
      <Box>
      Ihre Teilnahme ist vollständig freiwillig und Sie können jederzeit ohne Verpflichtungen von der Studie zurücktreten. Mit Ihrer Teilnahme erklären Sie sich einverstanden, dass die gesammelten Daten in einem Forschungspapier präsentiert werden. Wir sammeln keine sensiblen Daten, die Sie identifizieren können. Ihre Privatsphäre ist geschützt. Im Forschungspapier werden ausschließlich die aggregierten Ergebnisse aller Teilnehmer veröffentlicht.
      </Box>
      <Box>
      Während dieser Studie werden Ihnen zwei spezifische Aufgaben zur medizinischen Literatursuche gestellt, und die Studie wird voraussichtlich etwa 15 Minuten dauern. Ihre Beiträge werden erheblich zu unseren laufenden Forschungsbemühungen beitragen.
      </Box>
      <Box>
      Bei Fragen zur Studie zögern Sie bitte nicht, Kontakt aufzunehmen mit:
      <br />
      <br />
      Sameh Frihat
      <br />
      <a href="mailto:Sameh.Frihat@uni-due.de">Sameh.Frihat@uni-due.de</a>
      <br />
      Duisburg-Essen Universität
      </Box>
      <Box>
      
      <div>
      <div>
        <label>
          <input
            type="checkbox"
            style={{ width: '15px', height: '15px' }} // Adjust the size here
            checked={readConditions}
            onChange={() => setReadConditions(!readConditions)}
          />
          &nbsp; Ich habe die oben genannten Bedingungen gelesen.
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            style={{ width: '15px', height: '15px' }} // Adjust the size here
            checked={isEighteenOrOlder}
            onChange={() => setIsEighteenOrOlder(!isEighteenOrOlder)}
          />
          &nbsp; Ich bin 18 Jahre oder älter.
        </label>
      </div>
    </div>

      </Box>
      <Link to="/studycase/login">
        <Button variant="contained" color="primary" disabled={!isEighteenOrOlder || !readConditions}>
          Los geht's!
        </Button>
      </Link>
      <Box>Weitere Informationen zu WisPerMed finden Sie unter: <Link to={{ pathname: 'https://wispermed.com/'}} target="_blank">WisPerMed.com</Link></Box>
      </Stack>
    </Container>
  );
};

export default WelcomePage;
