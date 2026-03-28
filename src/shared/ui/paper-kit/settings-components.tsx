import React from "react";
import { StyleSheet, View } from "react-native";
import { RadioButton, Switch } from "react-native-paper";
import Animated from "react-native-reanimated";
import { usePressAnimation } from "shared/lib/animations";
import { useThemeTokens } from "shared/lib/theme";

import { Text, Touchable } from "./index";

// Анимированный переключатель
interface AnimatedSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  description?: string;
}

export const SettingSwitch: React.FC<AnimatedSwitchProps> = ({
  value,
  onValueChange,
  label,
  description,
}) => {
  const { colors } = useThemeTokens();
  const { animStyle: animatedStyle, trigger } = usePressAnimation();

  const handlePress = () => {
    trigger();
    onValueChange(!value);
  };

  return (
    <Touchable onPress={handlePress}>
      <View style={styles.settingContainer}>
        <View style={styles.settingText}>
          <Text
            variant="body"
            style={[styles.settingLabel, { color: colors.text }]}>
            {label}
          </Text>
          {description && (
            <Text
              variant="caption"
              style={[styles.settingDescription, { color: colors.placeholder }]}>
              {description}
            </Text>
          )}
        </View>
        <Animated.View style={animatedStyle}>
          <Switch
            value={value}
            onValueChange={onValueChange}
            color={colors.primary}
          />
        </Animated.View>
      </View>
    </Touchable>
  );
};

// Настройка с выбором из нескольких вариантов
interface SettingRadioProps {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  options: { label: string; value: string; description?: string }[];
}

export const SettingRadio: React.FC<SettingRadioProps> = ({
  value,
  onValueChange,
  label,
  options,
}) => {
  const { colors } = useThemeTokens();

  return (
    <View style={styles.radioContainer}>
      <Text
        variant="body"
        style={[styles.radioLabel, { color: colors.text }]}>
        {label}
      </Text>
      <RadioButton.Group
        onValueChange={onValueChange}
        value={value}>
        {options.map((option, index) => (
          <Touchable
            key={option.value}
            onPress={() => onValueChange(option.value)}
            style={[
              styles.radioOption,
              index !== options.length - 1 && styles.radioDivider,
              index !== options.length - 1 && { borderBottomColor: colors.disabled },
            ]}>
            <View style={styles.radioContent}>
              <View>
                <Text
                  variant="body"
                  style={{ color: colors.text }}>
                  {option.label}
                </Text>
                {option.description && (
                  <Text
                    variant="caption"
                    style={[styles.settingDescription, { color: colors.placeholder }]}>
                    {option.description}
                  </Text>
                )}
              </View>
              <RadioButton.Android
                value={option.value}
                color={colors.primary}
                uncheckedColor={colors.placeholder}
              />
            </View>
          </Touchable>
        ))}
      </RadioButton.Group>
    </View>
  );
};

// Настройка с действием (переход на другой экран)
interface SettingActionProps {
  label: string;
  value?: string;
  description?: string;
  onPress: () => void;
  icon?: string;
  showChevron?: boolean;
}

export const SettingAction: React.FC<SettingActionProps> = ({
  label,
  value,
  description,
  onPress,
  icon,
  showChevron = true,
}) => {
  const { colors } = useThemeTokens();
  const { animStyle: animatedStyle, trigger } = usePressAnimation(0.98);

  const handlePress = () => {
    trigger();
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Touchable onPress={handlePress}>
        <View style={styles.actionContainer}>
          {icon && (
            <View style={[styles.actionIcon, { backgroundColor: colors.primary + "20" }]}>
              <Text style={[styles.actionIconText, { color: colors.primary }]}>{icon}</Text>
            </View>
          )}
          <View style={styles.actionText}>
            <Text
              variant="body"
              style={[styles.actionLabel, { color: colors.text }]}>
              {label}
            </Text>
            {description && (
              <Text
                variant="caption"
                style={[styles.actionDescription, { color: colors.placeholder }]}>
                {description}
              </Text>
            )}
          </View>
          <View style={styles.actionValue}>
            {value && (
              <Text
                variant="caption"
                style={[styles.actionValueText, { color: colors.placeholder }]}>
                {value}
              </Text>
            )}
            {showChevron && <Text style={[styles.chevron, { color: colors.placeholder }]}>›</Text>}
          </View>
        </View>
      </Touchable>
    </Animated.View>
  );
};

// Секция настроек
interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children, icon }) => {
  const { colors } = useThemeTokens();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon && <Text style={[styles.sectionIcon, { color: colors.primary }]}>{icon}</Text>}
        <Text
          variant="title"
          style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>
      </View>
      <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  settingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    marginTop: 2,
    lineHeight: 16,
  },
  radioContainer: {
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  radioOption: {
    paddingVertical: 12,
  },
  radioDivider: {
    borderBottomWidth: 1,
  },
  radioContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionIconText: {
    fontSize: 16,
  },
  actionText: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  actionDescription: {
    marginTop: 2,
    lineHeight: 16,
  },
  actionValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionValueText: {
    marginRight: 8,
  },
  chevron: {
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  sectionContent: {
    borderRadius: 12,
    overflow: "hidden",
    paddingHorizontal: 16,
  },
});
