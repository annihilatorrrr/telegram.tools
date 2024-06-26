import { IS_BROWSER } from "$fresh/runtime.ts";
import { useComputed } from "@preact/signals";

import { Presence } from "../components/Presence.tsx";
import { storedBoolean } from "../lib/stored_signals.tsx";

const hide = storedBoolean(false, "hide-cookie-notice");

export function CookieNotice() {
  if (!IS_BROWSER) {
    return null;
  }
  return (
    <Presence present={useComputed(() => !hide.value)}>
      <div
        class={`bg-foreground-transparent fixed bottom-0 left-0 backdrop-blur-2xl w-full p-5 ${
          hide.value
            ? "animate-out-opacity pointer-events-none"
            : "animate-in-opacity pointer-events-auto"
        }`}
      >
        <div class="max-w-[900px] w-full mx-auto gap-5 text-sm flex flex-col justify-center sm:(flex-row items-center justify-between)">
          <div>
            We make use of cookies to collect anonymous usage statistics that
            help us improve the project.
          </div>
          <button
            onClick={() => hide.value = true}
            class="text-grammy self-end xl:self-auto"
          >
            OK
          </button>
        </div>
      </div>
    </Presence>
  );
}
