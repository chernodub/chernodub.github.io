/** TODO */
export interface RenderOptions {
  // TODO change to `color` and `opacity`
  readonly opacity: number;
  readonly r: number;
  readonly g: number;
  readonly b: number;
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

/** TODO */
export interface RenderElement {
  /** TODO */
  readonly figure: Figure;
  /** TODO */
  readonly getNextFrame: (figure: Figure) => Figure | null;
}

/** TODO */
export class RenderingContext2D {
  /** TODO */
  public readonly canvas: HTMLCanvasElement;
  /** TODO */
  public readonly ctx: CanvasRenderingContext2D;

  private readonly elements: RenderElement[] = [];

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
    renderFrame: (figure: Figure) => Figure | null = (figure) => figure,
  ): void {
    this.elements.push({
      figure,
      getNextFrame: renderFrame,
    });
  }

  private render(): void {
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.elements.forEach((el, i) => {
        const newFigure = el.getNextFrame(el.figure);
        if (newFigure) {
          this.elements.splice(i, 1, {
            figure: newFigure,
            getNextFrame: el.getNextFrame,
          });
          const { r, g, b } = el.figure.options;
          this.ctx.fillStyle = `rgb(${r}, ${g}, ${b}${
            ', ' + newFigure.options?.opacity
          })`;
          this.ctx.fill(el.figure.path);
        } else {
          this.elements.splice(i, 1);
        }
      });
      this.render();
    });
  }
}
