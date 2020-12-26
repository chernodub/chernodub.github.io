import { assertIsDefined } from '../utils/assertions/assert-is-defined';
import { Color } from '../utils/color';

// TODO refactor

/** Context for rendering 2D objects on canvas. */
export namespace Rendering2D {

  /**
   *
   */
  export interface Coordinates {
    readonly x: number;
    readonly y: number;
  }

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
     * @param x X.
     * @param options
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
     * @param figure Figure.
     * @param animation Animation.
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


    public constructor(
      element?: HTMLElement,
    ) {
      if (element) {
        this.attachTo(element);
      }
    }

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
        if (canvas == null) {
          throw new Error('Element does not contain canvas');
        }
        this.canvas = canvas;
      }

      const ctx = this.canvas.getContext('2d');
      assertIsDefined(ctx);

      this.ctx = ctx;
      this.initCanvas();
      this.renderLoop();
    }

    /**
     *
     */
    public get width(): number {
      return this.canvas.width;
    }

    /**
     *
     */
    public get height(): number {
      return this.canvas.height;
    }

    private initCanvas(): void {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }

    /**
     * @param figure Figure shit.
     * @param renderFrame Render frame shit.
     */
    public renderFigure(figure: Figure, renderFrame?: FigureAnimationFn): void {
      this.elements.push(new Element(figure, renderFrame));
    }

    /**
     *
     */
    private renderLoop(): void {
      window.requestAnimationFrame(() => {
        // So not to attack user's browser, stop rendering until tab is visible
        this.ctx.clearRect(0, 0, this.width, this.height);
        const nextFrameElements: Element[] = this.elements
          .reduce(
            (acc, el) => el.next ? acc.concat(el.next) : acc,
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
          this.ctx.shadowColor = figure.options.color;
          this.ctx.shadowBlur = figure.options.alpha * 30;
          this.ctx.fill(figure.path);
        });
        this.renderLoop();
      });
    }
  }
}
