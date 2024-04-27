import React from 'react';
import { Box, Grid, Link, styled, useTheme, useMediaQuery } from '@mui/material';
import LaptopBoyImage from '../caj.png';
import LinkedInLogo from '../linkedin-logo.svg';
import GitHubLogo from '../github-logo.svg';
import LinkedInIcon from '../linkedin-icon.svg';
import GitHubIcon from '../github-icon.svg';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  width: '100%',
  height: '50px',
}));

const Logo = styled('img')(({ theme }) => ({
  height: '40px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.2)',
  },
}));

const LaptopBoy = styled('img')(({ theme }) => ({
  height: '120px',
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <FooterContainer>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={2}>
          <Link href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <Logo src={isMobile ? LinkedInIcon : LinkedInLogo} alt="LinkedIn" />
          </Link>
        </Grid>
        <Grid item xs={4} />
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Logo src={isMobile ? GitHubIcon : GitHubLogo} alt="GitHub" />
          </Link>
        </Grid>
      </Grid>
      <LaptopBoy src={LaptopBoyImage} alt="Cartoon Chris" />
    </FooterContainer>
  );
};

export default Footer;
