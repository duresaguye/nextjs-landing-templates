"use client";

import { useEffect, useRef } from "react";

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;

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

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;

    let board = Array.from({ length: ROWS }, () =>
      Array(COLS).fill(0)
    );

    let piece = randomPiece();
    let pos = { x: 3, y: 0 };

    function randomPiece() {
      return SHAPES[Math.floor(Math.random() * SHAPES.length)];
    }

    function drawCell(x: number, y: number) {
      ctx.fillStyle = "#4f46e5";
      ctx.fillRect(
        x * BLOCK_SIZE,
        y * BLOCK_SIZE,
        BLOCK_SIZE - 1,
        BLOCK_SIZE - 1
      );
    }

    function drawBoard() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      board.forEach((row, y) =>
        row.forEach((cell, x) => cell && drawCell(x, y))
      );
    }

    function drawPiece() {
      piece.forEach((row, y) =>
        row.forEach(
          (cell, x) =>
            cell && drawCell(pos.x + x, pos.y + y)
        )
      );
    }

    function collide(px = pos.x, py = pos.y, shape = piece) {
      return shape.some((row, y) =>
        row.some((cell, x) => {
          if (!cell) return false;
          const nx = px + x;
          const ny = py + y;
          return (
            nx < 0 ||
            nx >= COLS ||
            ny >= ROWS ||
            board[ny]?.[nx]
          );
        })
      );
    }

    function merge() {
      piece.forEach((row, y) =>
        row.forEach((cell, x) => {
          if (cell) board[pos.y + y][pos.x + x] = 1;
        })
      );
    }

    function rotate() {
      const rotated = piece[0].map((_, i) =>
        piece.map((row) => row[i]).reverse()
      );
      if (!collide(pos.x, pos.y, rotated)) piece = rotated;
    }

    function drop() {
      if (!collide(pos.x, pos.y + 1)) {
        pos.y++;
      } else {
        merge();
        piece = randomPiece();
        pos = { x: 3, y: 0 };
        if (collide()) board = board.map((r) => r.fill(0));
      }
    }

    function loop() {
      drawBoard();
      drawPiece();
    }

    const interval = setInterval(() => {
      drop();
      loop();
    }, 500);

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && !collide(pos.x - 1, pos.y)) pos.x--;
      if (e.key === "ArrowRight" && !collide(pos.x + 1, pos.y)) pos.x++;
      if (e.key === "ArrowDown") drop();
      if (e.key === "ArrowUp") rotate();
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
      <h1 className="mb-4 text-3xl font-bold">Tetris Game 🎮</h1>
      <canvas ref={canvasRef} className="border border-zinc-700" />
      <p className="mt-4 text-sm text-zinc-400">
        Use ← → ↓ to move, ↑ to rotate
      </p>
    </div>
  );
}
