import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Stack, Typography } from "@mui/material";

export default function StartDialog({ open, region, setRegion, onStart }) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Start a new game</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2">Choose a region and press Start. You have 90s per round.</Typography>
          <FormControl size="small" fullWidth>
            <InputLabel>Region</InputLabel>
            <Select label="Region" value={region} onChange={(e) => setRegion(e.target.value)}>
              <MenuItem value="worldCities">World (Sample Cities)</MenuItem>
              <MenuItem value="brazil">Brazil</MenuItem>
              <MenuItem value="europe">Europe</MenuItem>
              <MenuItem value="japan">Japan</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onStart}>Start</Button>
      </DialogActions>
    </Dialog>
  );
}
