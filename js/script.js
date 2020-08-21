import aStar from './a-star.js'

const canvas = document.querySelector('canvas')
canvas.height = 600
canvas.width = 600
const context = canvas.getContext('2d')


const side = 50
const matrix = new Array(side)
	.fill(null)
	.map((_, y) => new Array(side)
		.fill(null)
		.map((_, x) => ({x, y}))
	)

//
const { start, end } = getStartEnd(matrix)
start.isStart = true
end.isEnd = true

//
for(let i = 0; i < 7; i++){
	const obstacle = addObstacle(matrix, [start, end])
	for(let x = Math.min(obstacle.start.x, obstacle.end.x); x < Math.max(obstacle.start.x, obstacle.end.x); x++) {
		for(let y = Math.min(obstacle.start.y, obstacle.end.y); y < Math.max(obstacle.start.y, obstacle.end.y); y++) {
			matrix[y][x].isObstacle = true
		}
	}
}


const path = aStar(matrix, start, end)
if(path) {
	void async function() {
		for (const cell of path) {
			cell.isPath = true
			drawMatrix(context, matrix)
			await new Promise(resolve => setTimeout(resolve, 8))
		}
	}()
}

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {object[][]} matrix 
 */
function drawMatrix(context, matrix) {
	const side = context.canvas.height / matrix.length
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			const cell = matrix[y][x]
			context.fillStyle = cell.isObstacle
				? 'black'
				: cell.isPath 
				? 'red' 
				: 'lightgrey'
			context.beginPath()
			context.rect(
				x * side + 2,
				y * side + 2,
				side - 4,
				side - 4
			)
			context.fill()
			if (cell.isStart || cell.isEnd) {
				context.strokeStyle = cell.isStart ? 'green' : 'purple'
				context.stroke()
			}
			context.closePath()
		}
	}
}

/**
 * 
 * @param {number} max 
 */
function randomInt(max) {
	return Math.floor(Math.random() * max)
}

/**
 * 
 * @param {object[][]} matrix 
 */
function getStartEnd(matrix) {
	const side = matrix.length
	const start = {}
	const end = {}
	do {
		start.x = randomInt(side)
		start.y = randomInt(side)
		end.x = randomInt(side)
		end.y = randomInt(side)
	} while (distance(start, end) < 40)

	return {
		start: matrix[start.y][start.x],
		end: matrix[end.y][end.x],
	}
}

function addObstacle(matrix, exclusions) {
	const side = matrix.length
	const start = {}
	const end = {}
	do {
		start.x = randomInt(side)
		start.y = randomInt(side)
		end.x = randomInt(side)
		end.y = randomInt(side)
	} while (
		area(start, end) < 10
		|| area(start, end) > 100
		|| exclusions.find(cell => 
			cell.x > Math.min(start.x, end.x)
			&& cell.x < Math.max(start.x, end.x)
			&& cell.y > Math.min(start.y, end.y)
			&& cell.y < Math.max(start.y, end.x)
		)
	)

	return { start, end }
}

function area(a, b) {
	return Math.abs(a.x - b.x) * Math.abs(a.y - b.y)
}

function distance(a, b) {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}