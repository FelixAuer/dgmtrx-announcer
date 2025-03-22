# Disc Golf Metrix Live Announcer

This Chrome extension provides real-time audio commentary for Disc Golf Metrix tournaments. It announces player scores, standings, and key moments as they happen.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/FelixAuer/dgmtrx-announcer
   cd dgmtrx-announcer
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Build the extension:

   ```sh
   npm run build
   ```

4. Load the extension in Chrome:

    - Open `chrome://extensions/`
    - Enable "Developer mode" (toggle in the top right corner)
    - Click "Load unpacked"
    - Select the `dist` folder inside the cloned repository

## Usage

### Starting a Broadcast

1. Navigate to the tournament overview page on Disc Golf Metrix.
2. Ensure that it is the **only** open Metrix tab (this is very important!).
3. Refresh the page.
4. Click the extension icon in Chrome.
5. Click the "Start Broadcast" button.

### Following Players

To receive announcements for specific players, **select the checkbox next to their name** on the tournament overview page.

### Stopping or Changing Tournaments

- To start a new broadcast for a different tournament, you **must stop the previous broadcast first.**
- Click the extension icon and press "Stop Broadcast."
- Then, repeat the steps above to start a new broadcast.


