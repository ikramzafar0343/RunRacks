declare module "dotted-map" {
  type DottedMapOptions = {
    height?: number;
    grid?: "vertical" | "diagonal";
  };

  type GetSvgOptions = {
    radius?: number;
    color?: string;
    shape?: "circle" | "hexagon";
    backgroundColor?: string;
  };

  export default class DottedMap {
    constructor(options?: DottedMapOptions);
    getSVG(options?: GetSvgOptions): string;
  }
}
