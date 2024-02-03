import { ComponentProps } from "@/types/polymorphic";
import { FunctionComponent } from "react";

type DropItemProps = {
  dataName: string;
  dataValue: string;
};

const DropItem: FunctionComponent<ComponentProps<"div", DropItemProps>> = ({
  dataName,
  dataValue,
  ...restProps
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(dataName, dataValue);
  };
  return (
    <div {...restProps} draggable onDragStart={handleDragStart}>
      {restProps.children && restProps.children}
    </div>
  );
};

export default DropItem;
