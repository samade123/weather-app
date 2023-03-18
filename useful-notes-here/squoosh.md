# Squoosh commands

## Use case

I had a bg.jpg image that i wanted to convert to webp and into smaller sizes for perfomant load in responsive sites. typically i use squoosh web app to do this but i wanted to use the squoosh command to convert it really quickly

## Install

`npm i -g @squoosh/cli`

## Useful command

`squoosh-cli bg.jpg \ --resize width=480 \ --quantum 75 \ --output bg-480.webp && \ squoosh-cli bg.jpg \ --resize width=960 \ --quantum 75 \ --output bg-960.webp && \ squoosh-cli bg.jpg \ --resize width=1920 \ --quantum 75 \ --output bg-1920.webp `
