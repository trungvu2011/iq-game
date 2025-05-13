import Svg, { Path, SvgProps } from "react-native-svg"

function PaperClip(props: SvgProps) {
  return (
    <Svg
      viewBox="0 0 32 32"
      {...props}
    >
      <Path
        fill="#417d88"
        d="M18 30a6 6 0 01-6-6V11a4 4 0 018 0v12a1 1 0 01-2 0V11a2 2 0 00-4 0v13a4 4 0 008 0V10a6 6 0 00-12 0v10a1 1 0 01-2 0V10a8 8 0 0116 0v14a6 6 0 01-6 6z"
      // data - original="#000000"
      />
    </Svg>
  )
}

export default PaperClip
