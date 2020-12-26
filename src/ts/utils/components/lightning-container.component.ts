
import { Tree } from '../../lib/figures/tree';

import { Rendering2D } from '../../lib/rendering';

import { AbstractAnimatedContainer } from './abstract-animated-container';

/**
 *
 */
export class LightningContainer extends AbstractAnimatedContainer {

  private readonly renderingContext: Rendering2D.Context;

  /**
   *
   */
  public constructor(

  ) {
    super();
    this.renderingContext = new Rendering2D.Context(this.animatedBackgroundCanvas);
  }

  /** Init thunder animations. */
  public connectedCallback(): void {
    super.connectedCallback();
  }

  /**
   * Render a lightning on specified coordinates.
   * @param param0 Coordinates.
   * @param color Lightning color.
   */
  public makeLightning({ x, y }: Rendering2D.Coordinates, color: string): void {
    this.renderingContext.renderFigure(
      new Tree(x, y, { alpha: 1, color }),
      figure => figure instanceof Tree ? Tree.fade(figure) : null,
    );
  }

  /**
   * Render a lightning on random position.
   * @param color Hex color.
   */
  public makeRandomLightning(color: string): void {
    const { height, width } = this.animatedBackgroundCanvas;
    const x = Math.random() * width;
    const y = Math.random() * height;
    this.renderingContext.renderFigure(
      new Tree(x, y, { alpha: 1, color }),
      figure => figure instanceof Tree ? Tree.fade(figure) : null,
    );
  }
}
