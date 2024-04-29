import { IDrawingCanvas } from "../../drawing-canvas";

export type DrawerArgs = { drawCanvas: IDrawingCanvas };

export type Drawer<T> = (args: DrawerArgs & T) => any;
