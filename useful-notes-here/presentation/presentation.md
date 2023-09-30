---
marp: true
theme: gaia
transition: cover
# class: gaia
---

<style>

    section {
        display: grid;
        grid-template-columns: 47% auto;
    }
    h1, h2, h3 {
        grid-column: span 2;
    }
    h1 {
        font-size: 1.4rem;
    }
    h2 {
        font-size: 1rem;
    }

    img {
        max-width: 100%;
    }
</style>

# Weather project overview

## By Samuel Ademola

![weather-iphone.webp](weather-iphone.webp)

![weather-iphone.webp](weather-ipad.png)


---

<style scoped>
ul {
    grid-column: span 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
}
   
</style>

# Project

_A weather PWA_

## Project features

- PWA
- interacts with an API
- Page themeing based on data
- City based search functionality
- Adaptive design

---

<style scoped>
ul {
    grid-column: span 2;
}
</style>

## Project focus

- Theme redesign/New theme
  - Most of the code, I had built previously so this was more of a UX project
- Improve perfomance and stability
- Implement Search

<!-- The focus of this project and more so of this presentationis ofthe followin:

you can consider this project as built in 2 parts::
previously i had already built a theme and the data themeing fot the was present in the opriginal theme

so what i was adding ais a new theme and a diffrent method in api based styling
looking to improve performance andalso to add  -->

---

# Demonstaration


<style scoped>
 section {
    display: grid;
    grid-template-columns: auto;
    place-items: center
}

</style>
<!-- show demonstration of how the project works -->

---

<style scoped>
ul {
    grid-column: 1/span 1;
}
section {
    gap:  0 1.4em
}
   
</style>

# Project structure

```
├── api
├── dist
├── node_modules
├── public
├── src
│   ├── api
│   ├── assets
│   ├── components
│   ├── composables
│   ├── router
│   ├── stylesheets
│   ├── views
│   └── webworkers
└── useful-notes-here
```

<!-- serverless functions are kepty in the api directory
dist holds thefiles that are uploaded to vercel cdn
typical vue setup where my components are held in components and my reusable javascript snippets/functions are held in composables
- the old theme makes use of routes and single page url redirecting
- - i also keep a directory of notes of useful code snippets i found working on the project -->

<span>

### Project Stack

- Built on Vue
- Site and assets are served through Vercel
- Serveless function also through vercel
- Api from https://www.weatherapi.com/

</span>

---

<style>
svg[id^="mermaid-"] { 
    min-width: 100%; 
    min-height: 100%; 
}
div.mermaid {
    grid-column: span 2;
}
</style>

<!-- basic system diagram 

 -->

<div class="mermaid">
sequenceDiagram
    actor User
    User ->> Frontend: Sends location data
    Frontend ->> ServerlessFunction: Sends request to the serverless function
    note right of Frontend: Data can be latitude and longitude or a location name
    ServerlessFunction ->> WeatherAPI: Sends request to the weather API
    WeatherAPI ->> ServerlessFunction: Returns weather data
    ServerlessFunction ->> Frontend: Returns weather data
    alt City data requested
        Frontend ->> CityCSVDatabase: Requests city data
        CityCSVDatabase ->> Frontend: Returns city data
    else City data not requested
    end
    Frontend ->> User: Displays weather & city data</div>

---

<style scoped>

section {
    gap:  0 1.4em
}

section p:has(a) {
 grid-column: span 2;
}

img {
    /* aspect-ratio: 12/9; */
    max-width: 50vw;
    max-height: 300px;
}
   
</style>

# Design Inspo

![weather-iphone.webp](design-inspo1.webp)

![weather-iphone.webp](design-inspo2.webp)

[https://dribbble.com/sam4356/collections/6353619-Weather-app](https://dribbble.com/sam4356/collections/6353619-Weather-app)

---

# Interesting features

<style scoped>
 section {
    display: grid;
    grid-template-columns: auto;
    place-items: center
}
</style>


---

# Search

- Fast (So want to avoid API)
  - lightweight solution(if local)
- Extensive search
- Asynchronous
  - non ui blocking

## Solution

<span>
Web worker with a csv database in the front end
</span>
  
  

<style scoped>

section {
    gap:  0.1em 1.4em;
    /* grid-template-columns: 1fr 1fr; */
}
span {
    grid-column: span 2;
}
h2 {
     grid-column: 1/span 1;
}

section :is(pre,marp-pre) {
    grid-column: 2/span 1;
    grid-row: 2/span 1;
    font-size: 0.8rem;
}

section :is(pre,marp-pre):last-of-type {
    /* display: none; */
}   
</style>

```javascript
const search = () => {
  if (!searchTerm.value) {
    searchResults.value.length = 0;
    return;
  }
  const worker = new Worker(
    new URL("@/webworkers/searchCSV.js", import.meta.url)
  );

  worker.postMessage({ searchTerm: searchTerm.value });

  worker.onmessage = (event) => {
    searchResults.value = [...event.data];
  };
};
```

---

<style scoped>

section {
    gap:  0 1.4em;
    grid-template-columns: auto;
}

section :is(pre,marp-pre) {
    grid-column: span 1;
    /* height: 100%; */
}

/* section :is(pre,marp-pre):last-of-type {
    display: none;
} */
</style>

```javascript
// Listen for messages from the main thread
self.onmessage = (event) => {
  const {searchTerm } = event.data;
  // console.log("csv", searchTerm)

  fetch("./../assets/cities-new.csv")
    .then((response) => response.text())
    .then((csvString) => {
      // Parse the CSV file into an array of objects
      const csvData = Papa.parse(csvString, { header: true }).data;

      // Create a Fuse.js instance with the options you want
      const fuse = new Fuse(csvData, {
        keys: ["name"], // Search on the 'name' and 'email' fields
        includeScore: true, // Include the score in the results
      });
```

---

<style scoped>

section {
    gap:  0 1.4em;
    grid-template-columns: auto;
}

section :is(pre,marp-pre) {
    grid-column: span 1;
    /* height: 100%; */
}

/* section :is(pre,marp-pre):last-of-type {
    display: none;
} */
</style>

```javascript
      // Search for the searchTerm in the CSV data
      const results = fuse.search(searchTerm);

      // Trim the results to the first 4 matching objects
      const trimmedResults = results.slice(0, 4);

      // Send the results back to the main thread
      self.postMessage(trimmedResults);
      close();
    })
    .catch((error) => {
      // Send an error message back to the main thread
      console.log({ error: error.message })
      self.postMessage({ error: error.message });
    });
};
// Export the worker script as a default export
export default "searchCSV.js";
```

---

# Data based styling/theming

<style scoped>



section :is(pre,marp-pre) {
    grid-column: 2;
}

section :is(pre,marp-pre):nth-of-type(2) {
    grid-column: 1/span 2;
}

ul {
    font-size: 0.8rem;
}
 
</style>

- LUT
- The api provides conditions code/names for day/night
- Based on the object in the LUT weather data we get the svg which best represents the condition and then apply a class to the svg

```javascript
{
        "code": 1003,
        "day": "Partly cloudy",
        "night": "Partly cloudy",
        "icon": 116,
        "day-img": "partly-cloudy-day.svg",
        "night-img": "partly-cloudy-night.svg",
        "night-css": "cloudy",
        "day-css": "cloudy"
},
```

```javascript
      let svgName = conditionIsDay ? weatherLUT.find(({ day }) => day == props.condition) : weatherLUT.find(({ night }) => night == props.condition)
...

        svgSrc.value = require(`@/assets/svg/${svgName[conditionIsDay ? 'day-img' : 'night-img']}`);


```

---

# Data based styling/theme

<style scoped>

section :is(pre,marp-pre) {
    grid-column: span 2;
    font-size: 0.7em;
}

ul {
    font-size: 0.8rem;
}
 
</style>

<!-- - use css  -->

```css
:root:has(img.icon.snow) {
  @media (min-width: 0px) {
    // and at 500px and 1200px
    div.outer-bg {
      background: url("./../assets/theme-new/bg-1200.webp") center / cover
        no-repeat;
    }
  }
}
```
<!-- Use of media queries and the css has selector based on the class applied tot he svg image is used to apply theming onto the background
downside to this approach is that it currently doesn't have support on firefox -->
---

<style scoped>

section {   
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0 0.8em
}

:is(h1, h2, h3) {
    grid-column: span 3;
    margin: 0;
}
h3 {
    font-size: 1.2em
}
 
</style>

# Page load performance in my weather SPA

### My control for page performance - google lighthouse

FCP - First Contentful Paint

TBT - Total Blocking Time

LCP - largest Contentful Paint

5.5s -> 1.9s

0ms -> 110ms

5.5s -> 3.9s

<!-- FCP - how long it takes for the first image/element to appear on the page 
TBT - Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds - time spent blocked from resources loading
LCP- time it takes for the largest element to load - usually pictures-->

---
<style scoped>

section :not(h1, h2, h3) {   
    font-size: 0.7rem;
}
</style>


# Page load performance in my weather SPA(contd)

## Suggestions by lighthouse

**Eliminate render-blocking resources - main css file - 1.31s
reduce unused javascript - 1.2s**
- lottie js 90.3/335 kbs
- vuesax.common.js 66kbs
- gsap-core.js 15.3kbs


## steps to fix this
- I created my own vue js Lottie player component and used a lazy-loaded script tag  
- recreated the CSS I used Vuesax common for and created my own slider component


* recreated my vue trasnitions using css only and removed gsap

---
<style scoped>

section :is(pre,marp-pre) {
    grid-column: span 2;
    font-size: 1rem;
}

pre {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
}
</style>

```javascript
const loadLottieWeb = () => {
            return new Promise((resolve, reject) => {
                // Check if window.lottie is already defined
                if (window.lottie) {
                    resolve(window.lottie);
                } else {
                    // Check if script tag for lottie-web already exists
                    const existingScript = document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.11.0/lottie.min.js"]');
                    if (existingScript) {
                        existingScript.addEventListener('load', () => {
                            resolve(window.lottie);
                        });
                    } else {
                        // If script tag does not exist, create new one and append to document head
                        const script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.async = true;
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.11.0/lottie.min.js';

                        script.onload = () => {
                            resolve(window.lottie);
                        };

                        script.onerror = () => {
                            reject(new Error('Failed to load lottie-web script'));
                        };

                        document.head.appendChild(script);
                    }
                }
            });
        };
```
<!-- This code uses the sigleton design laguage and promises to import the new lottie player asynchronously. based on a promise. the effect of this is that their is now a slight increasse in TBT whereas there was none before. but he overall gain in performance outweights the increase
With
 all the changes applied the total ligh house performance score went up by 20-->
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true });
</script>
