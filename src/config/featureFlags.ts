// Feature flags para habilitar/ocultar secciones sin borrar código.
// Ajusta true/false según lo que quieras mostrar.
export const featureFlags = {
  showAchievement: false,
  showDailySummary: false,
  showNutritionalProgress: false,
  showTab2Medals: false,
  showTab3History: false,
  showTab4Profile: true,
  showAddToMealButton: false,
  showMealImageUpload: true,
  showMealManualInput: false,
  showMealSubmitButton: true,
  showGenerateRecipeCTA: true,
};

export const isFeatureEnabled = (flag: keyof typeof featureFlags) =>
  Boolean(featureFlags[flag]);
