import { useEffect, useState } from "react";
import { LinearProgress, Box, Typography } from "@mui/material";

export default function TimerBar({ seconds=90, running, onTimeout }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (!running) return;
    setLeft(seconds);
    const id = setInterval(() => {
      setLeft(prev => {
        if (prev <= 1) { clearInterval(id); onTimeout?.(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, seconds, onTimeout]);

  const pct = left > 0 ? (left/seconds)*100 : 0;

  return (
    <Box sx={{ px:2, py:1 }}>
      <Typography variant="caption">Time left: {left}s</Typography>
      <LinearProgress variant="determinate" value={pct} />
    </Box>
  );
}
