import { fromEvent, interval, merge, Observable } from 'rxjs';
import { filter, mapTo, tap } from 'rxjs/operators';

import { assertIsDefined } from './ts/utils/assertions/assert-is-defined';
import { LightningContainer } from './ts/utils/components/lightning-container.component';

customElements.define('lightning-container', LightningContainer);

const RANDOM_THUNDER_INTERVAL = 2000;

const lightningContainer = document.querySelector<LightningContainer>('lightning-container');

function initPeriodicalThunder(): Observable<void> {
  return interval(RANDOM_THUNDER_INTERVAL).pipe(
    filter(() => document.visibilityState === 'visible'),
    tap(() => lightningContainer?.makeRandomLightning(getComplementaryColor())),
    mapTo(void 0),
  );
}

function initThunderFromClicks(element: HTMLElement): Observable<void> {
  return fromEvent(element, 'click').pipe(
    filter((event): event is MouseEvent => event instanceof MouseEvent),
    tap(({ x, y }) => lightningContainer?.makeLightning({ x, y }, getComplementaryColor())),
    mapTo(void 0),
  );
}


function glitchHeading(): void {
  const heading = document.querySelector<HTMLElement>('.heading');
  assertIsDefined(heading);

  heading.classList.add('glitched');
  setTimeout(() => heading.classList.remove('glitched'), 100);
}

/**
 *
 */
function getComplementaryColor(): string {
  const context = document.body;
  return getComputedStyle(context).getPropertyValue('--complementary-color');
}

merge(
  initPeriodicalThunder(),
  initThunderFromClicks(document.body),
).subscribe(glitchHeading);

