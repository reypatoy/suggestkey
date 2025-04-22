// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  ssr: false,
  css: ["~/assets/sass/base.scss", "~/assets/sass/cmn.scss"],
  build: { transpile: ["vuetify", "vue-chartjs"] },
  app: {
    head: {
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@100..900&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
        },
      ],
      script: [
        {
          src: "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js",
        },
        { src: "https://www.google.com/jsapi" },
        { src: "https://www.gstatic.com/charts/loader.js" },
        { src: "https://cdn.jsdelivr.net/npm/chart.js" },
      ],
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      baseApi: process.env.API_BASE_URL,
    },
  },
});
