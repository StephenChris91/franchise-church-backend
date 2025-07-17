// src/utils/generatePeaks.js
const fs = require("fs");
const path = require("path");
const { createPeaks } = require("wavesurfer.js/dist/plugins/peaks.js");

module.exports = async function generatePeaks(audioPath) {
  const fileData = fs.readFileSync(audioPath);
  const peaks = await createPeaks(fileData.buffer, {
    splitChannels: false,
    waveformBars: 1000,
  });
  return peaks[0]?.data || [];
};
