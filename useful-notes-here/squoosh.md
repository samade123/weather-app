# Squoosh commands

## Use case

I had a bg.jpg image that i wanted to convert to webp and into smaller sizes for perfomant load in responsive sites. typically i use squoosh web app to do this but i wanted to use the squoosh command to convert it really quickly

## Install

`npm i -g @squoosh/cli`

## Useful command

`
squoosh-cli bg.jpg --resize '{ "width": 700 }' --webp '{ "quality": 75 }' -s -700 && \
squoosh-cli bg.jpg --resize '{ "width": 1200 }' --webp '{ "quality": 75 }' -s -1200 && \
squoosh-cli bg.jpg --resize '{ "width": 2400 }' --webp '{ "quality": 75 }' -s -2400
squoosh-cli bg.jpg --resize '{ "width": 3000 }' --webp '{ "quality": 75 }' -s -3000
`
