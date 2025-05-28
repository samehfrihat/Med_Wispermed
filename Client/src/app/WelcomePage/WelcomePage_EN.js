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
      <Box sx={{fontSize:"1.5rem" , fontWeight:'bold',margin:2 }}>Welcome to our medical literature search study!</Box>
      <Stack spacing={2} paddingX={2} marginX={2}>
      <Box>
        Thank you for participating in our study, aimed at improving medical
        search engines for medical practitioners.
      </Box>
      <Box>
      This user study is part of WisPerMed RTG. We are a highly diversified and interdisciplinary team of computer scientists, psychologists, and physicians. Our goal is to advance the personalization of medical knowledge and data-based decision support at the Point of Care.
      </Box>
      <Box>
      We want to emphasize that your participation is entirely voluntary, and you may withdraw from the study at any time without any obligation. By taking part, you agree to present the collected data in a research paper. We won’t collect sensitive data that could help us identify you, Your privacy is protected. The data will contain the aggregated findings from all participants. 
      </Box>
      <Box>
      During this study, you will be given two specific medical literature search tasks to complete, and the study is expected to take approximately 15 minutes. Your contributions will significantly contribute to our ongoing research efforts. 
      </Box>
      <Box>
      For questions about the study, please do not hesitate to contact:
      <br />
      <br />
      Sameh Frihat
      <br />
      <a href="mailto:Sameh.Frihat@uni-due.de">Sameh.Frihat@uni-due.de</a>
      <br />
      University of Duisburg-Essen
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
          &nbsp; I have read the above-mentioned conditions
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
          &nbsp; I am 18 years or older.
        </label>
      </div>
    </div>

      </Box>
      <Link to="/studycase/login">
        <Button variant="contained" color="primary" disabled={!isEighteenOrOlder || !readConditions}>
          Let's begin!
        </Button>
      </Link>
      <Box>More information about WisPerMed can be found under: <Link to={{ pathname: 'https://wispermed.com/'}} target="_blank">WisPerMed.com</Link></Box>
      </Stack>
    </Container>
  );
};

export default WelcomePage;
