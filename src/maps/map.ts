export interface Map {
  sprite: string | Array<string>;
  startPosition: [number, number];
}

export const getMap = (map: Map) => {
  if (Array.isArray(map.sprite)) {
    return map.sprite.join('\r\n');
  }
  return map.sprite;
};
