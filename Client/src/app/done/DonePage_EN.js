import { Box, Stack } from '@mui/material';
import { Link } from "react-router-dom";

export default function DonePage() {
  return (
    <>
      <Box p={1} sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>
      Thank You for Participating in Our User Study!{" "}
      </Box>
      <Stack spacing={2} paddingX={2} marginX={2}>
      <Box>
      <br />
      <br />
      Thank you for being an integral part of this user study.
      </Box>
      <Box>
      Your commitment to improving user experiences has made a significant difference, and we are genuinely grateful for your contribution. 
      </Box>
      <Box>
      If you have any questions or would like to share additional thoughts, please feel free to reach out.
      <br />
      <br />
      <br />
      Sameh Frihat
      <br />
      <a href="mailto:Sameh.Frihat@uni-due.de">Sameh.Frihat@uni-due.de</a>
      <br />
      University of Duisburg-Essen
      </Box>
      <Box>More information about WisPerMed can be found under: <Link to={{ pathname: 'https://wispermed.com/'}} target="_blank">WisPerMed.com</Link></Box>
      </Stack>
    </>
  );
}
