"use client";
import { type CSSProperties, type ReactNode, useEffect } from "react";

type DrawerDirection = "left" | "right" | "top" | "bottom";

type Props = {
  open: boolean;
  onClose: () => void;
  direction: DrawerDirection;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  overlayOpacity?: number;
};

const translateMap: Record<DrawerDirection, { closed: string; open: string }> = {
  left:   { closed: "-translate-x-full", open: "translate-x-0" },
  right:  { closed: "translate-x-full",  open: "translate-x-0" },
  top:    { closed: "-translate-y-full", open: "translate-y-0" },
  bottom: { closed: "translate-y-full",  open: "translate-y-0" },
};

const positionMap: Record<DrawerDirection, string> = {
  left:   "top-0 left-0 h-full",
  right:  "top-0 right-0 h-full",
  top:    "top-0 left-0 w-full",
  bottom: "bottom-0 left-0 w-full",
};

const Drawer = ({ open, onClose, direction, children, className, style, overlayOpacity = 0.5 }: Props) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const { closed, open: openClass } = translateMap[direction];
  const position = positionMap[direction];

  return (
    <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: open ? overlayOpacity : 0 }}
        onClick={onClose}
      />
      <div
        className={`absolute ${position} bg-white shadow-xl overflow-auto transition-transform duration-300 ${open ? openClass : closed} ${className ?? ""}`}
        style={style}
      >
        {children}
      </div>
    </div>
  );
};

export default Drawer;
