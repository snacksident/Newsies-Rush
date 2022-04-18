## Newsies Rush

This project is a re-imagination the classic Paperboy video game.  In this game you assume the role of a newspaper delivery person making your way through a neighborhood, delivering newspapers!  The base gameplay should be pretty representative of the original games in the series.

Completed stretch goals include powerup functionality (additional newspapers the player can collect to extend their run)

___
## Technical Overview

All objects on screen are objects constructed at game-start - each with differing x/y locations on the play-area.

I placed all "house" objects into a single array which has a constantly increasing "Y Location" variable to simulate movement through the neighborhood.  Houses "subscriber" status is randomized when the houses are initialized.  The deliveryperson is controlled by keydown/keyup inputs - classic WASD movement.  Gameplay happens on a pretty quick loop of 60ms to help the game feel smooth.  Powerups (bonus newspapers) generate on the level every 5 seconds, but disappear as soon as the next powerup is placed.

Instead of importing images for my visuals, I decided the "retro" look was better than any other alternatives I attempted.  The player is represented by a narrow rectangle (a bicycle and its rider), houses are be large rectangles on the sides of the screen(different color borders to represent), and newspapers are small white squares.

When the start button is pressed: 

* House objects are created and placed into their correct arrays (left/right side of screen)

* Intervals started for gameloop and powerup placement

Gameloop consists of:

* Clearing all rendered objects

* Updating all score/status screens

* Moving houses down the Y axis / re-rendering all houses

* Checking for powerup pickup

* Checking for game-over (out of papers)

* Collision detection (player picking up powerups, newspapers being 'delivered')


___
## About The Game

This game is viewed top-down as you ride through a neighborhood, delivering newspapers to the houses that are "subscribers", and not delivering to those who didn't want the paper!  If you give newspapers to people who did not request them, that's a lost profit!  If you throw a newspaper perfectly onto a subscribers doorstep or mailbox, you get a tip from them, increasing your score!  But don't just go as fast as you can - some houses have junk in their yards, some may even have dogs that chase you!

![Rough sketch of game](roughdraftp1img.png)

[Link to current version of game](https://snacksident.github.io/Newsies-Rush/)
___
## Tech Being Used:

* HTML/CSS - Gameplay happens in a Canvas element

* Javascript

* Flex and grid for layout/styling

___

## Features:

- [x] Render a neighborhood

- [x] Randomly select which houses are subscribers and not

- [x] Score points for delivering to correct houses

- [x] Bicycle automatically rides through neighborhood, ability to toss papers left or right

- [x] Restart / Play Again button

- [x] Game ends when newspaper runs out or user score threshold is met

- [x] Display score - updating as user scores points

___
## Future Plans:

- [ ] Some houses have pets to chase you

- [x] User has control of x/y location of bike

- [ ] Score extra money for delivering the paper *accurately*

- [x] Lose money for delivering to houses that have not subscribed to the newspaper

- [ ]Create obstacles in the neighborhood that you can crash into - slowing you down.

- [ ] Multiple difficulties

- [x] Powerups

    - [x] extra newspapers

    - [ ] speed boost

- [ ] Graphics overhaul


## Resources:

* NES.css (and their recommended font from google fonts)
