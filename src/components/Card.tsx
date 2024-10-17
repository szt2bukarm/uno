import { forwardRef, useEffect, useRef,memo } from "react";
import styled from "styled-components";
import gsap from "gsap";
import useStore from "../store";

const Wrapper = styled.div`
  position: relative;
  width: 135px;
  height: 225px;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.05s;
  user-select: none;
  pointer-events: all;
`;

const Shadow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 2;
`;

const Front = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  transform: rotateY(0deg);
`;

const Back = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
`;

interface CardProps {
  type: string;
  card: string;
  onClick: () => void;
  absolute: boolean;
  allowHover: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ type, card, onClick, absolute = false, allowHover = true }, ref) => {
    const shadowRef = useRef<HTMLDivElement>(null);
    const frontRef = useRef<HTMLImageElement>(null);
    const backRef = useRef<HTMLImageElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const { playedCards } = useStore();

    const tiltHandler = (e: any) => {
      if (!allowHover) return;
      const wrapper = e.currentTarget.getBoundingClientRect();

      const x = (e.clientX - (wrapper.left + wrapper.width / 2)) / 6;
      const y = (e.clientY - (wrapper.top + wrapper.height / 2)) / 6;

      gsap.to(cardRef.current, {
        rotateX: -y,
        rotateY: x,
        transformPerspective: 600,
      });
      gsap.to(cardRef.current, {
        css: {
          filter: `drop-shadow(${-x / 2}px ${-y / 2}px 20px rgba(0,0,0,0.7))`,
        },
      });
      gsap.to(shadowRef.current, {
        css: {
          boxShadow: `inset ${-x / 2}px ${-y / 2}px 20px rgba(0,0,0,0.3)`,
        },
      });
    };

    const onLeave = () => {
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
      });
      gsap.to(cardRef.current, {
        css: {
          filter: `drop-shadow(0px 0px 20px rgba(0,0,0,0.05))`,
        },
      });
      gsap.to(shadowRef.current, {
        css: {
          boxShadow: `inset 0px 0px 0px rgba(0,0,0,0.1)`,
        },
      });
    };

    return (
      <div
        style={{
          position: absolute ? "absolute" : "relative",
          boxShadow: absolute ? "0px 0px 20px rgba(0, 0, 0, 0.5)" : "none",
        }}
        ref={ref}
        onClick={onClick}
      >
        <Wrapper ref={cardRef} onMouseMove={tiltHandler} onMouseLeave={onLeave}>
          <Shadow ref={shadowRef} />
          <Front
            ref={frontRef}
            src={`cards/${type}/${card}.png`}
            className="front"
          />
          <Back ref={backRef} src={`cards/1.png`} className="back" />
        </Wrapper>
      </div>
    );
  }
);

// Memoizing the Card component
export default memo(Card, (prevProps, nextProps) => {
  return (
    prevProps.type === nextProps.type &&
    prevProps.card === nextProps.card &&
    prevProps.absolute === nextProps.absolute &&
    prevProps.allowHover === nextProps.allowHover
  );
});
