import { storageManager } from "@/composables/storage.js";
import { ref, onMounted, watchEffect } from "vue";

export function getTheme() {
  const theme = ref("new");
  const { storage } = storageManager();

  const handleThemeChange = () => {
    const oldThemeInput = document.querySelector("#theme-old");
    const newThemeInput = document.querySelector("#theme-new");
    if (oldThemeInput.checked) {
      theme.value = "old";
    } else if (newThemeInput.checked) {
      theme.value = "new";
    }
    console.log(document.documentElement);

    storage.storeData("theme", theme.value); //don't showtoast as weather data is avaliable now
  };

  const themeOnLoad = () => {
    if (storage.doesDataExist("theme")) {
      theme.value = storage.getData("theme");
    } else {
      storage.storeData("theme", theme.value); //don't showtoast as weather data is avaliable now
    }
    const oldThemeInput = document.querySelector("#theme-old");
    const newThemeInput = document.querySelector("#theme-new");

    if (theme.value == "old") {
      oldThemeInput.checked = true;
      newThemeInput.checked = false;
    } else if (theme.value == "new") {
      newThemeInput.checked = true;
      oldThemeInput.checked = false;
    }
  };

  const setTheme = (selectedTheme) => {
    theme.value = selectedTheme;

    const oldThemeInput = document.querySelector("#theme-old");
    const newThemeInput = document.querySelector("#theme-new");

    if (theme.value == "old") {
      oldThemeInput.checked = true;
      newThemeInput.checked = false;
    } else if (theme.value == "new") {
      newThemeInput.checked = true;
      oldThemeInput.checked = false;
    }
  }

  onMounted(() => {
    themeOnLoad();

    watchEffect(() => {
      const oldThemeInput = document.querySelector("#theme-old");
      const newThemeInput = document.querySelector("#theme-new");
      oldThemeInput.addEventListener("change", handleThemeChange);
      newThemeInput.addEventListener("change", handleThemeChange);
      return () => {
        oldThemeInput.removeEventListener("change", handleThemeChange);
        newThemeInput.removeEventListener("change", handleThemeChange);
      };
    });
  });

  return {
    theme,
    setTheme,
  };
}
