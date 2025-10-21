"use client";

import Lottie from "lottie-react";
import LoadingAnimation from "../../../public/assets/LoadinCustom.json";
import { CSSProperties } from "react";

interface LoadingProps {
  width?: string | number;
  height?: string | number;
  hueRotate?: number;
  loop?: boolean;
  className?: string;
}

export default function Loading({
  width = "400px",
  height = "400px",
  hueRotate,
  loop = true,
  className = "",
}: LoadingProps) {
  const style: CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    ...(hueRotate !== undefined && {
      filter: `hue-rotate(${hueRotate}deg)`,
    }),
  };

  return (
    <Lottie
      animationData={LoadingAnimation}
      loop={loop}
      style={style}
      className={className}
    />
  );
}

