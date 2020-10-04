import { Tree } from './lib/figures/tree';
import { Rendering2D } from './lib/rendering';

function initOccasionalThunder(ctx: Rendering2D.Context): void {
  setInterval(
    () => renderThunder(ctx.width * Math.random(), ctx.height * Math.random()),
    2000,
  );
}

function initThunderListener(element: HTMLElement): void {
  element.onclick = ({ x, y }) => renderThunder(x, y);
}

function renderThunder(x: number, y: number): void {
  const heading = document.querySelector('.heading')!;
  heading.classList.add('glitched');
  setTimeout(() => heading.classList.remove('glitched'), 100);

  const color = getComplementaryColor();
  ctx.renderFigure(new Tree(x, y, { alpha: 1, color }), (figure) =>
    figure instanceof Tree ? Tree.fade(figure) : null,
  );
}

function getComplementaryColor(): string {
  const context = document.body;
  return getComputedStyle(context).getPropertyValue('--complementary-color');
}

const ctx = new Rendering2D.Context();
ctx.attachTo(document.body);

initThunderListener(document.body);
initOccasionalThunder(ctx);
