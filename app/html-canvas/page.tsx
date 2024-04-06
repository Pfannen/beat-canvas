"use client";

import { getHTMLCanvas } from "@/utils/music-rendering";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type HTMLCanvasProps = {};

const HTMLCanvas: FunctionComponent<HTMLCanvasProps> = () => {
  const canvas = getHTMLCanvas();
  return <>{canvas}</>;
};

export default HTMLCanvas;
