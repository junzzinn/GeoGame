import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Chip } from "@mui/material";

export default function RoundResultDialog({ open, distanceKm, points, onNext, onClose, isLast }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Round result</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip label={`${distanceKm?.toFixed(1) ?? "-"} km`} />
          <Chip label={`+${points ?? 0} pts`} color="primary" />
        </Stack>
      </DialogContent>
      <DialogActions>
        {!isLast && <Button onClick={onNext} variant="contained">Next</Button>}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
