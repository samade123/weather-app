const { exec } = require("child_process");

const commands = [
  // "uglifyjs node_modules/vuesax3/dist/vuesax.common.js -o node_modules/vuesax3/dist/vuesax.common.js",
  // "uglifyjs node_modules/lottie-web/build/player/lottie.js -o node_modules/lottie-web/build/player/lottie.js",
  "npm version patch",
];

commands.forEach((command) => {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error running command: ${command}\n${err}`);
      return;
    }
    console.log(`Output for command: ${command}\n${stdout}`);
  });
});
