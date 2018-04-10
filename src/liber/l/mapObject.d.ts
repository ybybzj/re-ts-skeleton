export = MapObject

declare function MapObject(
  fn: (v: any, k: string, o: object) => any,
  o: object
): object
declare function MapObject(
  fn: (v: any, k: string, o: object) => any
): (o: object) => object
