// UrlShortener.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const UrlShortener = () => {
  const [originalUrls, setOriginalUrls] = useState(Array(5).fill(''));
  const [validityPeriods, setValidityPeriods] = useState(Array(5).fill(''));
  const [preferredShortcodes, setPreferredShortcodes] = useState(Array(5).fill(''));
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [clickData, setClickData] = useState({});

  useEffect(() => {
    const storedClickData = localStorage.getItem('clickData');
    if (storedClickData) {
      setClickData(JSON.parse(storedClickData));
    }
  }, []);

  const handleShortenUrls = () => {
    const newShortenedUrls = [];
    originalUrls.forEach((originalUrl, index) => {
      if (originalUrl) {
        const shortcode = preferredShortcodes[index] || uuidv4().slice(0, 6);
        const shortenedUrl ='https://short.url/${shortcode}';
        const expiryDate = validityPeriods[index]
          ? new Date(Date.now() + parseInt(validityPeriods[index]) * 60 * 1000)
          : null;
        newShortenedUrls.push({ originalUrl, shortenedUrl, expiryDate });
      }
    });
    setShortenedUrls(newShortenedUrls);
  };

  const handleTrackClick = (shortcode) => {
    setClickData((prevClickData) => {
      const newClickData = { ...prevClickData };
      newClickData[shortcode] = (newClickData[shortcode] || 0) + 1;
      localStorage.setItem('clickData', JSON.stringify(newClickData));
      return newClickData;
    });
  };

  return (
    <Box p={2}>
      <Typography variant="h4">URL Shortener</Typography>
      <Grid container spacing={2}>
        {originalUrls.map((originalUrl, index) => (
          <Grid item key={index} xs={12}>
            <TextField
              label="Original URL"
              value={originalUrl}
              onChange={(e) => {
                const newOriginalUrls = [...originalUrls];
                newOriginalUrls[index] = e.target.value;
                setOriginalUrls(newOriginalUrls);
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Validity Period (minutes)"
              value={validityPeriods[index]}
              onChange={(e) => {
                const newValidityPeriods = [...validityPeriods];
                newValidityPeriods[index] = e.target.value;
                setValidityPeriods(newValidityPeriods);
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Preferred Shortcode"
              value={preferredShortcodes[index]}
              onChange={(e) => {
                const newPreferredShortcodes = [...preferredShortcodes];
                newPreferredShortcodes[index] = e.target.value;
                setPreferredShortcodes(newPreferredShortcodes);
              }}
              fullWidth
              margin="normal"
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleShortenUrls}>
            Shorten URLs
          </Button>
        </Grid>
        {shortenedUrls.map((shortenedUrl, index) => (
          <Grid item key={index} xs={12}>
            <Typography variant="body1">
              Original URL: {shortenedUrl.originalUrl}
            </Typography>
            <Typography variant="body1">
              Shortened URL:{' '}
              <a href={shortenedUrl.shortenedUrl} target="_blank" rel="noopener noreferrer">
                {shortenedUrl.shortenedUrl}
              </a>
            </Typography>
            <Typography variant="body1">
              Expiry Date: {shortenedUrl.expiryDate ? shortenedUrl.expiryDate.toISOString() : 'N/A'}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleTrackClick(shortenedUrl.shortenedUrl.slice(-6))}
            >
              Track Click
            </Button>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Typography variant="h4">URL Shortener Statistics</Typography>
          <ul>
            {Object.entries(clickData).map(([shortcode, count]) => (
              <li key={shortcode}>
                {shortcode}: {count} clicks
              </li>
            ))}
          </ul>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UrlShortener;