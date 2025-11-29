import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { lightTheme } from '../theme';
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

const pieceUnicode = {
  p: { w: '\u2659', b: '\u265F' },
  r: { w: '\u2656', b: '\u265C' },
  n: { w: '\u2658', b: '\u265E' },
  b: { w: '\u2657', b: '\u265D' },
  q: { w: '\u2655', b: '\u265B' },
  k: { w: '\u2654', b: '\u265A' },
};

export default function ChessBoard({ fen = 'start', size = 320, borderRadius = 0 }) {
  const squareSize = size / 8;
  const dark = lightTheme.colors.primary;
  const light = lightTheme.colors.secondary;
  const pieceColor = lightTheme.colors.text;
  const highlightColor = lightTheme.colors.success || '#4caf50';
  const moveDotColor = lightTheme.colors.muted;

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

  const renderSquareContent = (sq, r, c) => {
    let glyph = '';
    if (sq) {
      const color = sq[0] === 'w' ? 'w' : 'b';
      const type = sq[1].toLowerCase();
      glyph = pieceUnicode[type][color];
    }
    const squareAlg = algebraicFromRC(r, c);
    const isSelected = selected && selected.square === squareAlg;
    const isLegal = legalTargets.includes(squareAlg);
    return (
      <>
        {glyph ? <Text style={{ fontSize: squareSize * 0.72, color: pieceColor, fontWeight: '600' }}>{glyph}</Text> : null}
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
    <View style={{ width: size, height: size, borderRadius, overflow: 'hidden', backgroundColor: lightTheme.colors.surface, borderWidth: 2, borderColor: lightTheme.colors.border }}>
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
