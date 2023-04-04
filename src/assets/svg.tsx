interface Props {
  color: string;
  size: string;
}

export const CloseIcon = ({ color, size }: Props) => {
  return (
    <svg
      height={size}
      id="Layer_1"
      version="1.1"
      viewBox="0 0 512 512"
      width={size}
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill={color}
    >
      <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" />
    </svg>
  );
};

export const ChevronIcon = ({ size, color }: Props) => {
  return (
    <svg
      height={size}
      id="Capa_1"
      version="1.1"
      viewBox="0 0 50 60"
      width="50px"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill={color}
    >
      <g>
        <path d="M48.479,27.435L5.672,0.915C2.553-1.132,0,0.374,0,4.261v51.48c0,3.885,2.553,5.391,5.672,3.346l42.807-26.52   c0,0,1.521-1.07,1.521-2.566S48.479,27.435,48.479,27.435z" />
      </g>
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
    </svg>
  );
};
