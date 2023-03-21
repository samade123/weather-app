// Import the Fuse.js library
import Fuse from 'fuse.js';
import Papa from 'papaparse';

// Listen for messages from the main thread
self.onmessage = (event) => {
  const { csvPath, searchTerm } = event.data;

  fetch(csvPath)
    .then(response => response.text())
    .then(csvString => {
      // Parse the CSV file into an array of objects
      const csvData = Papa.parse(csvString, { header: true }).data;

      // Create a Fuse.js instance with the options you want
      const fuse = new Fuse(csvData, {
        keys: ['name', 'email'], // Search on the 'name' and 'email' fields
        includeScore: true, // Include the score in the results
      });

      // Search for the searchTerm in the CSV data
      const results = fuse.search(searchTerm);

      // Trim the results to the first 4 matching objects
      const trimmedResults = results.slice(0, 4);

      // Send the results back to the main thread
      self.postMessage(trimmedResults);
    })
    .catch(error => {
      // Send an error message back to the main thread
      self.postMessage({ error: error.message });
    });
};
