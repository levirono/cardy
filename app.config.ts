export default defineAppConfig({
  ui: {
    primary: 'violet',
    gray: 'cool',
    icons: 'heroicons',
    tokens: {
      // Custom gradient tokens used across the app
      gradients: {
        brand: 'bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-500',
        surface: 'bg-gradient-to-br from-gray-50 to-sky-50 dark:from-gray-950 dark:to-slate-900',
        subtle: 'bg-gradient-to-tr from-emerald-100 via-indigo-100 to-rose-100 dark:from-slate-900 dark:via-gray-800 dark:to-indigo-900'
      },
      rings: {
        card: 'ring-1 ring-inset ring-gray-200/70 dark:ring-gray-800/70'
      }
    }
  }
}) 