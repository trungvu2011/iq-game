import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={512}
      height={512}
      viewBox="0 0 2000 2000"
      {...props}
    >
      <Path
        d="M953.2 1383.7c-29.8 0-53.9-24.1-53.9-53.9 0-70.5 10-131.4 29.9-182.6 14.6-38.6 38.3-77.5 70.9-116.8 24-28.6 67-70.4 129.2-125.2 62.2-54.9 102.6-98.6 121.3-131.2s27.9-68.2 27.9-106.8c0-69.9-27.3-131.2-81.8-184.1s-121.4-79.3-200.6-79.3c-76.5 0-140.4 24-191.6 71.9-37.4 35-65.5 84.4-84.1 148.2-12.8 43.8-55.5 71.8-100.8 66.4-57.4-6.8-95.2-63.6-78.8-119.1 25.2-85.3 67.4-154 126.5-206.2 82.1-72.7 190.7-109 325.8-109 143 0 257.1 38.9 342.3 116.8s127.7 172 127.7 282.4c0 63.9-15 122.8-44.9 176.6-29.9 53.9-88.5 119.4-175.6 196.6-58.5 51.9-96.8 90.2-114.8 114.8s-31.3 52.9-39.9 84.8c-6.4 23.7-10.8 58.5-13.2 104.2-1.5 28.8-25.4 51.4-54.2 51.4h-67.3zm-63.9 258c0-56.5 45.8-102.3 102.3-102.3s102.3 45.8 102.3 102.3-45.8 102.3-102.3 102.3-102.3-45.8-102.3-102.3z"
        fill="white"
      />
    </Svg>
  )
}

export default SvgComponent
