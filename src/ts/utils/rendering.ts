import { Hex } from "./hex";

/** TODO */
export interface RenderOptions {
  /** Alpha channel value. */
  readonly alpha: number;
  // TODO: Set up a validation somehow
  /** Hex color. */
  readonly color: string;
}

/** TODO */
export abstract class Figure {
  /**
   * @constructor
   * @param x X.
   * @param y Y.
   */
  public constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly options: RenderOptions,
  ) {}

  /** TODO */
  public abstract get path(): Path2D;
}



type FigureAnimationFn = (figure: Figure) => Figure | null;

class RenderElement {
  /** TODO */
  public constructor(
    public readonly figure: Figure,
    public readonly animation?: FigureAnimationFn,
  ) {}

  public get next(): RenderElement | null {
    const nextFigure = this.animation && this.animation(this.figure);
    return nextFigure ? new RenderElement(nextFigure, this.animation) : null;
  }
}

/** TODO */
export class RenderingContext2D {
  /** TODO */
  public readonly canvas: HTMLCanvasElement;
  /** TODO */
  public readonly ctx: CanvasRenderingContext2D;

  /** Array of rendered objects. */
  private elements: RenderElement[] = [];
  private queue: RenderElement[] = [];

  public constructor(document: Document) {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    this.initCanvas();
    document.onresize = () => this.initCanvas();
    this.render();
  }

  public get width(): number {
    return this.canvas.width;
  }

  public get height(): number {
    return this.canvas.height;
  }

  private initCanvas(): void {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  public renderFigure(
    figure: Figure,
    renderFrame?: FigureAnimationFn,
  ): void {
    this.elements.push(new RenderElement(figure, renderFrame));
  }

  private render(): void {
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      const nextFrameElements: RenderElement[] = this.elements
        .reduce((acc, el) => el.next ? acc.concat(el.next) : acc, [] as RenderElement[])
        .concat(this.queue);

      // Clean up the queue
      this.queue = [];
      this.elements = nextFrameElements;

      this.elements.forEach(({figure}) => {
        this.ctx.fillStyle = Hex.adjustWithAlpha(figure.options.color, figure.options.alpha);
        this.ctx.fill(figure.path);
      });
      this.render();
    });
  }
}
