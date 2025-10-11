import React, { useEffect, useRef, useState } from 'react';

const Shoot = () => {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [multiplier, setMultiplier] = useState(0.1);
  const [cashedOut, setCashedOut] = useState(false);
  const [winStreak, setWinStreak] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size for crisp rendering
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();

    let x = 0;
    let y = canvas.height / (2 * window.devicePixelRatio);
    let animationFrame;
    let gameOver = false;
    const points = [];
    const amplitude = canvas.height / (3 * window.devicePixelRatio);
    const speed = 0.04;

    // If user won 2 or more times, force a super fast crash
    const forceCrash =
      winStreak >= 2 ? Math.random() * 400 + 200 : Math.random() * 7000 + 2000; // crash in 0.2-0.6s else 2-9s
    const startTime = Date.now();

    const draw = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (gameOver) return;

      if (running && !cashedOut) {
        setMultiplier((prev) => +(prev + 0.01).toFixed(2));
      }

      x += 4;
      y =
        canvas.height / (2 * window.devicePixelRatio) +
        Math.sin(x * speed) * amplitude +
        (Math.random() - 0.5) * 10;

      y = Math.max(2, Math.min(canvas.height / window.devicePixelRatio - 2, y));

      if (elapsed >= forceCrash || y >= canvas.height / window.devicePixelRatio - 2) {
        gameOver = true;
        setCrashed(true);
        setRunning(false);

        // Reset win streak if user didn't cash out before crash
        if (!cashedOut) {
          setWinStreak(0);
        }
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();

      points.push({ x, y });

      const maxPoints = Math.floor(canvas.width / (4 * window.devicePixelRatio));
      if (points.length > maxPoints) points.shift();

      if (points.length > 0) {
        ctx.moveTo(10, points[0].y);
        for (let i = 1; i < points.length; i++) {
          const px = 10 + i * 4;
          ctx.lineTo(px, points[i].y);
        }
      }

      ctx.strokeStyle = '#00ff99';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (!gameOver) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    if (running && !cashedOut) {
      draw();
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [running, cashedOut, winStreak]);

  const startGame = () => {
    setRunning(true);
    setCrashed(false);
    setMultiplier(0.1);
    setCashedOut(false);
  };

  const cashOut = () => {
    if (!running || crashed || cashedOut) return;
    setCashedOut(true);
    setRunning(false);
    setWinStreak((prev) => prev + 1); // Increment win streak when cashed out successfully
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 Crash Game</h1>

      <div style={styles.graphWrapper}>
        <canvas ref={canvasRef} style={styles.canvas} />
        {crashed && (
          <div style={styles.crashOverlay}>
            💥 Game Crashed at <strong>{multiplier.toFixed(2)}x</strong>
          </div>
        )}
        {cashedOut && !crashed && (
          <div style={{ ...styles.crashOverlay, background: 'rgba(0, 255, 150, 0.85)' }}>
            💰 Cashed Out at <strong>{multiplier.toFixed(2)}x</strong>
          </div>
        )}
      </div>

      <div style={styles.controls}>
        <p style={styles.multiplier}>Multiplier: {multiplier.toFixed(2)}x</p>
        <p style={{ color: '#00ff99', fontWeight: 'bold' }}>Win Streak: {winStreak}</p>
        <button
          onClick={startGame}
          style={{
            ...styles.button,
            backgroundColor: running ? '#999' : '#ffc107',
            cursor: running ? 'not-allowed' : 'pointer',
            marginRight: 10,
          }}
          disabled={running}
        >
          {running ? 'Running...' : 'Start New Game'}
        </button>
        <button
          onClick={cashOut}
          style={{
            ...styles.button,
            backgroundColor: running && !cashedOut ? '#00cc44' : '#555',
            cursor: running && !cashedOut ? 'pointer' : 'not-allowed',
          }}
          disabled={!running || crashed || cashedOut}
        >
          Cash Out
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#060623',
    minHeight: '100vh',
    padding: '20px',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '28px',
    color: '#ffcc00',
    marginBottom: '20px',
  },
  graphWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '700px',
    height: '300px',
    backgroundColor: '#111',
    border: '2px solid #444',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  crashOverlay: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '22px',
    color: '#fff',
    textAlign: 'center',
    zIndex: 2,
  },
  controls: {
    marginTop: '20px',
    textAlign: 'center',
  },
  multiplier: {
    fontSize: '24px',
    marginBottom: '10px',
    color: '#00ff99',
    fontWeight: 'bold',
  },
  button: {
    padding: '10px 20px',
    fontSize: '18px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    transition: '0.3s',
  },
};

export default Shoot;
