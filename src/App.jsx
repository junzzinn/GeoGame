import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Stack,
  Backdrop,
  CircularProgress,
  Snackbar,
} from "@mui/material";

import PlainImage from "./components/PlainImage.jsx";
import GuessMap from "./components/GuessMap.jsx";
import TimerBar from "./components/TimerBar.jsx";
import RoundResultDialog from "./components/RoundResultDialog.jsx";
import FinalSummaryDialog from "./components/FinalSummaryDialog.jsx";
import StartDialog from "./components/StartDialog.jsx";

import { getRandomOfflinePanorama } from "./lib/offline.js";
import { haversine, scoreByDistance_km } from "./lib/geo.js";

const ROUNDS = 5;

export default function App() {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const [panoSrc, setPanoSrc] = useState(null);
  const [target, setTarget] = useState(null);
  const [guess, setGuess] = useState(null);
  const [locked, setLocked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [toast, setToast] = useState("");

  const [timerRunning, setTimerRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [resultOpen, setResultOpen] = useState(false);

  const [history, setHistory] = useState([]);
  const [finalOpen, setFinalOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);

  const isLastRound = round >= ROUNDS;
  const totalPoints = useMemo(
    () => history.reduce((acc, r) => acc + (r.points || 0), 0),
    [history]
  );

  async function loadRandomPanorama() {
    setLoading(true);
    setErr(null);
    setPanoSrc(null);
    setTarget(null);
    setGuess(null);
    setLocked(false);
    setShowAnswer(false);
    setResult(null);
    setResultOpen(false);
    setTimerRunning(false);

    try {
      const { src, target } = await getRandomOfflinePanorama();
      console.log("[APP] src:", src, "target:", target);
      setPanoSrc(src);
      setTarget(target);
      setTimerRunning(true);
    } catch (e) {
      setErr(e.message || "Failed to load local panorama.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!startOpen) loadRandomPanorama();
  }, [round, startOpen]);

  function finalizeRound(d, pts) {
    setResult({ d, pts });
    setTimerRunning(false);
    setLocked(true);
    setShowAnswer(true);
    setResultOpen(true);
    setHistory((h) => [...h, { guess, target, distanceKm: d ?? 0, points: pts ?? 0 }]);
    setScore((s) => s + (pts ?? 0));
  }

  function submit() {
    if (!guess || !target || locked) return;
    const d = haversine(guess.lat, guess.lng, target.lat, target.lng);
    const pts = scoreByDistance_km(d);
    finalizeRound(d, pts);
    setToast(`+${pts} pts — ${d.toFixed(1)} km`);
  }

  function handleTimeout() {
    if (locked) return;
    let d = 0;
    if (guess && target) d = haversine(guess.lat, guess.lng, target.lat, target.lng);
    finalizeRound(d, 0);
    setToast(`Time's up — 0 pts`);
  }

  function next() {
    setResultOpen(false);
    if (isLastRound) {
      setFinalOpen(true);
      return;
    }
    setRound((r) => r + 1);
  }

  function restart() {
    setHistory([]);
    setScore(0);
    setRound(1);
    setFinalOpen(false);
    setStartOpen(false);
  }

  function startGame() {
    setStartOpen(false);
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            GeoGame
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Round {round}/{ROUNDS}</Typography>
            <Typography>Score {score}</Typography>
            <Button
              variant="contained"
              onClick={submit}
              disabled={!guess || !target || locked || startOpen}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={next}
              disabled={!locked || startOpen}
            >
              {isLastRound ? "Finish" : "Next"}
            </Button>
            <Button
              variant="text"
              onClick={loadRandomPanorama}
              disabled={loading || startOpen}
            >
              Shuffle
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {!startOpen && (
        <TimerBar seconds={90} running={timerRunning} onTimeout={handleTimeout} />
      )}

      <Box sx={{ flex: 1, p: 2, height: "calc(100vh - 140px)" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            height: "100%",
          }}
        >
          <Box
            sx={{
              height: "100%",
              border: "1px solid #eee",
              borderRadius: 1,
              overflow: "hidden",
              background: "#fafafa",
            }}
          >
            {err ? (
              <Box sx={{ p: 2 }}>
                <Typography color="error">{err}</Typography>
              </Box>
            ) : panoSrc ? (
              <PlainImage src={panoSrc} />
            ) : (
              <Box sx={{ p: 2 }}>
                <Typography>Waiting panorama…</Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              height: "100%",
              border: "1px solid #eee",
              borderRadius: 1,
              overflow: "hidden",
              background: "#fafafa",
            }}
          >
            <GuessMap
              guess={guess}
              target={target}
              showAnswer={showAnswer}
              onGuess={setGuess}
            />
          </Box>
        </Box>
      </Box>

      <Backdrop open={loading} sx={{ color: "#fff", zIndex: (t) => t.zIndex.drawer + 1 }}>
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

      <FinalSummaryDialog
        open={finalOpen}
        rounds={history}
        total={totalPoints}
        onRestart={restart}
        onClose={() => setFinalOpen(false)}
      />

      <StartDialog
        open={startOpen}
        region={"worldCities"}
        setRegion={() => {}}
        onStart={startGame}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={2000}
        onClose={() => setToast("")}
        message={toast}
      />
    </Box>
  );
}
