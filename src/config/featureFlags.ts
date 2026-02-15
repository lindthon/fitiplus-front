// Feature flags para habilitar/ocultar secciones sin borrar código.
// Ajusta true/false según lo que quieras mostrar.
export const featureFlags = {
  showAchievement: false,
  showDailySummary: true,
  showNutritionalProgress: false,
  showTab2Medals: false,
  showTab3History: false,
  showTab4Profile: false,
  showAddToMealButton: false,
  showMealImageUpload: false,
  showMealManualInput: false,
  showMealSubmitButton: true,
};

export const isFeatureEnabled = (flag: keyof typeof featureFlags) =>
  Boolean(featureFlags[flag]);
