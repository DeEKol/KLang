import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useThemeTokens } from "entities/theme";

import { useGameTimer } from "../../_shared/hooks/useGameTimer";
import type { IGameResult } from "../../_shared/types";
import { useSequencesBuilder } from "../model/useSequencesBuilder";

import { Blank } from "./Blank";
import { OptionsRow } from "./OptionsRow";
import createStyles from "./SequencesBuilderUI.styles";
import { VictoryOverlay } from "./VictoryOverlay";

export const SequencesBuilderUI: React.FC<{
  playSuccessSound?: () => void;
  playFailSound?: () => void;
  onComplete?: (result: IGameResult) => void;
  onExit?: () => void;
}> = ({ playSuccessSound, playFailSound, onComplete }) => {
  const { colors } = useThemeTokens();
  const { t } = useTranslation("sequencesBuilder");
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    sentenceParts,
    blanks,
    filled,
    options,
    blankPositions,
    hints,
    victoryVisible,
    setVictoryVisible,
    correctCount,
    mistakeCount,
    getSetBlankRef,
    measureBlank,
    handleDrop,
    resetAll,
  } = useSequencesBuilder({ playSuccessSound, playFailSound });

  const { elapsedMs, pause } = useGameTimer();

  useEffect(() => {
    if (victoryVisible) {
      pause();
      onComplete?.({ score: 1, timeMs: elapsedMs, mistakes: mistakeCount });
    }
  }, [victoryVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>{t("title")}</Text>

          <View style={styles.sentenceWrap}>
            <View style={styles.sentenceRow}>
              {sentenceParts.map((part) => {
                const match = part.match(/__(\d+)__/);

                if (match) {
                  const id = Number(match[1]);

                  return (
                    <Blank
                      key={`blank-${id}`}
                      filled={filled[id]}
                      innerRef={getSetBlankRef(id)}
                      onLayout={() => requestAnimationFrame(() => measureBlank(id))}
                      hint={hints[id] ?? null}
                    />
                  );
                }

                return (
                  <Text
                    key={part}
                    style={styles.sentenceText}>
                    {part}
                  </Text>
                );
              })}
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.score}>
              {t("score", { correct: correctCount, total: blanks.length })}
            </Text>
            <Pressable
              onPress={resetAll}
              style={({ pressed }) => [styles.resetButton, pressed && styles.resetPressed]}>
              <Text style={styles.resetButtonText}>{t("reset")}</Text>
            </Pressable>
          </View>

          <View style={styles.optionsCard}>
            <Text style={styles.optionsTitle}>{t("optionsTitle")}</Text>
            <OptionsRow
              options={options}
              onDrop={handleDrop}
              blanks={blanks}
              blankPositions={blankPositions}
            />
            {options.length === 0 && <Text style={styles.hintSmall}>{t("allOptionsUsed")}</Text>}
          </View>
        </View>
      </ScrollView>

      <VictoryOverlay
        visible={victoryVisible}
        onClose={() => setVictoryVisible(false)}
      />
    </>
  );
};
