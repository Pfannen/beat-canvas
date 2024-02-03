import { ComponentProps } from "@/types/polymorphic";
import { FunctionComponent } from "react";

type DropContainerProps = {
  onDrop: (dataValue: string) => void;
  dataName: string;
};

const DropContainer: FunctionComponent<
  ComponentProps<"div", DropContainerProps>
> = ({ onDrop, dataName, ...restProps }) => {
  const handleDrop = (e: React.DragEvent) => {
    onDrop(e.dataTransfer!.getData(dataName));
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    restProps.onDragOver && restProps.onDragOver(e as any);
  };
  return (
    <div {...restProps} onDrop={handleDrop} onDragOver={handleDragOver}>
      {restProps.children && restProps.children}
    </div>
  );
};

export default DropContainer;
