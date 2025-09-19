import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Table, TableHead, TableRow, TableCell, TableBody, Typography, Stack, Chip
} from "@mui/material";

export default function FinalSummaryDialog({ open, rounds, total, onRestart, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Game Over</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip label={`Total: ${total} pts`} color="primary" />
          <Chip label={`Rounds: ${rounds.length}`} />
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Guess (lat, lng)</TableCell>
              <TableCell>Answer (lat, lng)</TableCell>
              <TableCell align="right">Distance (km)</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rounds.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  {r.guess ? `${r.guess.lat.toFixed(4)}, ${r.guess.lng.toFixed(4)}` : <Typography variant="body2" color="text.secondary">—</Typography>}
                </TableCell>
                <TableCell>
                  {r.target ? `${r.target.lat.toFixed(4)}, ${r.target.lng.toFixed(4)}` : "—"}
                </TableCell>
                <TableCell align="right">{r.distanceKm?.toFixed(1) ?? "0.0"}</TableCell>
                <TableCell align="right">{r.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onRestart}>Restart</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
