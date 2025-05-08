import * as React from "react"
import { G, Path } from "react-native-svg"

interface HexagonBackgroundProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  [key: string]: any; // Để hỗ trợ props khác được truyền vào
}

function HexagonBackground({ width = 60, height = 60, x = 0, y = 0, ...props }: HexagonBackgroundProps) {
  return (
    <G x={x} y={y}>
      <Path
        fill="#537983"
        d="M1268 1600H439c-8 0-14-4-18-10L3 865c-4-6-4-14 0-20l420-728c4-7 10-10 18-10h825c7 0 14 3 17 10l421 728c3 6 3 14 0 20l-419 725c-3 6-10 10-17 10z"
        scale={width / 1707}
        data-original="#537983"
      />
      <Path
        fill="#6bb7ed"
        d="M1189 1462H518c-7 0-14-4-18-11L162 865c-4-6-4-14 0-21l340-589c3-6 10-10 18-10h667c7 0 14 4 18 10l340 589c4 7 4 15 0 21l-338 586c-4 7-11 11-18 11z"
        scale={width / 1707}
        data-original="#6bb7ed"
      />
      <Path
        fill="#a3d9ff"
        d="M540 1403h627l317-548-318-552H541L223 855z"
        scale={width / 1707}
        data-original="#a3d9ff"
      />
    </G>
  )
}

export default HexagonBackground