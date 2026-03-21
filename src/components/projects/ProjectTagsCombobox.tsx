"use client";

import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import {
  Combobox as ComboboxRoot,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";

export type ProjectTagsComboboxProps = {
  id?: string;
  value: string[];
  onChange: (next: string[]) => void;
  options: readonly string[];
  placeholder?: string;
  /**
   * Set `true` inside Radix **modal** `Dialog` so the popup portals into the field
   * wrapper (inside the dialog) and receives pointer events.
   */
  inModalDialog?: boolean;
};

/**
 * Multi-select tags from the suggestion list (Base UI combobox + chips).
 */
export function ProjectTagsCombobox({
  id,
  value,
  onChange,
  options,
  placeholder = "Search tags…",
  inModalDialog = false,
}: ProjectTagsComboboxProps) {
  /**
   * Base UI measures `RefObject.current` in an effect that does not re-run when the
   * ref is assigned (no re-render), so the anchor can stay null → popup at (0,0).
   * Store the field wrapper in state via callback ref so positioning re-runs with a
   * real element — same stability as Radix Select’s trigger + popper.
   */
  const [fieldAnchor, setFieldAnchor] = React.useState<HTMLDivElement | null>(
    null,
  );

  const selectableItems = React.useMemo(
    () => options.filter((o) => !value.includes(o)),
    [options, value],
  );

  const filter = BaseCombobox.useFilter({ multiple: true, value });

  return (
    <div ref={setFieldAnchor} className="relative w-full">
      <ComboboxRoot
        id={id}
        multiple
        modal={false}
        value={value}
        onValueChange={(next) => {
          onChange(Array.isArray(next) ? next : []);
        }}
        items={selectableItems}
        filter={filter.contains}
      >
        <ComboboxChips className="w-full max-w-full rounded-md border border-neutral-200 bg-white px-3 py-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          {value.map((tag) => (
            <ComboboxChip key={tag}>{tag}</ComboboxChip>
          ))}
          <ComboboxChipsInput placeholder={placeholder} />
        </ComboboxChips>

        <ComboboxContent
          chipLayout
          sideOffset={4}
          align="start"
          anchor={fieldAnchor}
          portalContainer={
            inModalDialog && fieldAnchor ? fieldAnchor : undefined
          }
          collisionBoundary={
            inModalDialog || typeof document === "undefined"
              ? undefined
              : document.body
          }
          className="border border-neutral-200 bg-white font-din text-neutral-950 shadow-md ring-0 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
        >
          <ComboboxList>
            <ComboboxEmpty>No matching tags.</ComboboxEmpty>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxContent>
      </ComboboxRoot>
    </div>
  );
}
