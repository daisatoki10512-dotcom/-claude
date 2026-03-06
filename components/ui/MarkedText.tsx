import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { MarkerHighlight } from '../../store/recordStore';

const MARKER_BG = '#B2F0E8';

export function buildSegments(text: string, highlights: MarkerHighlight[]) {
  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  const segs: { text: string; highlighted: boolean }[] = [];
  let pos = 0;
  for (const h of sorted) {
    const s = Math.max(h.start, pos);
    const e = h.end;
    if (s > pos) segs.push({ text: text.slice(pos, s), highlighted: false });
    if (e > s)   segs.push({ text: text.slice(s, e),   highlighted: true  });
    pos = Math.max(pos, e);
  }
  if (pos < text.length) segs.push({ text: text.slice(pos), highlighted: false });
  return segs;
}

type Props = {
  text: string;
  highlights: MarkerHighlight[];
  style?: TextStyle;
  numberOfLines?: number;
};

export default function MarkedText({ text, highlights, style, numberOfLines }: Props) {
  if (!highlights || highlights.length === 0) {
    return <Text style={style} numberOfLines={numberOfLines}>{text}</Text>;
  }
  const segs = buildSegments(text, highlights);
  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {segs.map((seg, i) =>
        seg.highlighted
          ? <Text key={i} style={styles.mark}>{seg.text}</Text>
          : <Text key={i}>{seg.text}</Text>
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  mark: { backgroundColor: MARKER_BG },
});
