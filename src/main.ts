import { createGame } from 'odyc'
import { colors } from './config/colors'
import { playerSprite } from './sprites/player'
import { fixedCrateSprite } from './sprites/fixed-crate'
import { crateSprite } from './sprites/crate'
import { wallSprite } from './sprites/wall'
import { targetSprite } from './sprites/target'
import { levels } from './maps/levels';

const defaultTargets: Array<{ x: number, y: number }> = [];

const game = createGame({
  cellWidth: 32,
	cellHeight: 32,
  screenWidth: 10,
	screenHeight: 10,
  background: '#e0d8ad',
  colors,
  player: {
    sprite: playerSprite,
    position: levels[1].startPosition,
  },
	templates: {
    x: {
      sprite: 2,
    },
    t: {
      sprite: targetSprite,
      solid: false,
    },
    f: { sprite: fixedCrateSprite },
    w: { sprite: wallSprite },
    c: {
      sprite: crateSprite,
      onCollide: async function (target) {
        const [px, py] = game.player.position
				const [tx, ty] = target.position

        const isDefaultTarget = !!defaultTargets.find(({x ,y}) => x === tx && y===ty);

				const [dx, dy] = [tx - px, ty - py]
				const nextCell = game.getCell(tx + dx, ty + dy)
				if (!nextCell.solid) {
          const isCorrectOnTarget = nextCell.symbol === 't';
          if (isCorrectOnTarget) {
            defaultTargets.push({ x: tx + dx, y: ty + dy });
            game.playSound('POWERUP', 543534);
          }

					game.addToCell(tx + dx, ty + dy, target.symbol)
					game.player.position = [tx, ty]
					target.remove()

          if (isCorrectOnTarget) {
            let hasTarget = false;
            for (let y = 0; y < game.height; y++) {
              for (let x = 0; x < game.width; x++) {
                const cell = game.getCell(x, y);
                if (cell.symbol === 't') {
                  hasTarget = true;
                }
              }
            }
            if (!hasTarget) {
              await game.openDialog('Nice job! Go to next level.');
            }
          }
				}

        if (isDefaultTarget) {
					game.addToCell(tx, ty, 't');
        }
      },
    },
  },
  map: levels[1].sprite
})
