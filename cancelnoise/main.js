title = "CANCEL NOISE";

description = `
playing as a pair of
noise-cancelling
headphones, maneuver
between musical notes
without getting hit

[CLICK + HOLD]
  Speed up

`;

characters = [
`
 LLL
L   L
LR RL
RR RR
RR RR
`,`
  ll
  l ll
  l  
 ll
lll
ll
`,
];

const G = {
	WIDTH: 150,
	HEIGHT: 200,

  ENEMY_MIN_BASE_SPEED: 1.0,
  ENEMY_MAX_BASE_SPEED: 2.0
};

options = {
	    viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isCapturing: true,
  // isCapturingGameCanvasOnly: true,
  // captureCanvasScale: 2,
  seed: 1,
  isPlayingBgm: true,
  isReplayEnabled: true,
  theme: "simple"
};

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Star
 */

/**
 * @type { Star [] }
 */
let stars;

/**
 * @typedef {{
 * pos: Vector,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @type { number }
 */
let currentEnemySpeed;

/**
 * @type { number }
 */
let waveCount;

let isPressing;

let enemynumber;


function update() {

	if (!ticks) {
		stars = times(20, () => {
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);
            return {
                pos: vec(posX, posY),
                speed: 0.2
            };
        });

        player = {
            pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
        };

        isPressing = false; 
        enemies = [];
        waveCount = 0;
        enemynumber = 25;
	}


  
    // Spawning enemies
    if (enemies.length === 0) {
        // var random = Math.floor(Math.random() * 2)
        // console.log(random)
        var random = 1
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        for (let i = 0; i < enemynumber; i++) {
            if (random == 0) {
              const posX = rnd(0, G.WIDTH);
              const posY = -rnd(i * G.HEIGHT * 0.1);
              enemies.push({ pos: vec(posX, posY) })
            }

            if (random == 1) {
              const posX = rnd(0, G.WIDTH);
              const posY = -rnd(i * G.HEIGHT * 0.1);
              enemies.push({ pos: vec(posX, posY) })
            }
        }
      waveCount++;
      enemynumber++;
    }

    // Update for Star
    stars.forEach((s) => {
        s.pos.x -= s.speed;
        if (s.pos.x < 0) s.pos.x = G.WIDTH;
        color("yellow")
        box(s.pos, 1);
    });

    // Updating and drawing the player
    player.pos.clamp(0, G.WIDTH, G.HEIGHT - G.HEIGHT/4, 0);
    player.pos.x -= 1.5

    if (input.isPressed)
    {
      if(input.isJustPressed)
      {
        play("powerUp");
      }
      player.pos.x += 3
      color("cyan");
      particle(
          player.pos.x - 3, // x
          player.pos.y + 1, // y
          2, // number of particles
          0.1, // speed of the particles
          -PI, // emitting angle
          PI/4  // emitting width
      );
    }

    // player
    color ("black");
    char("a", player.pos);


    remove(enemies, (e) => {
        e.pos.y += currentEnemySpeed;
        color("black");
        char("b", e.pos);

        const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;

        if (isCollidingWithPlayer) {
          end();
          play("explosion"); 
        }
        
        return (e.pos.y > G.HEIGHT);
    });


    if (player.pos.x == G.WIDTH)
    {
      play("explosion");
      end();
    }

    if (player.pos.x == 0)
    {
      play("explosion");
      end();
    }
  


    addScore(10 * waveCount);
}
