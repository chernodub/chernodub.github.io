/** Namespace with functions generating random distributions. */
export namespace Random {

  /**
   * Generate Normally distributed number.
   * @param m Mean.
   * @param sigma Standard deviation.
   *
   * @see Https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform.
   */
  export function normal(m = 0, sigma = 1): number {

    // Basic form of Box-Muller transform
    return (
      m +
      Math.cos(2 * Math.PI * Math.random()) *
        Math.sqrt(-2 * Math.log(Math.random())) *
        sigma
    );
  }
}
