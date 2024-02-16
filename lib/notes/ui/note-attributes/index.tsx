import { BodyComponent, StaffComponent } from "../../types";
import NoteDot from "./note-dot";

const attributes: { [attribute: string]: StaffComponent | BodyComponent } = {
  sticatto: {
    container: "body",
    position: "top",
    component: ({ xAxis, yAxis }) => <NoteDot xAxis={xAxis} yAxis={yAxis} />,
  },
};
