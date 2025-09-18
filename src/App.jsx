import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
  Container,
  Grid,
} from "@mui/material";

import PanoramaViewer from "./components/PanoramaViewer.jsx";
import GuessMap from "./components/GuessMap.jsx";
import TimerBar from "./components/TimerBar.jsx";
import RoundResultDialog from "./components/RoundResultDialog.jsx";

import { getRandomImageFromRegions } from "./lib/mapillary.js";
import { haversine, scoreByDistance_km } from "./lib/geo.js";

const ROUNDS = 5;

export default function App() {
  const [region, setRegion] = useState("worldCities");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const [imageId, setImageId] = useState(null);
  const [target, setTarget] = useState(null);
  const [guess, setGuess] = useState(null);
  const [locked, setLocked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [timerRunning, setTimerRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [resultOpen, setResultOpen] = useState(false);

  async function loadRandomPanorama() {
    setLoading(true);
    setErr(null);
    setGuess(null);
    setLocked(false);
    setResult(null);
    setResultOpen(false);
    setTimerRunning(false);

    try {
      const { imageId, target } = await getRandomImageFromRegions(region);
      setImageId(imageId);
      if (target) {
        setTarget(target);
        setTimerRunning(true);
      }
    } catch (e) {
      setErr(e.message || "Failed to load panorama.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRandomPanorama();
  }, [round, region]);

  function handlePanoramaReady(pos) {
    if (pos) {
      setTarget(pos);
      setTimerRunning(true);
    }
  }

  function submit() {
    if (!guess || !target || locked) return;
    setLocked(true);
    const d = haversine(guess.lat, guess.lng, target.lat, target.lng);
    const pts = scoreByDistance_km(d);
    setScore((s) => s + pts);
    setResult({ d, pts });
    setTimerRunning(false);
    setResultOpen(true);
  }

  function handleTimeout() {
    if (locked) return;
    setTimerRunning(false);
    setLocked(true);
    let d = 0;
    if (guess && target) {
      d = haversine(guess.lat, guess.lng, target.lat, target.lng);
    }
    setResult({ d, pts: 0 });
    setResultOpen(true);
  }

  function next() {
    setResultOpen(false);
    if (round < ROUNDS) {
      setRound((r) => r + 1);
    }
  }

  const isLastRound = round >= ROUNDS;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            GeoGame
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Region</InputLabel>
              <Select
                label="Region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={loading || timerRunning}
              >
                <MenuItem value="worldCities">World (Sample Cities)</MenuItem>
                <MenuItem value="brazil">Brazil</MenuItem>
                <MenuItem value="europe">Europe</MenuItem>
                <MenuItem value="japan">Japan</MenuItem>
              </Select>
            </FormControl>

            <Typography>Round {round}/{ROUNDS}</Typography>
            <Typography>Score {score}</Typography>

            <Button
              variant="contained"
              onClick={submit}
              disabled={!guess || !target || locked}
            >
              Submit
            </Button>

            <Button
              variant="outlined"
              onClick={next}
              disabled={!locked || isLastRound}
            >
              Next
            </Button>

            <Button
              variant="text"
              onClick={loadRandomPanorama}
              disabled={loading}
            >
              Shuffle
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <TimerBar seconds={90} running={timerRunning} onTimeout={handleTimeout} />

      <Container maxWidth="xl" sx={{ flex: 1, py: 1 }}>
        <Grid container spacing={1} sx={{ height: "100%" }}>
          <Grid item xs={12} md={6} sx={{ height: { xs: 360, md: "calc(100vh - 160px)" } }}>
            <Box sx={{ height: "100%", border: "1px solid #eee", borderRadius: 1, overflow: "hidden" }}>
              {err ? (
                <Box sx={{ p: 2 }}><Typography color="error">{err}</Typography></Box>
              ) : imageId ? (
                <PanoramaViewer imageId={imageId} onImage={handlePanoramaReady} />
              ) : (
                <Box sx={{ p: 2 }}><Typography>Waiting panorama…</Typography></Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6} sx={{ height: { xs: 360, md: "calc(100vh - 160px)" } }}>
            <Box sx={{ height: "100%", border: "1px solid #eee", borderRadius: 1, overflow: "hidden" }}>
              <GuessMap guess={guess} onGuess={setGuess} />
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (t) => t.zIndex.drawer + 1 }}
      >
        <CircularProgress />
      </Backdrop>

      <RoundResultDialog
        open={!!resultOpen}
        distanceKm={result?.d}
        points={result?.pts}
        onNext={next}
        onClose={() => setResultOpen(false)}
        isLast={isLastRound}
      />
    </Box>
  );
}
