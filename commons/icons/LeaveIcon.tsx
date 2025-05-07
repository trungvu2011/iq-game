import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={512}
      height={512}
      viewBox="0 0 512 512"
      fill="white"
      {...props}
    >
      <Path
        d="M363.335 488a24 24 0 01-24 24H113.082a80.09 80.09 0 01-80-80V80a80.09 80.09 0 0180-80h226.253a24 24 0 010 48H113.082a32.035 32.035 0 00-32 32v352a32.034 32.034 0 0032 32h226.253a24 24 0 0124 24zm108.553-248.97L357.837 124.978a24 24 0 10-33.937 33.941L396.977 232H208.041a24 24 0 100 48h188.935l-73.08 73.08a24 24 0 1033.941 33.941l114.051-114.05a24 24 0 000-33.941z"
        data-original="#000000"
      />
    </Svg>
  )
}

export default SvgComponent
