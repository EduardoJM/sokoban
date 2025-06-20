import { createGame } from 'odyc'
import { colors } from './config/colors'
import { playerSprite } from './sprites/player'
import { fixedCrateSprite } from './sprites/fixed-crate'
import { crateSprite } from './sprites/crate'
import { wallSprite } from './sprites/wall'

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
    position: [1, 1],
  },
	templates: {
    x: {
      sprite: 2,
    },
    t: {
      sprite: 5,
      solid: false,
    },
    f: { sprite: fixedCrateSprite },
    w: { sprite: wallSprite },
    c: {
      sprite: crateSprite,
      onCollide(target) {
        const [px, py] = game.player.position
				const [tx, ty] = target.position

        const isDefaultTarget = !!defaultTargets.find(({x ,y}) => x === tx && y===ty);

				const [dx, dy] = [tx - px, ty - py]
				const nextCell = game.getCell(tx + dx, ty + dy)
				if (!nextCell.solid) {
          if (nextCell.symbol === 't') {
            defaultTargets.push({ x: tx + dx, y: ty + dy });
            game.playSound('POWERUP', 543534);
          }

					game.addToCell(tx + dx, ty + dy, target.symbol)
					game.player.position = [tx, ty]
					target.remove()
				}

        if (isDefaultTarget) {
					game.addToCell(tx, ty, 't');
        }
      },
    },
  },
  map: `
	xxxxxxxx
	w....f.x
	w..c...x
	w......x
	w..t...x
	w......x
	www....x
	xxxxxxxx
	`
})
