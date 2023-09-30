# Webpack 5 import issue

If you're using Webpack 5, you may run into issues with importing Web Workers using the worker-loader plugin. In Webpack 5, you can use Web Workers without the worker-loader plugin using the following syntax:

```javascript
new Worker(new URL('./worker.js', import.meta.url));
```
or, if you want to customize the chunk name:

```javascript
Copy code
new Worker(
  /* webpackChunkName: "foo-worker" */ new URL('./worker.js', import.meta.url)
);
```
Note that while the Worker API suggests that the Worker constructor would accept a string representing the URL of the script, in Webpack 5 you can only use URL instead.

If you're experiencing issues with importing Web Workers in Webpack 5, try using the above syntax instead of the worker-loader plugin.