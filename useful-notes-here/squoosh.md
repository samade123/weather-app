# Squoosh commands

## Use case

I had a bg.jpg image that i wanted to convert to webp and into smaller sizes for perfomant load in responsive sites. typically i use squoosh web app to do this but i wanted to use the squoosh command to convert it really quickly

## Install

`npm i -g @squoosh/cli`

## Useful command

`
squoosh-cli bg.jpg --resize '{ "width": 480 }' --webp '{ "quality": 75 }' -s -480 && \
squoosh-cli bg.jpg --resize '{ "width": 960 }' --webp '{ "quality": 75 }' -s -960 && \
squoosh-cli bg.jpg --resize '{ "width": 1920 }' --webp '{ "quality": 75 }' -s -1920
`
