import { useSignal, useSignalEffect } from "@preact/signals";

import { cn } from "../lib/cn.ts";

import { Check } from "./icons/Check.tsx";
import { Presence } from "./Presence.tsx";

export function Select<T extends string>(
  { value, values, onChange, nameMap }: {
    value: T;
    values: T[];
    onChange: (value: T) => void;
    nameMap?: Record<T, string>;
  },
) {
  const focused = useSignal(false);
  const active = useSignal<T | null>(null);

  useSignalEffect(() => void (!focused.value && (active.value = null)));

  return (
    <div
      class="relative w-full rounded-lg h-fit-content"
      onBlurCapture={(e) => {
        if (e.relatedTarget instanceof HTMLButtonElement) {
          const value = e.relatedTarget.getAttribute("data-value");
          if (value) {
            return;
          }
        }
        focused.value = false;
      }}
      onClick={(e) => {
        const value = e.target instanceof HTMLElement
          ? e.target.getAttribute("data-value")
          : null;
        if (value) {
          onChange(value as T);
          focused.value = false;
        } else if (
          e.target == e.currentTarget ||
          (e.target instanceof HTMLElement &&
            e.target.getAttribute("data-x") != null)
        ) {
          focused.value = !focused.value;
        }
      }}
      onKeyPress={(e) => {
        if (e.key == "Enter" && focused.value) {
          active.value != null && onChange(active.value);
          focused.value = false;
        }
      }}
      onKeyDown={(e) => {
        if (!focused.value) return;
        switch (e.key) {
          case "ArrowUp": {
            const prev =
              values.indexOf(active.value != null ? active.value : value) - 1;
            if (prev < 0) {
              active.value = values[values.length - 1];
            } else {
              active.value = values[prev];
            }
            break;
          }
          case "ArrowDown": {
            const next =
              values.indexOf(active.value != null ? active.value : value) + 1;
            if (next <= values.length - 1) {
              active.value = values[next];
            } else {
              active.value = values[0];
            }
            break;
          }
          case "Escape":
            focused.value && (focused.value = false);
        }
      }}
      tabIndex={0}
    >
      <div
        class={`bg-foreground-transparent placeholder:(text-foreground opacity-[.55]) rounded-lg w-full px-3 py-1.5 focus:(outline-none) duration-100 ${
          focused.value ? "rounded-b-none" : "rounded-b-lg"
        }`}
        data-x
      >
        <div data-x>{nameMap?.[value] ?? value}</div>
        <div class="absolute h-full top-0 right-1 flex items-center" data-x>
          <Icon />
        </div>
        <div
          data-x
          class="w-full h-full absolute bg-transparent hidden group-focus:block group-hover:cursor-pointer"
        />
        <div
          data-x
          class="w-full h-full absolute bg-transparent hidden group-focus:block"
        />
      </div>
      <Presence present={focused}>
        <div
          class={`bg-background z-[100] absolute top-[calc(100%+0rem)] w-full border border-border rounded-lg rounded-t-none px-1 py-1.5 shadow-slct ${
            focused.value
              ? "animate-in-select pointer-events-auto"
              : "animate-out-select pointer-events-none"
          }`}
        >
          {values.map((v) => (
            <button
              type="button"
              tabIndex={-1}
              class={cn(
                "px-3 py-1.5 w-full rounded-lg focus:(bg-border outline-none) cursor-default text-left border-none flex items-center justify-between duration-75 transition-opacity",
                active.value == v && "bg-border",
              )}
              onMouseEnter={(e) => {
                active.value = e.currentTarget.getAttribute("data-value") as
                  | T
                  | null;
              }}
              data-value={v}
            >
              <span data-value={v}>{nameMap?.[v] ?? v}</span>
              {value == v && <Check />}
            </button>
          ))}
        </div>
      </Presence>
    </div>
  );
}

function Icon() {
  return (
    <svg
      data-x
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="pointer-events-none h-4 w-4 opacity-50"
      aria-hidden="true"
    >
      <path
        d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      >
      </path>
    </svg>
  );
}
