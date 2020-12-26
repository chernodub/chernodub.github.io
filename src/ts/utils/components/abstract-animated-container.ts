import { animationFrameScheduler, interval, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

/** After this number of frames the canvas is supposed to be checked for resize need. */
const CANVAS_RESIZE_FRAME_INTERVAL = 360;

/**
 *
 */
export abstract class AbstractAnimatedContainer extends HTMLElement {

  protected readonly animatedBackgroundStyles: HTMLStyleElement;

  protected readonly animatedBackgroundCanvas: HTMLCanvasElement;

  private subscription?: Subscription;

  /**
   * Init.
   */
  public constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.animatedBackgroundCanvas = this.initCanvas();
    this.animatedBackgroundStyles = this.initStyles();
  }


  /** Custom elements hook. */
  public connectedCallback(): void {

    this.shadowRoot?.append(
      this.animatedBackgroundStyles,
      this.animatedBackgroundCanvas,
    );

    this.subscription = interval(CANVAS_RESIZE_FRAME_INTERVAL, animationFrameScheduler).pipe(
      map(() => this.clientWidth + this.clientHeight),
      distinctUntilChanged(),
    )
      .subscribe(() => {
        this.animatedBackgroundCanvas.width = this.clientWidth;
        this.animatedBackgroundCanvas.height = this.clientHeight;
      });
  }

  /**
   *
   */
  public disconnectedCallback(): void {
    this.subscription?.unsubscribe();
  }

  /**
   *
   */
  private initCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    return canvas;
  }

  /**
   *
   */
  private initStyles(): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = ':host { overflow: hidden }';
    return style;
  }
}

