import { Random } from './utils/random';
import { Figure, RenderOptions, RenderingContext2D } from './utils/rendering';
import { Coords } from './utils/types/coords';
import { Vector } from './utils/types/vector';

class ThunderBranch {
  public readonly path: Path2D;
  public constructor(
    public readonly vector: Vector,
    public readonly children: ThunderBranch[],
  ) {
    this.path = new Path2D();
    const { start, finish } = this.vector;
    const y = finish.y - start.y,
      x = finish.x - start.x;
    const length = Math.sqrt(y * y + x * x);
    const dir = Math.atan2(y, x);
    const thicknessStart = length / 15;
    const thicknessEnd = this.children.length ? length / 20 : 0;

    this.path.moveTo(
      start.x + Math.cos(dir + Math.PI / 2) * thicknessStart,
      start.y + Math.sin(dir + Math.PI / 2) * thicknessStart,
    );
    this.path.arc(
      start.x,
      start.y,
      thicknessStart,
      dir + Math.PI / 2,
      dir - Math.PI / 2,
    );
    this.path.lineTo(
      finish.x + Math.cos(dir - Math.PI / 2) * thicknessEnd,
      finish.y + Math.sin(dir - Math.PI / 2) * thicknessEnd,
    );
    this.path.arc(
      finish.x,
      finish.y,
      thicknessEnd,
      dir - Math.PI / 2,
      dir + Math.PI / 2,
    );
    this.path.closePath();
    this.children.forEach((child) => this.path.addPath(child.path));
  }
}

// Class to export TODO
class Thunderball extends Figure {
  private readonly branches: ThunderBranch[];

  public constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly options: RenderOptions,
    public readonly inheritFrom?: Thunderball,
  ) {
    super(x, y, options);

    if (inheritFrom) {
      this.branches = inheritFrom.branches;
    } else {
      this.branches = Thunderball.generate({ x, y });
    }
  }

  private static generate(start: Coords): ThunderBranch[] {
    const pointsNum = Math.floor(Math.random() * 10) + 5;
    return [...Array(pointsNum).keys()].map(() =>
      Thunderball.generateBranch(start),
    );
  }

  private static generateBranch(
    start: Coords,
    direction: number = Math.PI * Math.random() * 2,
    p: number = 1,
    reduceCoeff = 0.95,
    length = 30,
    children: number = Math.floor(Math.random() * 3),
  ): ThunderBranch {
    const end: Coords = {
      x: Math.cos(direction) * length + start.x,
      y: Math.sin(direction) * length + start.y,
    };
    const subBranches =
      Math.random() < p
        ? [...Array(children).keys()].map(() =>
            Thunderball.generateBranch(
              end,
              direction + Random.normal(1, 0.1) * Math.PI * 2,
              p * reduceCoeff,
              reduceCoeff,
              length * reduceCoeff,
            ),
          )
        : [];
    return new ThunderBranch({
      start, finish: end,
    }, subBranches);
  }

  public get path(): Path2D {
    const path = new Path2D();
    this.branches.forEach((branch) => path.addPath(branch.path));
    return path;
  }

  public static fade(figure: Thunderball): Thunderball | null {
    const newAlpha = figure.options.alpha - 0.002;
    if (newAlpha <= 0) {
      return null;
    }
    return new Thunderball(
      figure.x,
      figure.y,
      {
        ...figure.options,
        alpha: newAlpha,
      },
      figure,
    );
  }
}

const ctx = new RenderingContext2D(document);

document.onclick = ({ x, y }) => renderThunder(x, y);

// Occasional thunder

setInterval(
  () =>
    renderThunder(
      ctx.canvas.width * Math.random(),
      ctx.canvas.height * Math.random(),
    ),
  2000,
);

function renderThunder(x: number, y: number): void {
  const heading = document.querySelector('.heading')!;
  heading.classList.add('glitched');
  setTimeout(() => heading.classList.remove('glitched'), 100);
  ctx.renderFigure(
    new Thunderball(x, y, { alpha: 1, color: '#7d1e67' }),
    (figure) =>
      figure instanceof Thunderball ? Thunderball.fade(figure) : null,
  );
}
