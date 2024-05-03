import { IDrawingCanvas } from "../../drawing-canvas";

export type DrawerArgs = { drawCanvas: IDrawingCanvas };

export type Drawer<T, U = any> = (args: DrawerArgs & T) => U;
