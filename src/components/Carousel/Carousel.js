import React, { Children, useEffect, useState } from "react";
import classes from "./Carousel.module.css";

const widthSpan = 100.1;

function Carousel(props) {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [touchStartPosition, setTouchStartPosition] = useState(0);
  const [touchEndPosition, setTouchEndPosition] = useState(0);
  const [touched, setTouched] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [mouseStartPosition, setMouseStartPosition] = useState(0);
  const [mouseEndPosition, setMouseEndPosition] = useState(0);
  const [mouseClicked, setMouseClicked] = useState(false);
  const [mouseSwiped, setMouseSwiped] = useState(false);

  const { children, infinite, timer, stopOnManual } = props;
  const [autoAdvance, setAutoAdvance] = useState(timer !== undefined);
  let interval;

  const prevSlideHandler = () => {
    let newPosition = sliderPosition;
    if (newPosition > 0) {
      newPosition = newPosition - 1;
    } else if (infinite) {
      newPosition = children.length - 1 || 0;
    }
    translateFullSlides(newPosition);
    setSliderPosition(newPosition);
  };

  const nextSlideHandler = () => {
    let newPosition = sliderPosition;
    if (newPosition < children.length - 1) {
      newPosition = newPosition + 1;
    } else if (infinite) {
      newPosition = 0;
    }
    translateFullSlides(newPosition);
    setSliderPosition(newPosition);
  };

  const jumpToSlideHandler = (id) => {
    translateFullSlides(id);
    setSliderPosition(id);
  };

  const manageTimer = () => {
    clearInterval(interval);
    if (stopOnManual) {
      setAutoAdvance(false);
    }
  };

  const prevClickHandler = () => {
    manageTimer();
    prevSlideHandler();
  };

  const nextClickHandler = () => {
    manageTimer();
    nextSlideHandler();
  };

  const keyPressHandler = (event) => {
    manageTimer();
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      prevSlideHandler();
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      nextSlideHandler();
      return;
    }
    if (49 <= event.keyCode && event.keyCode <= 57) {
      const arrayPos = event.keyCode - 49;
      if (arrayPos < children.length) {
        jumpToSlideHandler(arrayPos);
      }
      return;
    }
    if (event.keyCode === 48) {
      if (children.length >= 10) jumpToSlideHandler(9);
    }
  };

  const speedUpAnimation = () => {
    for (
      let i = Math.max(0, sliderPosition - 2);
      i < (Math.min(children.length, sliderPosition + 3) || 1);
      i++
    ) {
      let elem = document.getElementById(`carouselitem` + i);
      elem.classList.add(classes.FastAnimation);
    }
  };

  const slowDownAnimation = () => {
    for (
      let i = Math.max(0, sliderPosition - 2);
      i < (Math.min(children.length, sliderPosition + 3) || 1);
      i++
    ) {
      let elem = document.getElementById(`carouselitem` + i);
      elem.classList.remove(classes.FastAnimation);
    }
  };

  const touchStartHandler = (e) => {
    manageTimer();
    speedUpAnimation();
    setTouchStartPosition(e.targetTouches[0].clientX);
    setTouchEndPosition(e.targetTouches[0].clientX);
    setTouched(true);
  };

  const touchMoveHandler = (e) => {
    setTouchEndPosition(e.targetTouches[0].clientX);
    const frameWidth = document.getElementById("DisplayFrame").offsetWidth;
    const translateDist =
      ((touchEndPosition - touchStartPosition) / frameWidth) * 100;
    translatePartialSlides(translateDist);
    if (touched === true) {
      setSwiped(true);
    }
  };

  const touchEndHandler = (e) => {
    if (swiped) {
      slowDownAnimation();
      if (touchStartPosition - touchEndPosition > 75) {
        nextSlideHandler();
      } else if (touchStartPosition - touchEndPosition < -75) {
        prevSlideHandler();
      } else {
        jumpToSlideHandler(sliderPosition);
      }
    }
    setTouched(false);
    setSwiped(false);
  };

  const mouseStartHandler = (e) => {
    manageTimer();
    e.preventDefault();
    speedUpAnimation();
    setMouseStartPosition(e.clientX);
    setMouseEndPosition(e.clientX);
    setMouseClicked(true);
  };

  const mouseMoveHandler = (e) => {
    e.preventDefault();
    var frameWidth = document.getElementById("DisplayFrame").offsetWidth;
    if (mouseClicked === true) {
      setMouseEndPosition(e.clientX);
      let translateDist =
        ((mouseEndPosition - mouseStartPosition) / frameWidth) * 100;
      translatePartialSlides(translateDist);
      setMouseSwiped(true);
    }
  };

  const mouseEndHandler = (e) => {
    slowDownAnimation();
    if (mouseSwiped === true) {
      if (mouseStartPosition - mouseEndPosition > 100) {
        nextSlideHandler();
      } else if (mouseStartPosition - mouseEndPosition < -100) {
        prevSlideHandler();
      } else {
        jumpToSlideHandler(sliderPosition);
      }
    }
    setMouseClicked(false);
    setMouseSwiped(false);
  };

  const wheelHandler = () => {
    document.getElementById("DisplayFrame").scrollLeft = 0;
  };

  const translatePartialSlides = (toTranslate) => {
    let currentTranslation = -sliderPosition * widthSpan;
    let totalTranslation = currentTranslation + toTranslate;
    for (var i = 0; i < (children.length || 1); i++) {
      let elem = document.getElementById(`carouselitem` + i);
      elem.style.transform = `translateX(` + totalTranslation + `%)`;
    }
  };

  const translateFullSlides = (newPosition) => {
    let toTranslate = -widthSpan * newPosition;
    for (var i = 0; i < (children.length || 1); i++) {
      let elem = document.getElementById(`carouselitem` + i);
      elem.style.transform = `translateX(` + toTranslate + `%)`;
    }
  };

  const displayItems = Children.map(children, (child, index) => (
    <div className={classes.CarouselItem} id={`carouselitem` + index}>
      {child}
    </div>
  ));

  const positionIndicators = Children.map(children, (child, index) => (
    <div
      className={
        sliderPosition === index
          ? classes.PositionIndicator.concat(" " + classes.CurrentPosition)
          : classes.PositionIndicator
      }
      onClick={() => jumpToSlideHandler(index)}
    ></div>
  ));

  useEffect(() => {
    window.addEventListener("keydown", keyPressHandler);
    if (autoAdvance && !mouseClicked && !touched) {
      interval = setInterval(() => {
        nextSlideHandler();
      }, timer);
    }
    return () => {
      window.removeEventListener("keydown", keyPressHandler);
      clearInterval(interval);
    };
  });

  return (
    <div>
      <div className={classes.Container}>
        <div className={classes.LeftArrow} onClick={prevClickHandler}>
          ❰
        </div>
        <div
          className={classes.DisplayFrame}
          id="DisplayFrame"
          onTouchStart={(e) => touchStartHandler(e)}
          onTouchMove={(e) => touchMoveHandler(e)}
          onTouchEnd={(e) => touchEndHandler(e)}
          onMouseDown={(e) => mouseStartHandler(e)}
          onMouseMove={(e) => mouseMoveHandler(e)}
          onMouseUp={(e) => mouseEndHandler(e)}
          onMouseLeave={(e) => mouseEndHandler(e)}
          onWheel={() => wheelHandler()}
        >
          {displayItems}
        </div>
        <div className={classes.RightArrow} onClick={nextClickHandler}>
          ❱
        </div>
      </div>

      <div className={classes.Navigation}>{positionIndicators}</div>
    </div>
  );
}

export default Carousel;
