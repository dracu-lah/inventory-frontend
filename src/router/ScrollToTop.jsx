import { useState, useEffect } from "react";
import { Fab, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ScrollToTop = ({ targetRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollTarget = targetRef.current;
    if (!scrollTarget) return;

    const handleScroll = () => {
      setIsVisible(scrollTarget.scrollTop > 300);
    };

    scrollTarget.addEventListener("scroll", handleScroll);
    return () => {
      scrollTarget.removeEventListener("scroll", handleScroll);
    };
  }, [targetRef]);

  const scrollToTop = () => {
    targetRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Zoom in={isVisible}>
      <Fab
        color="primary"
        size="small"
        aria-label="scroll back to top"
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTop;
