import { escape } from "lodash-es";
import { TabInfo } from "@/types";
import { Worksheet } from "@/types/proto/v1/worksheet_service";
import { extractWorksheetUID, getHighlightHTMLByRegExp } from "@/utils";

export type TabItem = {
  type: "TAB";
  target: TabInfo;
};
export type SheetItem = {
  type: "SHEET";
  target: Worksheet;
};
export type MergedItem = TabItem | SheetItem;
export const isTabItem = (item: MergedItem): item is TabItem => {
  return item.type === "TAB";
};
export const isSheetItem = (item: MergedItem): item is SheetItem => {
  return item.type === "SHEET";
};

export const domIDForItem = (item: MergedItem) => {
  if (isTabItem(item)) {
    // tab
    return `bb-sheet-list-tab-${item.target.id}`;
  }
  // sheet
  return `bb-sheet-list-sheet-${extractWorksheetUID(item.target.name)}`;
};

export const titleHTML = (item: MergedItem, keyword: string) => {
  const kw = keyword.toLowerCase().trim();

  const title = isTabItem(item) ? item.target.name : item.target.title;

  if (!kw) {
    return escape(title);
  }

  return getHighlightHTMLByRegExp(
    escape(title),
    escape(kw),
    false /* !caseSensitive */
  );
};

export type DropdownState = {
  item: MergedItem;
  x: number;
  y: number;
};
