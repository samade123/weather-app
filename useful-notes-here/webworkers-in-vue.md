# Creating a Web Worker in Vue

To create a Web Worker in Vue, you can follow these general steps:

1. Create a `.js` file that contains the code for the Web Worker. This file should export the Web Worker script as a default export, so that it can be imported and used in your Vue component.

```javascript
// Listen for messages from the main thread
self.onmessage = (event) => {
  const {csvPath, searchTerm } = event.data;
  // console.log("csv", csvPath, searchTerm)
```

2. In your Vue component, create a new instance of it using the new Worker() constructor.

```javascript
const worker = new Worker(
  new URL("@/webworkers/searchCSV.js", import.meta.url)
);
```

3. You can then send messages to the worker using the worker.postMessage() method, and receive messages from the worker using the worker.onmessage event listener.

```javascript
worker.postMessage({ csvPath, searchTerm: searchTerm.value });
worker.onmessage = (event) => {
  console.log("daa", event.data);
  searchResults.value = [...event.data];
};
```

1. Communication from the worker thread to the main thread is done using the ```self.postMessage()``` method


4. Remember to clean up the worker when you are done using it, by calling the close() method. This is done inside the worker.

```javascript
self.postMessage(trimmedResults);
close();
```

## Using Web Workers to Edit a CSV File

In our use case, we had a CSV file containing data on various cities, and we needed to allow the user to search for a city by name. We decided to use a Web Worker to handle the searching, so that it would not block the main thread and cause the app to freeze.

To accomplish this, we created a `searchCSV.js` file that contained the Web Worker script. This script used the `fetch()` function to retrieve the CSV data from the server, and the `Papa.parse()` function to parse the CSV data into an array of objects. It then used the `Fuse()` function from the Fuse.js library to create a fuzzy search index of the data, and returned the search results to the main thread.

In our Vue component, we imported the `searchCSV.js` file using the `import()` function, and created a new instance of the Web Worker whenever the user entered a search term. We then sent the search term to the worker using the `worker.postMessage()` method, and received the search results from the worker using the `worker.onmessage` event listener. Finally, we updated the UI with the search results.
