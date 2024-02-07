"use client";
import MusicProvider from "@/components/providers/music";
import { FunctionComponent, ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

const Providers: FunctionComponent<ProvidersProps> = ({ children }) => {
  return <MusicProvider>{children}</MusicProvider>;
};

export default Providers;
