import { ref, onMounted, watchEffect } from 'vue'

export function getTheme() {
  const theme = ref('old')

  const handleThemeChange = () => {
    const oldThemeInput = document.querySelector('#theme-old')
    const newThemeInput = document.querySelector('#theme-new')
    if (oldThemeInput.checked) {
      theme.value = 'old'
    } else if (newThemeInput.checked) {
      theme.value = 'new'
    }
  }

  onMounted(() => {
    handleThemeChange()


    watchEffect(() => {
      const oldThemeInput = document.querySelector('#theme-old')
      const newThemeInput = document.querySelector('#theme-new')
      oldThemeInput.addEventListener('change', handleThemeChange)
      newThemeInput.addEventListener('change', handleThemeChange)
      return () => {
        oldThemeInput.removeEventListener('change', handleThemeChange)
        newThemeInput.removeEventListener('change', handleThemeChange)
      }
    })
  })


  return {
    theme,
  }
}
