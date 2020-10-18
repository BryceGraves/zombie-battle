/*
  Zombulator homework help/experiementing
  Zombulator boiler plate code provided by Elsie Charles of the class CS160 in fall 2017
*/

/*
  TODO: Path humans away from Zombies
  TODO: Path humans together
  TODO: Path zombies towards humans
*/

const MIN_SIZE = 10;
const MAX_SIZE = 50;
const POPULATION_SIZE = 500;

const population = {
  human: [],
  zombie: [],
};

let backgroundColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  backgroundColor = color(245, 255, 245);
  initializePopulation();
}

function draw() {
  background(backgroundColor);
  noStroke();
  handlePopulation();
  drawPopulationCounts();
  handleCollisions();
}

const drawPopulationCounts = () => {
  stroke(0);
  textSize(72);
  textAlign(CENTER);
  text('Zombies: ' + population.zombie.length, width / 2, 100);
  text('Humans: ' + population.human.length, width / 2, height - 100);
};

const initializePopulation = () => {
  for (let i = 0; i < POPULATION_SIZE; ++i) {
    const current = random(0, 100) < 50 ? initializeHuman() : initializeZombie();

    population[current.humanoidType].push(current);
  }
};

const handleCollisions = () => {
  population.human.forEach((human) => {
    population.zombie.forEach((zombie) => {
      if (isTouching(human, zombie)) {
        fight(human, zombie);
      }
    });
  });
};

const handleMovement = (current) => {
  if (!current || population.human.length === 0) {
    return;
  }

  if (current.x !== population.human[0].x) {
    if (Math.abs(current.x - population.human[0].x) < current.speed) {
      current.x = population.human[0].x;
    } else {
      current.x += current.x < population.human[0].x ? current.speed : -current.speed;
    }
  }

  if (current.y !== population.human[0].y) {
    if (Math.abs(current.y - population.human[0].y) < current.speed) {
      current.y = population.human[0].y;
    } else {
      current.y += current.y < population.human[0].y ? current.speed : -current.speed;
    }
  }
};

const handlePopulation = () => {
  [...population.human, ...population.zombie].forEach((v, i) => {
    fill(v.color);
    ellipse(v.x, v.y, v.size, v.size);

    if (i !== 0) {
      handleMovement(v);
    }
  });
};

const initializeZombie = () => {
  return {
    id: uuid(),
    humanoidType: 'zombie',
    x: random(0, windowWidth),
    y: random(0, 200),
    speed: random(2, 3),
    size: random(MIN_SIZE, MAX_SIZE),
    color: color(random(150, 250), random(50, 150), random(50, 150)),
  };
};

const initializeHuman = () => {
  return {
    id: uuid(),
    humanoidType: 'human',
    x: random(0, windowWidth),
    y: random(windowHeight - 200, windowHeight),
    speed: random(1, 2),
    size: random(MIN_SIZE, MAX_SIZE),
    color: color(random(50, 150), random(50, 150), random(150, 250)),
  };
};

const isTouching = (self, target) =>
  self.humanoidType !== target.humanoidType
    ? dist(self.x, self.y, target.x, target.y) <= self.size / 2 + target.size / 2
    : false;

const fight = (human, zombie) => {
  if (human.size < zombie.size) {
    const newZombie = human;
    newZombie.humanoidType = 'zombie';
    newZombie.color = color(random(190, 255), random(50, 150), random(50, 150));

    population.human = population.human.filter((h) => h.id !== newZombie.id);
    population.zombie.push(newZombie);
  } else if (human.size > zombie.size) {
    population.zombie = population.zombie.filter((z) => z.id !== zombie.id);
  } else {
    population.human = population.human.filter((h) => h.id !== human.id);
    population.zombie = population.zombie.filter((z) => z.id !== zombie.id);
  }
};

const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
