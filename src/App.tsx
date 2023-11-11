import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const style = document.createElement('style');

style.innerHTML = `
body {
    margin: 0;
    background: #000;
}

@keyframes dog {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}`;

document.body.appendChild(style);

export default App;

function Dog(props: { msg: string, backgroundPosition: string, video?: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [video, setVideo] = useState(false);

  return <div style={{
    width: '100vw   ',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    float: 'left',
    overflow: 'hidden',
    animation: 'dog .3s',
}}>
  <div style={{
        width: '200px',
        height: '200px',
        borderRadius: '100%',
        background: '#fff',
        transition: 'all .3s',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        transform: speaking ? 'rotate(15deg) scale(1.5)' : '',
        boxShadow: speaking ? '0 0 20px yellow' : '',
    }}
    onClick={() => {
      if (!speechSynthesis || speechSynthesis.speaking) return;

      if (props.video) {
        setVideo(true);
        setTimeout(() => document.querySelector('video')?.play());
        return;
      }

      let utterance = new SpeechSynthesisUtterance(props.msg);
      utterance.addEventListener('end', () => {
          setSpeaking(false);
      });
      setSpeaking(true);
      speechSynthesis.speak(utterance);
  }}>
    <div style={{
      width: '50%',
      height: '140px',
      background: 'url(./i.jpg)',
      backgroundPosition: props.backgroundPosition,
    }}/>
  </div>
  {video && 
    <video onEnded={() => setVideo(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <source src={props.video+'.mp4'} type='video/mp4'/>
    </video>
  }
</div>;
}

function Button(props: { style: Partial<CSSStyleDeclaration>, onClick: () => void }) {
  const style = Object.assign({
    width: '50px',
    height: '50px',
    top: '50%',
    transform: 'translateY(-50%)',
    border: '4px solid #fff',
    background: '#0000cc',
    borderRadius: '100%',
    position: 'fixed',
    zIndex: 1,
}, props.style);

  return <div onClick={props.onClick} style={style as any}/>
}

function App() {
  const [index, setIndex] = useState(0);
  const [isDogVisible, setIsDogVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const dogs = [
      { backgroundPosition: '-20px -171px', msg: 'rabul spieszy z pomocą', video: './rabul' },
      { backgroundPosition: '-130px -171px', msg: 'psi patrol rusza do akcji' },
      { backgroundPosition: '-246px -171px', msg: 'antek wzywa do bazy' },
      { backgroundPosition: '-365px -171px', msg: 'lód czy śnieg, nie poddam się' },
      { backgroundPosition: '-486px -175px', msg: 'działko wodne', video: './marshal' },
      { backgroundPosition: '-612px -171px', msg: 'oto pies który lata' },
      { backgroundPosition: '-1109px -317px', msg: 'zielone znaczy leć' },
      { backgroundPosition: '-606px -326px', msg: 'czejs się tym zajmie' },
  ];

  const prev = () => {
    setIndex(i=> {
      refreshDog();
      return i > 0 ? i-1 : dogs.length - 1;
    });
  }

  const next = () => {     
    setIndex(i=> {
      refreshDog();
      return dogs[i+1] ? i+1 : 0;
    });
  }

  const refreshDog = () => {
    setIsDogVisible(false);
    setTimeout(() => setIsDogVisible(true));
  };

  useEffect(() => {
    const listener = new SwipeListener({
      element: ref.current!,
      onSwipeLeft: prev,
      onSwipeRight: next,
    });

    listener.activate();

    return () => listener.deactivate();
  }, []);

  return (
    <div ref={ref} style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #333, #000) #000',
    }}>
      {isDogVisible && <Dog {...dogs[index]}/>}
      <Button style={{ left: '20px' }} onClick={prev}/>
      <Button style={{ right: '20px' }} onClick={next}/>
    </div>
  );
}

const touchSupport = true;

class Point {
  x: number;
  y: number;

  constructor({ x, y }: { x?: number, y?: number } = {}) {
      this.x = x || 0;
      this.y = y || 0;
  }

  add<T extends { x: number, y: number }>(point: T) {
      return new Point({
          x: this.x + point.x,
          y: this.y + point.y,
      });
  }

  subtract<T extends { x: number, y: number }>(point: T) {
      return this.add({
          x: -point.x,
          y: -point.y,
      });
  }
}

interface DragListenerParams {
  element: HTMLElement;
  onMove?: OnMove;
  preventDefault?: boolean;
}

interface OnMove {
  (p: { drag: Point, move: Point }): void;
}

class DragListener {
  private element: HTMLElement;
  private onMove: OnMove;
  private startPoint?: Point;
  private prevPosition?: Point;
  private active?: boolean;

  constructor({element, onMove = () => {}, preventDefault = true}: DragListenerParams) {
      this.element = element;
      this.onMove = onMove;
      this.onTouchMove = this.onTouchMove.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onTouchStart = this.onTouchStart.bind(this);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.end = this.end.bind(this);
      if (!preventDefault) {
          this.preventDefault = () => {};
      }
  }

  activate() {
      if (!this.active) {
          this.active = true;
          this.element.addEventListener(
              touchSupport ? 'touchstart' : 'mousedown',
              (touchSupport ? this.onTouchStart : this.onMouseDown) as any
          );
      }
  }

  deactivate() {
      if (this.active) {
          this.active = false;
          this.element.removeEventListener(
              touchSupport ? 'touchstart' : 'mousedown',
              (touchSupport ? this.onTouchStart : this.onMouseDown) as any
          );
      }
  }

  end() {
      this.element.removeEventListener(
          touchSupport ? 'touchmove' : 'mousemove',
          (touchSupport ? this.onTouchMove : this.onMouseMove) as any
      );
      (touchSupport ? ['touchend'] : ['mouseleave', 'mouseup']).forEach(event => {
          this.element.removeEventListener(event, this.end);
      });
  }

  private onTouchStart(event: TouchEvent) {
      const touch = event.touches[0];

      this.preventDefault(event);
      this.start(new Point({ x: touch.pageX, y: touch.pageY }));
  }

  private onMouseDown (event: MouseEvent) {
      this.preventDefault(event);
      this.start(new Point({ x: event.pageX, y: event.pageY }));
  }

  private start(point: Point) {
      this.startPoint = point;
      this.prevPosition = point;
      this.element.addEventListener(
          touchSupport ? 'touchmove' : 'mousemove',
          (touchSupport ? this.onTouchMove : this.onMouseMove) as any
      );
      (touchSupport ? ['touchend'] : ['mouseleave', 'mouseup']).forEach(event => {
          this.element.addEventListener(event, this.end);
      });
  }

  private onTouchMove(event: TouchEvent) {
      const touch = event.touches[0];

      this.preventDefault(event);
      this.move(new Point({ x: touch.pageX, y: touch.pageY }));
  }

  private onMouseMove(event: MouseEvent) {
      this.preventDefault(event);
      this.move(new Point({ x: event.pageX, y: event.pageY }));
  }

  private move(point: Point) {
      if (this.startPoint && this.prevPosition)
      this.onMove({
          drag: point.subtract(this.startPoint),
          move: point.subtract(this.prevPosition),
      });
      this.prevPosition = point;
  }

  private preventDefault<T extends Event>(event: T) {
      event.preventDefault();
  }
}

export interface SwipeListenerParams {
  element: HTMLElement;
  onSwipeLeft?: Function;
  onSwipeRight?: Function;
}

class DraggableListener extends DragListener{}

class SwipeListener {
  private onSwipeLeft: Function;
  private onSwipeRight: Function;
  private draggableListener: DraggableListener;

  constructor({element, onSwipeRight = () => {}, onSwipeLeft = () => {}}: SwipeListenerParams) {
      this.onSwipeLeft = onSwipeLeft;
      this.onSwipeRight = onSwipeRight;
      this.draggableListener = new DraggableListener({
          element,
          preventDefault: false,
          onMove: ({ drag, move }) => {
              if (drag.x > 100) {
                  this.onSwipeRight();
                  this.draggableListener.end();
              }
              else if (drag.x < -100) {
                  this.onSwipeLeft();
                  this.draggableListener.end();
              }
          }
      });
  }

  activate() {
      this.draggableListener.activate();
  }

  deactivate() {
      this.draggableListener.deactivate();
  }
}