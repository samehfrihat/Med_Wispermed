import "./login.css";
import React from "react";
import { useState } from "react";
import { Box } from "@mui/system";
import { Button, Stack, TextField, Container, CardContent, Card, Typography, Link as RouterLink } from "@mui/material";
import Divider from '@mui/material/Divider';
import { useHistory } from "react-router";
import { isEmail, isEmpty } from "../../utils/validators";
import { login } from "./api";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import CircularProgress from "@mui/material/CircularProgress";
// import { buttonClasses } from "@mui/material/Button";
const LoginForm = () => {
  const history = useHistory();
  const doRedirect = () => {
    history.push({ pathname: "/" });
  };

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // const { isAuthorized } = useAuth();
  // if (isAuthorized) {
  //   history.push("/");
  //   return null;
  // }

  const onSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (isEmpty(data.email)) {
      errors.email = "Email is required";
    } else if (!isEmail(data.email)) {
      errors.email = "Email is not valid";
    }

    if (isEmpty(data.password)) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }
    setErrors({});
    try {
      setLoading(true);
      const res = await login(data.email, data.password);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);
      
      setLoading(false);
      doRedirect();
    } catch (error) {
      setResponse(error.data);

      setLoading(false);
    }
  };

  // const chooseGuest = async (e) => {
  //   localStorage.setItem("guest", JSON.stringify(1));
  //   console.log(localStorage.getItem("guest"), "Guesttttt");
  // };

  const handle = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  return (
    <div className="bg">
      <box>
        <Container className="welcome-page" sx={{margin:4,padding:4,display:'flex' ,flexDirection:'column'}}>
          <Box sx={{fontSize:"1.5rem" , fontWeight:'bold',margin:2 }}>
            Welcome to WisPerMed Search Engine!
          </Box>  

          <Typography variant="body1" color="textSecondary" className="text-center">
            A new search engine for <strong>MEDLINE</strong> supporting <strong>level of evidence</strong> and <strong>biomedical concepts</strong>.
          </Typography>
        </Container>

        
<Card 
  sx={{ 
    backgroundColor: 'background.paper', 
    mx: 4, 
    my: 4, 
    cursor: 'pointer', 
    '&:hover': { boxShadow: 6 } 
  }}
>
  <CardContent>
    <Typography variant="body1">
      A video tutorial can be found on YouTube:&nbsp;
      <a 
        href="https://www.youtube.com/watch?v=NIGeFzJA96Y" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ color: '#1976d2', textDecoration: 'underline' }}
      >
        https://www.youtube.com/watch?v=NIGeFzJA96Y
      </a>
    </Typography>

    <Box 
      sx={{ 
        mt: 2, 
        pl: 2, 
        borderLeft: "4px solid #ccc", 
        color: "text.secondary", 
        fontStyle: "italic" 
      }}
    >
      <Typography variant="body2">
        <strong>Note:</strong> We have no connection with the person who created the video, and we did not ask them to create it nor guide them on the search engine.
      </Typography>
    </Box>
  </CardContent>
</Card>

      </box>



      <Box className="containers" id="container"sx={{
                                                      minWidth: '40%', // Ensure minimum width
                                                      display: 'flex',
                                                      justifyContent: 'center',
                                                      p: 2,
                                                      backgroundColor: 'background.paper' // Add temporary background for debugging
                                                    }}
      >
        <Box 
          component="form" 
          onSubmit={onSubmit}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              mb: 4 
            }}
          >
            <Logo mb={1} />
            <Typography color="#546e7a" variant="h6">
              Sign in to your account
            </Typography>
          </Box>
          <Stack 
            spacing={2} 
            sx={{ 
              width: '100%', 
              '& .MuiTextField-root': { // Target all TextFields
                width: '100%' 
              } 
            }}
          >
            <TextField
              type="email"
              value={data.email}
              onChange={handle}
              label="Email address"
              size="small"
              name="email"
              margin="dense"
              error={errors.email}
              helperText={errors.email}
            />

            <TextField
              type="password"
              label="Password"
              size="small"
              value={data.password}
              onChange={handle}
              name="password"
              margin="dense"
              error={errors.password}
              helperText={errors.password}
            />

            {response["status"] === 400 && (
              <Box
                sx={{
                  width: '100%',
                  padding: 1.5,
                  borderRadius: 1,
                  color: "#dc2626",
                  border: "solid 1px #fecaca",
                  marginBottom: 2,
                  fontSize: 14,
                  background: "#fef2f2",
                }}
              >
                {response["error"]}
              </Box>
            )}
          </Stack>

          {/* Action Buttons */}
          <Stack 
            spacing={1}
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            sx={{
              width: '100%',
              justifyContent: 'center',
              '& .MuiButton-root': { // Target all buttons
                flex: 1,
                maxWidth: 200
              }
            }}
          >
            <Button
              startIcon={loading ? <CircularProgress size={14} /> : undefined}
              disabled={loading}
              type="submit"
              color="pallete1"
              variant="contained"
              sx={{ borderRadius: 50 }}
              disableElevation
            >
              Sign In
            </Button>
            
            <Link
              component={Button}
              color="pallete1"
              variant="contained"
              sx={{ borderRadius: 50 }}
              to="/signup"
              disableElevation
            >
              Create Account
            </Link>

            <Link
              color="pallete2"
              variant="contained"
              component={Button}
              to="/guest"
              disableElevation
              sx={{ borderRadius: 50 }}
            >
              Continue as guest
            </Link>
          </Stack>
        </Box>
      </Box>


      <Box sx={{ 
        textAlign: "center", 
        margin: 4, 
        gap: 3, 
        padding: 5, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {[
          {
            title: 'Level of Evidence (LoE)',
            description: 'Automatically classifies biomedical literature based on empirical evidence robustness, allowing users not only to filter high-quality research.'
          },
          {
            title: 'Biomedical Concepts',
            description: 'Extracts and highlights biomedical entities such as genes, diseases, and chemicals, facilitating quick relevance assessment.'
          },
          {
            title: 'User-friendly',
            description: 'Validated by 131 medical professionals, WisPerMed significantly reduces search time and query volume, outperforming traditional search engines like PubMed.'
          }
        ].map((card, index) => (
          <Card 
            key={index}
            sx={{ 
              width: {xs:'100%'},//{ xs: '100%', md: '90%' }, // Same width for all cards
              alignSelf: 'justify',//index % 2 === 0 ? 'flex-start' : 'flex-end',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.2)'
              }
            }}
          >
            <CardContent >
              <Typography variant="h5" color="primary">{card.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {card.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>


      <Typography variant="h5" gutterBottom className="mt-4">
        More Information? Check out our publications!
      </Typography>
      <Box sx={{textAlign: "Left",margin:4, gap:1, padding:0,display:'flex', flexDirection:'column'}}>
        <Card style={{ position: 'relative' }}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">Sameh Frihat, Andrea Papenmeier, and Norbert Fuhr</Typography>
            <Typography variant="body2" color="textSecondary"> Enhancing Biomedical Literature Retrieval with Level of Evidence and Bio-Concepts: A Comparative User Study</Typography>
            <Typography variant="body2" color="textSecondary">Proceedings of the 24th ACM/IEEE Joint Conference on Digital Libraries (JCDL ’24)</Typography>
            <Typography variant="body2" color="textSecondary">Dec 2024</Typography>
          </CardContent>
          <RouterLink 
            href="https://doi.org/10.1145/3677389.3702558" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              position: 'absolute',
              bottom: 16,
              right: 16,
              textDecoration: 'none' // Optional: removes underline
            }}
          >
            <Typography variant="body2" color="primary">
              More info? Read Paper
            </Typography>
          </RouterLink>
        </Card>

        <Card style={{ position: 'relative' }}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">Sameh Frihat and Norbert Fuhr</Typography>
            <Typography variant="body2" color="textSecondary"> Integration of biomedical concepts for enhanced medical literature retrieval</Typography>
            <Typography variant="body2" color="textSecondary">International Journal of Data Science and Analytics</Typography>
            <Typography variant="body2" color="textSecondary">Feb 2025</Typography>
          </CardContent>
          <RouterLink 
            href="https://link.springer.com/article/10.1007/s41060-025-00724-z" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              position: 'absolute',
              bottom: 16,
              right: 16,
              textDecoration: 'none' // Optional: removes underline
            }}
          >
            <Typography variant="body2" color="primary">
              More info? Read Paper
            </Typography>
          </RouterLink>
        </Card>
        <Card style={{ position: 'relative' }}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">Sameh Frihat and Norbert Fuhr</Typography>
            <Typography variant="body2" color="textSecondary">Supporting Evidence Based Medicine by Finding Both Relevant and Significant Works</Typography>
            <Typography variant="body2" color="textSecondary">arXiv preprints</Typography>
            <Typography variant="body2" color="textSecondary">Jul 2024</Typography>
          </CardContent>

          {/* Link positioned absolutely relative to the Card */}
          <RouterLink 
            href="https://arxiv.org/abs/2407.18383" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              position: 'absolute',
              bottom: 16,
              right: 16,
              textDecoration: 'none' // Optional: removes underline
            }}
          >
            <Typography variant="body2" color="primary">
              More info? Read Paper
            </Typography>
          </RouterLink>
        </Card>

      </Box>



    </div>
  );
};

export default LoginForm;
