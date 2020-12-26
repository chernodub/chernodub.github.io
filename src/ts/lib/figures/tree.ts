import { Random } from '../../utils/random';
import { Rendering2D } from '../rendering';
import { Vector } from '../../utils/types/vector';

// TODO improve codestyle and docs
/** Part of the thunderball. */
class Branch {
  public readonly path: Path2D;

  public constructor(
    public readonly vector: Vector<Rendering2D.Coordinates>,
    public readonly children: Branch[],
  ) {
    this.path = this.initPath();
  }

  private initPath(): Path2D {
    const path = new Path2D();
    const { start, finish } = this.vector;
    const y = finish.y - start.y;
    const x = finish.x - start.x;
    const length = Math.sqrt(y * y + x * x);
    const dir = Math.atan2(y, x);
    const thicknessStart = length / 15;
    const thicknessEnd = this.children.length ? length / 20 : 0;

    path.moveTo(
      start.x + Math.cos(dir + Math.PI / 2) * thicknessStart,
      start.y + Math.sin(dir + Math.PI / 2) * thicknessStart,
    );
    path.arc(
      start.x,
      start.y,
      thicknessStart,
      dir + Math.PI / 2,
      dir - Math.PI / 2,
    );
    path.lineTo(
      finish.x + Math.cos(dir - Math.PI / 2) * thicknessEnd,
      finish.y + Math.sin(dir - Math.PI / 2) * thicknessEnd,
    );
    path.arc(
      finish.x,
      finish.y,
      thicknessEnd,
      dir - Math.PI / 2,
      dir + Math.PI / 2,
    );
    path.closePath();
    this.children.forEach(child => path.addPath(child.path));

    return path;
  }
}

/** Random tree shape. */
export class Tree extends Rendering2D.Figure {
  private readonly branches: Branch[];

  /**
   * @class
   * @param x
   * @param y
   * @param options
   * @param inheritFrom Branch to inherit the form from. If not presented, the tree would be generated randomly.
   */
  public constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly options: Rendering2D.Options,
    public readonly inheritFrom?: Tree,
  ) {
    super(x, y, options);

    if (inheritFrom) {
      this.branches = inheritFrom.branches;
    } else {
      this.branches = Tree.generate({ x, y });
    }
  }

  /**
   * @param start
   */
  private static generate(start: Rendering2D.Coordinates): Branch[] {
    const pointsNum = Math.floor(Math.random() * 10) + 5;
    return [...Array(pointsNum).keys()].map(() => Tree.generateBranch(start));
  }

  /**
   * @param start
   * @param direction
   * @param p
   * @param reduceCoeff
   * @param length
   * @param children
   */
  private static generateBranch(
    start: Rendering2D.Coordinates,
    direction: number = Math.PI * Math.random() * 2,
    p = 1,
    reduceCoeff = 0.95,
    length = 30,
    children: number = Math.floor(Math.random() * 3),
  ): Branch {
    const end: Rendering2D.Coordinates = {
      x: Math.cos(direction) * length + start.x,
      y: Math.sin(direction) * length + start.y,
    };
    const subBranches =
      Math.random() < p ?
        [...Array(children).keys()].map(() => Tree.generateBranch(
          end,
          direction + Random.normal(1, 0.1) * Math.PI * 2,
          p * reduceCoeff,
          reduceCoeff,
          length * reduceCoeff,
        )) :
        [];
    return new Branch(
      {
        start,
        finish: end,
      },
      subBranches,
    );
  }

  /**
   *
   */
  public get path(): Path2D {
    const path = new Path2D();
    this.branches.forEach(branch => path.addPath(branch.path));
    return path;
  }

  /**
   * @param figure
   */
  public static fade(figure: Tree): Tree | null {
    const newAlpha = figure.options.alpha - 0.002;
    if (newAlpha <= 0) {
      return null;
    }
    return new Tree(
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
