import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useThemeColors } from '../theme/ThemeContext';
// Logic library (install: npm install chess.js)
// We guard import to avoid runtime crash if not installed yet.
let ChessLib;
try {
  // chess.js >=1.0 uses named export Chess
  // eslint-disable-next-line import/no-extraneous-dependencies
  // dynamic require for compatibility
  // eslint-disable-next-line global-require
  const mod = require('chess.js');
  ChessLib = mod.Chess || mod; // handle default export older versions
} catch (e) {
  ChessLib = null;
}

const iconNameFromType = {
  p: 'chess-pawn',
  r: 'chess-rook',
  n: 'chess-knight',
  b: 'chess-bishop',
  q: 'chess-queen',
  k: 'chess-king',
};

export default function ChessBoard({ fen = 'start', size = 320, borderRadius = 0 }) {
  const squareSize = size / 8;
  const colors = useThemeColors();
  const dark = colors.primary;
  const light = colors.secondary;
  const pieceColorWhite = '#F5F7FA';
  const pieceColorBlack = '#1E1E1E';
  const highlightColor = colors.success || '#4caf50';
  const moveDotColor = colors.muted;

  const [game] = useState(() => {
    if (!ChessLib) return null;
    const g = new ChessLib();
    if (fen !== 'start') {
      try { g.load(fen); } catch (e) { /* ignore invalid fen */ }
    }
    return g;
  });
  const [boardData, setBoardData] = useState(() => {
    if (!game) {
      return [
        ['bR','bN','bB','bQ','bK','bB','bN','bR'],
        ['bP','bP','bP','bP','bP','bP','bP','bP'],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        ['wP','wP','wP','wP','wP','wP','wP','wP'],
        ['wR','wN','wB','wQ','wK','wB','wN','wR'],
      ];
    }
    return game.board().map(rank => rank.map(cell => {
      if (!cell) return null;
      return (cell.color === 'w' ? 'w' : 'b') + cell.type.toUpperCase();
    }));
  });
  const [selected, setSelected] = useState(null); // { r, c, square }
  const [legalTargets, setLegalTargets] = useState([]); // ['e4','e5'] etc.

  const algebraicFromRC = (r, c) => String.fromCharCode(97 + c) + (8 - r);
  const rcFromAlgebraic = sq => ({ r: 8 - parseInt(sq[1], 10), c: sq.charCodeAt(0) - 97 });

  const refreshBoard = () => {
    if (!game) return;
    setBoardData(game.board().map(rank => rank.map(cell => {
      if (!cell) return null;
      return (cell.color === 'w' ? 'w' : 'b') + cell.type.toUpperCase();
    })));
  };

  const onSquarePress = useCallback((r, c) => {
    if (!game) return;
    const square = algebraicFromRC(r, c);
    const piece = game.get(square);

    // If selecting same square -> deselect
    if (selected && selected.square === square) {
      setSelected(null);
      setLegalTargets([]);
      return;
    }

    // If there is a selection and this is a legal target -> move
    if (selected && legalTargets.includes(square)) {
      try {
        game.move({ from: selected.square, to: square, promotion: 'q' });
      } catch (e) { /* invalid move ignore */ }
      setSelected(null);
      setLegalTargets([]);
      refreshBoard();
      return;
    }

    // Otherwise attempt new selection (respect turn)
    if (piece && piece.color === game.turn()) {
      const moves = game.moves({ square, verbose: true });
      setSelected({ r, c, square });
      setLegalTargets(moves.map(m => m.to));
    } else {
      setSelected(null);
      setLegalTargets([]);
    }
  }, [game, selected, legalTargets]);

  // Reload board when incoming fen prop changes
  useEffect(() => {
    if (!game) return;
    if (fen === 'start') {
      try { game.reset(); } catch (e) { /* ignore */ }
    } else {
      try { game.load(fen); } catch (e) { /* ignore invalid fen */ }
    }
    setSelected(null);
    setLegalTargets([]);
    refreshBoard();
  }, [fen, game]);

  const renderSquareContent = (sq, r, c) => {
    const squareAlg = algebraicFromRC(r, c);
    const isSelected = selected && selected.square === squareAlg;
    const isLegal = legalTargets.includes(squareAlg);
    const iconSize = squareSize * 0.70;
    return (
      <>
        {sq ? (
          <FontAwesome5
            name={iconNameFromType[sq[1].toLowerCase()]}
            size={iconSize}
            color={sq[0] === 'w' ? pieceColorWhite : pieceColorBlack}
            solid
            style={{
              textShadowColor: '#000000ff', 
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}
          />
        ) : null}
        {isLegal && (
          <View style={{ position: 'absolute', width: squareSize * 0.3, height: squareSize * 0.3, borderRadius: 999, backgroundColor: moveDotColor, opacity: 0.5 }} />
        )}
        {isSelected && (
          <View style={{ position: 'absolute', inset: 0, borderWidth: 2, borderColor: highlightColor, borderRadius: 4 }} />
        )}
      </>
    );
  };

  return (
    <View style={{ width: size, height: size, borderRadius, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border }}>
      {boardData.map((rank, r) => (
        <View key={`r-${r}`} style={{ flexDirection: 'row' }}>
          {rank.map((sq, c) => {
            const isDark = (r + c) % 2 === 1;
            const bg = isDark ? dark : light;
            return (
              <Pressable
                key={`sq-${r}-${c}`}
                onPress={() => onSquarePress(r, c)}
                style={{ width: squareSize, height: squareSize, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}
              >
                {renderSquareContent(sq, r, c)}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
