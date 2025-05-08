import * as React from "react"
import Svg, { G, Circle, Path, SvgProps } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={512}
      height={512}
      viewBox="0 0 24 24"
      {...props}
    >
      <G data-name="Layer 2">
        <Circle
          cx={12}
          cy={12}
          r={10.75}
          fill="#ff6174"
          data-original="#ff6174"
        />
        <G fill="#fff">
          <Path
            d="M9 15.75a.75.75 0 01-.53-1.28l6-6a.75.75 0 011.06 1.06l-6 6a.744.744 0 01-.53.22z"
            data-original="#ffffff"
          />
          <Path
            d="M15 15.75a.744.744 0 01-.53-.22l-6-6a.75.75 0 011.06-1.06l6 6a.75.75 0 01-.53 1.28z"
            data-original="#ffffff"
          />
        </G>
      </G>
    </Svg>
  )
}

export default SvgComponent
