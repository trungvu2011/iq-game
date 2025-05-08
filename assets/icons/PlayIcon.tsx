import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={512}
      height={512}
      viewBox="0 0 512 512"
      {...props}
    >
      <Path
        fillRule="evenodd"
        d="M468.8 235.007L67.441 3.277A24.2 24.2 0 0055.354-.008h-.07A24.247 24.247 0 0043.19 3.279a24 24 0 00-12.11 20.992v463.456a24.186 24.186 0 0036.36 20.994L468.8 276.99a24.238 24.238 0 000-41.983z"
        fill="white"
      />
    </Svg>
  )
}

export default SvgComponent
