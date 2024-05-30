"use client"; // 确保这个组件是客户端组件

import { useState, useEffect, KeyboardEvent } from 'react';
import styles from './2048.module.css';

const SIZE = 4;

const getInitialGrid = (): number[][] => {
  const grid: number[][] = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
  addNumber(grid);
  addNumber(grid);
  return grid;
};

const addNumber = (grid: number[][]): void => {
  let added = false;
  while (!added) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);
    if (grid[row][col] === 0) {
      grid[row][col] = Math.random() < 0.9 ? 2 : 4;
      added = true;
    }
  }
};

const combine = (row: number[]): number[] => {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  return row;
};

const slide = (row: number[]): number[] => {
  row = row.filter(cell => cell !== 0);
  const missing = SIZE - row.length;
  const zeros = Array(missing).fill(0);
  return row.concat(zeros);
};

const moveUp = (grid: number[][]): number[][] => {
  const newGrid: number[][] = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
  for (let col = 0; col < SIZE; col++) {
    let newRow: number[] = [];
    for (let row = 0; row < SIZE; row++) {
      newRow.push(grid[row][col]);
    }
    newRow = slide(newRow);
    newRow = combine(newRow);
    newRow = slide(newRow);
    for (let row = 0; row < SIZE; row++) {
      newGrid[row][col] = newRow[row];
    }
  }
  return newGrid;
};

const moveDown = (grid: number[][]): number[][] => {
  const newGrid: number[][] = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
  for (let col = 0; col < SIZE; col++) {
    let newRow: number[] = [];
    for (let row = SIZE - 1; row >= 0; row--) {
      newRow.push(grid[row][col]);
    }
    newRow = slide(newRow);
    newRow = combine(newRow);
    newRow = slide(newRow);
    for (let row = SIZE - 1; row >= 0; row--) {
      newGrid[row][col] = newRow[SIZE - 1 - row];
    }
  }
  return newGrid;
};

const moveLeft = (grid: number[][]): number[][] => {
  return grid.map(row => {
    row = slide(row);
    row = combine(row);
    row = slide(row);
    return row;
  });
};

const moveRight = (grid: number[][]): number[][] => {
  return grid.map(row => {
    row = row.reverse();
    row = slide(row);
    row = combine(row);
    row = slide(row);
    return row.reverse();
  });
};

const calculateScore = (grid: number[][]): number => {
  return grid.flat().reduce((acc, cell) => acc + cell, 0);
};

const Game2048 = () => {
  const [grid, setGrid] = useState<number[][]>(getInitialGrid());
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const storedHighScore = localStorage.getItem('highScore');
    return storedHighScore ? parseInt(storedHighScore, 10) : 0;
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let newGrid: number[][] | null = null;

    switch (e.key) {
      case 'ArrowUp':
        newGrid = moveUp(grid);
        break;
      case 'ArrowDown':
        newGrid = moveDown(grid);
        break;
      case 'ArrowLeft':
        newGrid = moveLeft(grid);
        break;
      case 'ArrowRight':
        newGrid = moveRight(grid);
        break;
    }

    if (newGrid) {
      addNumber(newGrid);
      setGrid(newGrid);
      const newScore = calculateScore(newGrid);
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('highScore', newScore.toString());
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      handleKeyDown(event);
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [grid]);

  const resetGame = () => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
    setScore(0);
  };

  const getCellStyle = (value: number): string => {
    switch (value) {
      case 2:
        return styles.cell2;
      case 4:
        return styles.cell4;
      case 8:
        return styles.cell8;
      case 16:
        return styles.cell16;
      case 32:
        return styles.cell32;
      case 64:
        return styles.cell64;
      case 128:
        return styles.cell128;
      case 256:
        return styles.cell256;
      case 512:
        return styles.cell512;
      case 1024:
        return styles.cell1024;
      case 2048:
        return styles.cell2048;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container} tabIndex={0} onKeyDown={handleKeyDown}>
      <h1 className={styles.title}>2048</h1>
      <div className={styles.grid}>
        {grid.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div key={`${rowIndex}-${cellIndex}`} className={`${styles.cell} ${getCellStyle(cell)}`}>
              {cell !== 0 && cell}
            </div>
          ))
        )}
      </div>
      <p className={styles.score}>Score: {score}</p>
      <p className={styles.highScore}>High Score: {highScore}</p>
      <button className={styles.button} onClick={resetGame}>Restart</button>
    </div>
  );
};

export default Game2048;
