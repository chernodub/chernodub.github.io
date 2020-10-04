/** Hex parsing tools. */
export namespace Color {
  /**
   * Adjust HEX color with alpha channel.
   * @param color Full form of hex color. (e.g. `#ffffff`)
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
    const scaledHexAlpha = hexAlpha.length < 2 ? '0' + hexAlpha : hexAlpha;

    return `${parseHex(color)}${scaledHexAlpha}`;
  }

  /**
   * Parse hex to a default form `#000000`.
   * @param color Hex color value matching regular expression (`#000` | `#000000` | `#000000`).
   */
  function parseHex(color: string): string {
    // Prepare color to parsing
    const _color = color.trim();

    if (hexRule.short.test(_color)) {
      return `${_color}${_color.replace('#', '')}`;
    } else if (hexRule.withAlpha.test(_color)) {
      // Simply cut off the alpha
      return `${_color.slice(0, 7)}`;
    } else if (hexRule.default.test(_color)) {
      return _color;
    }
    throw new Error(`${_color} does not match any of the hex rules`);
  }

  // regex rules for different hex forms
  const hexRule = {
    short: /^#[a-fA-F1-9]{3}$/,
    default: /^#[a-fA-F1-9]{6}$/,
    withAlpha: /^#[a-fA-F1-9]{8}$/,
  } as const;
}
