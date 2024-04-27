import React from 'react';
import { Box, Grid, Link, styled, useTheme, useMediaQuery } from '@mui/material';
import LaptopBoyImage from '../caj.png';
import LinkedInLogo from '../linkedin-logo.svg';
import GitHubLogo from '../github-logo.svg';
import LinkedInIcon from '../linkedin-icon.svg';
import GitHubIcon from '../github-icon.svg';
import styles from './Footer.module.css';

interface FooterProps {
  style?: React.CSSProperties;
}

const Logo = styled('img')(({ theme }) => ({
  height: '40px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.2)',
  },
}));

const Footer: React.FC<FooterProps> = ({ style }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <footer className={styles.footer}>
      <Box sx={{ backgroundColor: theme.palette.grey[300], ...style }}>
        <div className={styles.footerContent}>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={2}>
              <Link href="https://www.linkedin.com/in/creativityanddesign" target="_blank" rel="noopener noreferrer">
                <Logo src={isMobile ? LinkedInIcon : LinkedInLogo} alt="LinkedIn" />
              </Link>
            </Grid>
            <Grid item xs={4} />
            <Grid item xs={2} style={{ textAlign: 'right' }}>
              <Link href="https://github.com/cajcodes" target="_blank" rel="noopener noreferrer">
                <Logo src={isMobile ? GitHubIcon : GitHubLogo} alt="GitHub" />
              </Link>
            </Grid>
          </Grid>
        </div>
      </Box>
      <img src={LaptopBoyImage} alt="Cartoon Chris" className={styles.laptopBoy} />
    </footer>
  );
};

export default Footer;
