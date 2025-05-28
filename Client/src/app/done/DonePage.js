import { Box, Stack } from '@mui/material';
import { Link } from "react-router-dom";

export default function DonePage() {
  return (
    <>
      <Box p={1} sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>
      Vielen Dank für Ihre Teilnahme an unserer Studie!{" "}
      </Box>
      <Stack spacing={2} paddingX={2} marginX={2}>
      <Box>
      <br />
      <br />
      Vielen Dank, dass Sie ein wesentlicher Teil dieser Studie waren.
      </Box>
      <Box>
      Mit Ihren Antworten unterstützen Sie uns dabei, die Nutzererfahrung der WisPerMed Suchmaschine zu verbessern und schlussendlich die Arbeit am Point of Care zu vereinfachen. Vielen Dank, dass Sie sich Zeit für uns genommen haben!
      </Box>
      <Box>
      Wenn Sie Fragen haben oder zusätzliche Gedanken teilen möchten, zögern Sie bitte nicht, uns zu kontaktieren.
      <br />
      <br />
      <br />
      Sameh Frihat
      <br />
      <a href="mailto:Sameh.Frihat@uni-due.de">Sameh.Frihat@uni-due.de</a>
      <br />
      Duisburg-Essen Universität
      </Box>
      <Box>Weitere Informationen über WisPerMed finden Sie unter: <Link to={{ pathname: 'https://wispermed.com/'}} target="_blank">WisPerMed.com</Link></Box>
      </Stack>
    </>
  );
}
