

import React, { useContext, useState } from "react";
import { Button, Stack, Container, Box, CardContent, Card, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Image from '../../components/Image';

const LandingPage = () => {


  return (
    <Container maxWidth="md">
        <Stack spacing={2} paddingTop={4}>
            <Container className="welcome-page" sx={{margin:4,padding:4,display:'flex' ,flexDirection:'column'}}>
                <Box sx={{padding: "1vh", justifyContent:'flex-start'}}>
                    <Image src="../WisPerMed.png" />
                </Box>

                <Box sx={{fontSize:"1.5rem" , fontWeight:'bold',margin:2 }}>
                    Welcome to WisPerMed Search Engine!
                </Box>  

                <Typography variant="body1" color="textSecondary" className="text-center">
                    A new search engine supporting <strong>Level of Evidence</strong> and <strong>biomedical concepts</strong>.
                </Typography>
            </Container>



        {/* Use gap-4 instead of gap-6 to reduce space between cards */}
        <Card>
            <CardContent>
              <Typography variant="h5" color="primary">Level of Evidence (LoE)</Typography>
              <Typography variant="body2" color="textSecondary">
                Automatically classifies biomedical literature based on empirical evidence robustness, allowing users not only to filter high-quality research.
              </Typography>
            </CardContent>
        </Card>

        <Card>
            <CardContent>
              <Typography variant="h5" color="primary">Biomedical Concepts</Typography>
              <Typography variant="body2" color="textSecondary">
                Extracts and highlights biomedical entities such as genes, diseases, and chemicals, facilitating quick relevance assessment.
              </Typography>
            </CardContent>
        </Card>

        <Card>
            <CardContent>
              <Typography variant="h5" color="primary">User Study</Typography>
              <Typography variant="body2" color="textSecondary">
                Validated by 131 medical professionals, WisPerMed significantly reduces search time and query volume, outperforming traditional search engines like PubMed.
              </Typography>
            </CardContent>
        </Card>
       

        <Box sx={{textAlign: "center",margin:4,padding:10,display:'flex', flexDirection:'column'}}>
            <Button variant="contained" color="primary" size="large"
            onClick={() => window.location.href = "/login"}
            sx={{ width: "60%", margin: "auto", marginTop: 2 }}
            > TRY Now! </Button>
        </Box>


        {/* Reduced margin-top from mt-6 to mt-4 */}
        <Typography variant="h5" gutterBottom className="mt-4">
          Move Information? Check out our publications!
        </Typography>
        <ul className="text-gray-700 list-disc list-inside">
          <li>
            <a href="https://wispermed.org/publication/frihat-jcdl24/" className="text-blue-600 hover:underline">User Study Comparing WisPerMed with PubMed (131 Medical Professionals)</a>
          </li>
          <li>
            <a href="https://wispermed.org/publication/frihat-loe-2024/" className="text-blue-600 hover:underline">Development and Evaluation of LoE from a System Perspective</a>
          </li>
          <li>
            <a href="https://wispermed.org/publication/frihat-bioconcepts-2025/" className="text-blue-600 hover:underline">Extraction and Evaluation of Biomedical Concepts from a System Perspective</a>
          </li>
        </ul>

        
        


        </Stack>
    </Container>
  );
};

export default LandingPage;
