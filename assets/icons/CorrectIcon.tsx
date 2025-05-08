import * as React from "react"
import Svg, { Circle, Path, SvgProps } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={512}
      height={512}
      viewBox="0 0 2.54 2.54"
      fillRule="evenodd"
      {...props}
    >
      <Circle
        cx={1.27}
        cy={1.27}
        r={1.27}
        fill="#00ba00"
        data-original="#00ba00"
      />
      <Path
        fill="#fff"
        d="M.873 1.89L.41 1.391a.17.17 0 01.008-.24.17.17 0 01.24.009l.358.383.567-.53A.17.17 0 011.599 1l.266-.249a.17.17 0 01.24.008.17.17 0 01-.008.24l-.815.76-.283.263-.125-.134z"
        data-original="#ffffff"
      />
    </Svg>
  )
}

export default SvgComponent
