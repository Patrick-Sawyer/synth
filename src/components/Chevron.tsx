interface ChevronProps {
  color?: string;
  height?: string;
}

function Chevron({
  color = "black",
  height = "20px",
}: ChevronProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 7 12"
      style={{ height }}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M.784 12L0 11.242 5.43 6 0 .758.784 0l5.432 5.242L7 6l-.784.758z"
      />
    </svg>
  );
}

export default Chevron;
