export namespace Hex {
  const HEX_ALPHA_SCALE = 2;
  export function adjustWithAlpha(color: string, alpha: number): string {
    const hexAlpha = Math.floor(alpha * 255).toString(16);

    return `${color}${hexAlpha.length < HEX_ALPHA_SCALE ? '0' + hexAlpha : hexAlpha}`;
  }
}