import { readable } from "svelte/store";

const webChannelId = "pioneer";

export const firefox = readable({}, async (set) => {
  window.addEventListener("WebChannelMessageToContent", handleEvent);
  dispatchFxEvent({ enrolled: true });

  let enrolled;
  let activeStudies;
  let availableStudies;

  function handleEvent(e) {
    const key = Object.keys(e.detail.message.data)[0];
    const value = e.detail.message.data[key];

    switch (key) {
      case "activeStudies":
        activeStudies = value;

        const result = {
          enrolled: enrolled,
          activeStudies: activeStudies,
          availableStudies: availableStudies,
        };
        set(result);
        return;

        break;
      case "availableStudies":
        availableStudies = value;
        dispatchFxEvent({ activeStudies: true });
        break;
      case "enrolled":
        enrolled = value;
        dispatchFxEvent({ availableStudies: true });
        break;
      case "enroll":
        if (value === true) {
          dispatchFxEvent({ enrolled: true });
        }
        break;
      case "unenroll":
        if (value === true) {
          dispatchFxEvent({ enrolled: true });
        }
        break;
      case "installStudy":
        dispatchFxEvent({ activeStudies: true });
        break;
      case "uninstallStudy":
        dispatchFxEvent({ activeStudies: true });
        break;
      default:
        break;
    }
  }
});

function dispatchFxEvent(message) {
  window.dispatchEvent(
    new window.CustomEvent("WebChannelMessageToChrome", {
      detail: JSON.stringify({
        id: webChannelId,
        message: message,
      }),
    })
  );
}