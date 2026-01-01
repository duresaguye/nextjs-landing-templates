"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // L
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // J
];

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameStateRef = useRef({
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
    piece: SHAPES[0],
    pos: { x: 3, y: 0 },
    color: COLORS[0],
    nextPiece: SHAPES[1],
  });

  const getRandomPiece = useCallback(() => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[idx],
      color: COLORS[idx],
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;

    // Initialize game state
    const firstPiece = getRandomPiece();
    const secondPiece = getRandomPiece();
    
    gameStateRef.current = {
      board: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
      piece: firstPiece.shape,
      pos: { x: 3, y: 0 },
      color: firstPiece.color,
      nextPiece: secondPiece.shape,
    };

    function drawCell(x: number, y: number, color: string) {
      ctx.fillStyle = color;
      ctx.fillRect(
        x * BLOCK_SIZE,
        y * BLOCK_SIZE,
        BLOCK_SIZE - 1,
        BLOCK_SIZE - 1
      );
      
      // Add subtle highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fillRect(
        x * BLOCK_SIZE,
        y * BLOCK_SIZE,
        BLOCK_SIZE - 1,
        2
      );
    }

    function drawBoard() {
      // Clear with dark background
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * BLOCK_SIZE, 0);
        ctx.lineTo(x * BLOCK_SIZE, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * BLOCK_SIZE);
        ctx.lineTo(canvas.width, y * BLOCK_SIZE);
        ctx.stroke();
      }

      // Draw placed blocks
      const { board } = gameStateRef.current;
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (board[y][x]) {
            drawCell(x, y, board[y][x] as string);
          }
        }
      }
    }

    function drawPiece() {
      const { piece, pos, color } = gameStateRef.current;
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x]) {
            drawCell(pos.x + x, pos.y + y, color);
          }
        }
      }
    }

    function isValidMove(newX: number, newY: number, shape = gameStateRef.current.piece) {
      const { board } = gameStateRef.current;
      
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardX = newX + x;
            const boardY = newY + y;
            
            // Check boundaries
            if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
              return false;
            }
            
            // Check collision with placed blocks
            if (boardY >= 0 && board[boardY][boardX]) {
              return false;
            }
          }
        }
      }
      return true;
    }

    function placePiece() {
      const { piece, pos, color, board } = gameStateRef.current;
      
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x]) {
            const boardX = pos.x + x;
            const boardY = pos.y + y;
            
            if (boardY >= 0) {
              board[boardY][boardX] = color;
            }
          }
        }
      }
    }

    function clearLines() {
      const { board } = gameStateRef.current;
      let linesCleared = 0;
      
      for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
          // Remove the line
          board.splice(y, 1);
          // Add new empty line at top
          board.unshift(Array(COLS).fill(0));
          linesCleared++;
          // Check the same row again
          y++;
        }
      }
      
      if (linesCleared > 0) {
        const points = [0, 100, 300, 500, 800][linesCleared];
        setScore(prev => prev + points);
      }
    }

    function moveDown() {
      if (isPaused || gameOver) return;
      
      const { pos } = gameStateRef.current;
      
      if (isValidMove(pos.x, pos.y + 1)) {
        gameStateRef.current.pos.y += 1;
      } else {
        // Place the piece if it can't move down
        if (pos.y === 0) {
          // Game over if piece is at the top
          setGameOver(true);
          return;
        }
        
        placePiece();
        clearLines();
        
        // Get next piece
        const nextPiece = getRandomPiece();
        gameStateRef.current.piece = gameStateRef.current.nextPiece;
        gameStateRef.current.color = nextPiece.color;
        gameStateRef.current.nextPiece = nextPiece.shape;
        gameStateRef.current.pos = { x: 3, y: 0 };
        
        // Check if new piece can be placed
        if (!isValidMove(3, 0)) {
          setGameOver(true);
        }
      }
      
      drawBoard();
      drawPiece();
    }

    function rotatePiece() {
      if (isPaused || gameOver) return;
      
      const { piece } = gameStateRef.current;
      const rotated = piece[0].map((_, i) =>
        piece.map((row) => row[i]).reverse()
      );
      
      if (isValidMove(gameStateRef.current.pos.x, gameStateRef.current.pos.y, rotated)) {
        gameStateRef.current.piece = rotated;
        drawBoard();
        drawPiece();
      }
    }

    function movePiece(dx: number) {
      if (isPaused || gameOver) return;
      
      const { pos } = gameStateRef.current;
      if (isValidMove(pos.x + dx, pos.y)) {
        gameStateRef.current.pos.x += dx;
        drawBoard();
        drawPiece();
      }
    }

    // Game loop
    let lastTime = 0;
    const dropInterval = 500; // ms
    
    function gameLoop(timestamp: number) {
      if (lastTime === 0) lastTime = timestamp;
      const delta = timestamp - lastTime;
      
      if (delta > dropInterval && !isPaused && !gameOver) {
        moveDown();
        lastTime = timestamp;
      }
      
      requestAnimationFrame(gameLoop);
    }
    
    const animationId = requestAnimationFrame(gameLoop);

    // Handle keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver && e.key !== 'r' && e.key !== 'R') return;
      
      switch(e.key) {
        case "ArrowLeft":
          movePiece(-1);
          break;
        case "ArrowRight":
          movePiece(1);
          break;
        case "ArrowDown":
          moveDown();
          break;
        case "ArrowUp":
          rotatePiece();
          break;
        case " ":
          setIsPaused(!isPaused);
          break;
        case "r":
        case "R":
          if (gameOver) {
            restartGame();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial draw
    drawBoard();
    drawPiece();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(animationId);
    };
  }, [isPaused, gameOver, getRandomPiece]);

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    
    const firstPiece = getRandomPiece();
    const secondPiece = getRandomPiece();
    
    gameStateRef.current = {
      board: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
      piece: firstPiece.shape,
      pos: { x: 3, y: 0 },
      color: firstPiece.color,
      nextPiece: secondPiece.shape,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Tetris
          </h1>
          <p className="text-gray-400 mt-2">Modern and Clean</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Game Canvas */}
          <div className="flex-1">
            <div className="relative inline-block">
              <canvas
                ref={canvasRef}
                className="rounded-lg shadow-2xl bg-gray-900 border border-gray-800"
              />
              
              {/* Game Over Overlay */}
              {gameOver && (
                <div className="absolute inset-0 bg-black/80 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <h2 className="text-3xl font-bold text-red-400 mb-4">Game Over</h2>
                    <p className="text-xl text-gray-300 mb-6">Score: {score}</p>
                    <button
                      onClick={restartGame}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              )}
              
              {/* Pause Overlay */}
              {isPaused && !gameOver && (
                <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-yellow-400 mb-2">Paused</h2>
                    <p className="text-gray-300">Press Space to resume</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Game Controls */}
            <div className="flex gap-4 mt-6 justify-center">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {isPaused ? "▶ Resume" : "⏸ Pause"}
              </button>
              <button
                onClick={restartGame}
                className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                🔄 Restart
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:w-80 space-y-6">
            {/* Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-blue-300">Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Score</span>
                  <span className="text-3xl font-bold text-white">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    gameOver ? 'bg-red-500/20 text-red-400' :
                    isPaused ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {gameOver ? 'Game Over' : isPaused ? 'Paused' : 'Playing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Piece */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">Next Piece</h2>
              <div className="flex justify-center">
                <div className="inline-block p-4 bg-gray-900/50 rounded-lg">
                  {gameStateRef.current.nextPiece.map((row, y) => (
                    <div key={y} className="flex">
                      {row.map((cell, x) => (
                        <div
                          key={x}
                          className={`w-8 h-8 m-1 rounded ${
                            cell 
                              ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                              : 'bg-gray-800/30'
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-green-300">Controls</h2>
              <div className="space-y-3">
                {[
                  ["← →", "Move"],
                  ["↑", "Rotate"],
                  ["↓", "Soft Drop"],
                  ["Space", "Pause"],
                  ["R", "Restart"],
                ].map(([key, action]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-0">
                    <span className="text-gray-300">{action}</span>
                    <kbd className="px-3 py-1 bg-gray-900 rounded text-sm font-mono">{key}</kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Use arrow keys to move and rotate pieces. Try to complete lines!</p>
        </div>
      </div>
    </div>
  );
}