import React, { useState } from 'react';
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

function Dog(props: { msg: string, backgroundPosition: string }) {
  const [speaking, setSpeaking] = useState(false);

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
</div>;
}

function Button(props: { style: Partial<CSSStyleDeclaration>, onClick: () => void }) {
  return <div onClick={props.onClick} style={{
      width: '50px',
      height: '50px',
      top: '50%',
      transform: 'translateY(-50%)',
      border: '4px solid #fff',
      background: '#0000cc',
      borderRadius: '100%',
      position: 'fixed',
      zIndex: 1,
      ...props.style,
  } as any}/>
}

function App() {
  const [index, setIndex] = useState(0);
  const [isDogVisible, setIsDogVisible] = useState(true);

  const dogs = [
      { backgroundPosition: '-20px -171px', msg: 'rabul spieszy z pomocą' },
      { backgroundPosition: '-130px -171px', msg: 'psi patrol rusza do akcji' },
      { backgroundPosition: '-246px -171px', msg: 'antek wzywa do bazy' },
      { backgroundPosition: '-365px -171px', msg: 'lód czy śnieg, nie poddam się' },
      { backgroundPosition: '-486px -175px', msg: 'działko wodne' },
      { backgroundPosition: '-612px -171px', msg: 'oto pies który lata' },
      { backgroundPosition: '-1109px -317px', msg: 'zielone znaczy leć' },
      { backgroundPosition: '-606px -326px', msg: 'czejs się tym zajmie' },
  ];

  const refreshDog = () => {
    setIsDogVisible(false);
    setTimeout(() => setIsDogVisible(true));
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #333, #000) #000',
    }}>
      {isDogVisible && <Dog {...dogs[index]}/>}
      {index > 0 && <Button style={{ left: '20px' }} onClick={() => {
        if (index > 0) {
          setIndex(i=>i-1);
          refreshDog();
        }
      }}/>}
      {dogs[index+1] && <Button style={{ right: '20px' }} onClick={() => {
        if (dogs[index+1]) {
          setIndex(i=>i+1);
          refreshDog();
        }
      }}/>}
    </div>
  );
}