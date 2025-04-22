import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const customTheme = {
  dark: false,
  colors: {
    background: "#F0F0F0",
    primary: "#D5DBFF",
    "primary-light-1": "#0085FC",
    secondary: "#33A64C",
    "secondary-light-1": "#F0B441",
    "dark-background": "#6C767D",
    "light-background": "#B4B3CA",
  },
  variables: {
    "theme-on-background": "#3c4b64",
    "theme-on-surface": "#3c4b64",
    "high-emphasis-opacity": "1",
    "border-opacity": "1",
  },
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "customTheme",
      themes: {
        customTheme,
      },
    },
  });
  app.vueApp.use(vuetify);
});
