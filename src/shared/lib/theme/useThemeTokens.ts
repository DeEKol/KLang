// THEME-L2 (partial): Hook moved to entities/theme/model/hooks/useThemeTokens.ts.
// This shim re-exports it so shared/ui components keep working during the migration.
// TODO: Once shared/ui components (ButtonUI, FlipCardUI, RoadMapButtonUI, paper-kit)
//       receive colors via props instead of calling the hook, delete this file
//       and remove the re-export from shared/lib/theme/index.ts.
// eslint-disable-next-line no-restricted-imports
export { useThemeTokens } from "entities/theme";
