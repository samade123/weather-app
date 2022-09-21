# Weather App

This is a weather app based off the https://www.weatherapi.com/ api. This PWA is made with vue cli and the site was developed and served using VERCEL @ https://vercel.com/

The structure of this code means that the easiest way to set this project up in your own machine is to create your own free vercel account and git clone this project. You will also need to create a free account at the weatherapi and serve it as the environment variable: WEATHER_API_KEY.

This project can be broken down into two

* The PWA - This will be served from the dist folder - created from the build command
* The serveless function - This can be found in the api directory, IF using vercel all serveless functions will only be found in the api directory. 


If you use the vercel commands here you should run into no issues running this project from your machine. However you can also use the typical npm commands but you will need to create a separate env document with the system variable inside
## Project setup
```
npm install

npm i -g vercel
```

### Compiles and hot-reloads for development
```
npm run serve 

or

vercel dev
```

### Compiles and minifies for production
```
npm run build

or 

vercel build
```
