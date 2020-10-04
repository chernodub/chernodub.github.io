import { Color } from '../utils/color';

/** Context for rendering 2D objects on canvas. */
export namespace Rendering2D {
  /** Rendering options.abs */
  export interface Options {
    /** Alpha channel value. */
    readonly alpha: number;
    /** Hex color. */
    readonly color: string;
  }

  /** Abstract figure to pass into the rendering context. */
  export abstract class Figure {
    /**
     * @constructor
     * @param x X.
     * @param y Y.
     */
    public constructor(
      public readonly x: number,
      public readonly y: number,
      public readonly options: Options,
    ) {}

    /** Canvas path of the figure. */
    public abstract get path(): Path2D;
  }

  /** Rendering function. Accepts a figure and builds the a new frame or destroys it. */
  type FigureAnimationFn = (figure: Figure) => Figure | null;

  /** Rendering element. Contains metadata about rendered figure. */
  class Element {
    /**
     * @constructor
     * @param figure
     * @param animation
     */
    public constructor(
      public readonly figure: Figure,
      public readonly animation?: FigureAnimationFn,
    ) {}

    /** Shortcut for next frame of the figure. */
    public get next(): Element | null {
      const nextFigure = this.animation && this.animation(this.figure);
      return nextFigure ? new Element(nextFigure, this.animation) : null;
    }
  }

  /** Rendering context wrapper over low-level Canvas API. */
  export class Context {
    /** Canvas element. */
    private canvas!: HTMLCanvasElement;
    /** Canvas context. */
    private ctx!: CanvasRenderingContext2D;

    /** Array of rendered objects. */
    private elements: Element[] = [];
    /** Queue of elements to render. Cleaned after each rendering tick. */
    private queue: Element[] = [];

    /**
     * Attach rendering context to an element.
     * @param element Element to attach the context to.
     */
    public attachTo(element: HTMLElement): void {
      // If the element is already a canvas, save it
      if (element instanceof HTMLCanvasElement) {
        this.canvas = element;
      } else {
        // Otherwise try querying the first child canvas
        const canvas = element.querySelector('canvas');
        if (canvas == null) throw new Error('Element does not contain canvas');
        this.canvas = canvas;
      }

      this.ctx = this.canvas.getContext('2d')!;
      this.initCanvas();
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

    public renderFigure(figure: Figure, renderFrame?: FigureAnimationFn): void {
      this.elements.push(new Element(figure, renderFrame));
    }

    private render(): void {
      window.requestAnimationFrame(() => {
        this.ctx.clearRect(0, 0, this.width, this.height);
        const nextFrameElements: Element[] = this.elements
          .reduce(
            (acc, el) => (el.next ? acc.concat(el.next) : acc),
            [] as Element[],
          )
          .concat(this.queue);

        // Clean up the queue
        this.queue = [];
        this.elements = nextFrameElements;

        this.elements.forEach(({ figure }) => {
          this.ctx.fillStyle = Color.adjustHexWithAlpha(
            figure.options.color,
            figure.options.alpha,
          );
          this.ctx.fill(figure.path);
        });
        this.render();
      });
    }
  }
}
