/** Hex parsing tools. */
export namespace Color {

  /**
   * Adjust HEX color with alpha channel.
   * @param color Full form of hex color. (e.g. `#ffffff`).
   * @param alpha Alpha channel.
   *
   * @example
   * ```typescript
   * adjustWithAlpha('#000000', 0) // #00000000
   * adjustWithAlpha('#000000', 1) // #000000ff
   * ```
   */
  export function adjustHexWithAlpha(color: string, alpha: number): string {
    const hexAlpha = Math.floor(alpha * 255).toString(16);

    // So that the alpha number would have proper scale of 2 numbers (e.g: `0f` instead of `f`)
    const scaledHexAlpha = hexAlpha.length < 2 ? `0${hexAlpha}` : hexAlpha;

    return `${parseHex(color)}${scaledHexAlpha}`;
  }

  /**
   * Parse hex to a default form `#000000`.
   * @param color Hex color value matching regular expression (`#000` | `#000000` | `#000000`).
   */
  function parseHex(color: string): string {

    // Prepare color to parsing
    const col = color.trim();

    if (hexRule.short.test(col)) {
      return `${col}${col.replace('#', '')}`;
    } else if (hexRule.withAlpha.test(col)) {

      // Simply cut off the alpha
      return `${col.slice(0, 7)}`;
    } else if (hexRule.default.test(col)) {
      return col;
    }
    throw new Error(`${col} does not match any of the hex rules`);
  }

  // regex rules for different hex forms
  const hexRule = {
    short: /^#[a-fA-F0-9]{3}$/u,
    default: /^#[a-fA-F0-9]{6}$/u,
    withAlpha: /^#[a-fA-F0-9]{8}$/u,
  } as const;
}
