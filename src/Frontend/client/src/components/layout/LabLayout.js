import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';

const LabLayout = ({ width, height }) => {
  const computers = [
    { id: 1, x: 50, y: 50 },
    { id: 2, x: 150, y: 50 },
    { id: 3, x: 250, y: 50 },
  ];

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Room outline */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke="black"
          strokeWidth={2}
        />
        
        {/* Computers */}
        {computers.map(computer => (
          <React.Fragment key={computer.id}>
            <Rect
              x={computer.x}
              y={computer.y}
              width={50}
              height={30}
              fill="gray"
              stroke="black"
            />
            <Text
              x={computer.x + 20}
              y={computer.y + 10}
              text={computer.id.toString()}
              fill="white"
            />
          </React.Fragment>
        ))}
      </Layer>
    </Stage>
  );
};

export default LabLayout;