import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={512}
      height={512}
      viewBox="0 0 24 24"
      {...props}
    >
      <Path
        fillRule="evenodd"
        d="M8 4a1 1 0 011 1v14a1 1 0 11-2 0V5a1 1 0 011-1zm8 0a1 1 0 011 1v14a1 1 0 11-2 0V5a1 1 0 011-1z"
        clipRule="evenodd"
        fill="white"
      />
    </Svg>
  )
}

export default SvgComponent
