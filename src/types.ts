
export type Position = [number, number];

export type Game = {
  loadMap: (map: string, playerPosition?: Position) => void;
  openDialog: (text: string) => Promise<void>;
}
