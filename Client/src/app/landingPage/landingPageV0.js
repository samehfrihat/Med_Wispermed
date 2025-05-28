import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import Logo from "../../components/Logo";

const LandingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      {/* Use p-4 instead of p-6 to reduce padding around the main container */}
      <div className="w-full max-w-4xl text-center p-4 bg-white shadow-lg rounded-lg">
        




        <div className="w-full flex flex-col items-center mb-4">
    <Logo className="mb-4" />
    <Typography variant="h3" color="primary" className="text-center mb-4">
        WisPerMed Search Engine
    </Typography>
    <Typography variant="body1" color="textSecondary" className="text-center">
        A new search engine supporting <strong>Level of Evidence</strong> and <strong>biomedical concepts</strong>.
    </Typography>
    </div>




        {/* Use gap-4 instead of gap-6 to reduce space between cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary">Level of Evidence (LoE)</Typography>
              <Typography variant="body2" color="textSecondary">
                Automatically classifies biomedical literature based on empirical evidence robustness, allowing users to filter high-quality research with ease.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" color="primary">Bio-Concepts Extraction</Typography>
              <Typography variant="body2" color="textSecondary">
                Extracts and highlights biomedical entities such as genes, diseases, and chemicals, facilitating quick relevance assessment.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" color="primary">User Study Validation</Typography>
              <Typography variant="body2" color="textSecondary">
                Validated by 131 medical professionals, WisPerMed significantly reduces search time and query volume, outperforming traditional search engines like PubMed.
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Reduced margin-top from mt-6 to mt-4 */}
        <Typography variant="h5" gutterBottom className="mt-4">
          Cited Research Papers
        </Typography>
        <ul className="text-gray-700 list-disc list-inside">
          <li>
            <a href="#" className="text-blue-600 hover:underline">Development and Evaluation of LoE from a System Perspective</a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">Extraction and Evaluation of Biomedical Concepts from a System Perspective</a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">User Study Comparing WisPerMed with PubMed (131 Medical Professionals)</a>
          </li>
        </ul>

        {/* Reduced margin-top to tighten spacing before the button */}
        <Button variant="contained" color="primary" size="large" className="mt-4">
          Get Started with WisPerMed
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
