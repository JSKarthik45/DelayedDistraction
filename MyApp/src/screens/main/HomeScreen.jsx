import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ChessBoard from '../../components/ChessBoard';
import { lightTheme } from '../../theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ChessBoard
        fen="rn1qkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2"
        size={Dimensions.get('window').width}
        borderRadius={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0, paddingVertical: 0, backgroundColor: lightTheme.colors.background },
  title: { fontSize: 24, fontWeight: '600' },
  subtitle: { marginTop: 8 },
  boardWrap: { },
});
