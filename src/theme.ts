/*
 * theme.ts
 *
 * Copyright (C) 2022 by Posit Software, PBC
 *
 * Unless you have received this program directly from Posit Software pursuant
 * to the terms of a commercial license agreement with Posit Software, then
 * this program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */


import { defaultTheme } from "editor";
import { defaultPrefs } from "editor-types";
import { EditorUIStore, isSolarizedThemeActive, readPrefsApi } from "editor-ui";
import { setDarkThemeActive } from "ui-widgets";


export function editorThemeFromStore(store: EditorUIStore, darkMode?: boolean) {
  const prefs = readPrefsApi(store);
  const theme = editorThemeFromVSCode(prefs.fontFamily, prefs.fontSize, darkMode);
  return theme;
}

export function editorThemeFromVSCode(fontFamily?: string, fontSizePx?: number, initialDarkMode?: boolean) {

  // start with default
  const theme = defaultTheme();

  // get vscode theme context
  const bodyCls = document.body.classList;
  const hcLight = bodyCls.contains('vscode-high-contrast-light');
  const hcDark = bodyCls.contains('vscode-high-contrast') && !hcLight;
  theme.darkMode = initialDarkMode ?? (bodyCls.contains('vscode-dark') || hcDark);
  setDarkThemeActive(theme.darkMode);
  theme.highContrast = hcLight || hcDark;
  theme.solarizedMode = isSolarizedThemeActive();

  // clean helper for direct variable extraction
  const getVar = (name: string, fallback: string) => {
    const val = document.documentElement.style.getPropertyValue(name);
    return (val && val.trim()) ? val.trim() : fallback;
  };

  // set properties based on mode
  if (theme.darkMode) {
    theme.backgroundColor = getVar("--vscode-editor-background", "#1f1f1f");
    theme.textColor = getVar("--vscode-editor-foreground", "#ffffff");
    theme.metadataBackgroundColor = theme.backgroundColor;
    theme.chunkBackgroundColor = getVar("--vscode-notebook-cellEditorBackground", "#252526");
    theme.divBackgroundColor = theme.chunkBackgroundColor;
    theme.spanBackgroundColor = theme.chunkBackgroundColor;
    theme.selectionColor = getVar("--vscode-editor-selectionBackground", "#264f78");
    theme.cursorColor = getVar("--vscode-editorCursor-foreground", "#aeafad");
    theme.blockBorderColor = "#333333";
    theme.paneBorderColor = getVar("--vscode-commandCenter-border", "#333333");
    
    // code palette
    theme.code.keywordColor = getVar("--vscode-syntax-keyword", "#569cd6");
    theme.code.atomColor = getVar("--vscode-syntax-atom", "#b5cea8");
    theme.code.numberColor = getVar("--vscode-syntax-number", "#b5cea8");
    theme.code.stringColor = getVar("--vscode-syntax-string", "#ce9178");
    theme.code.commentColor = getVar("--vscode-syntax-comment", "#6a9955");
  } else {
    theme.backgroundColor = getVar("--vscode-editor-background", theme.backgroundColor);
    theme.textColor = getVar("--vscode-editor-foreground", theme.textColor);
  }

  // font
  theme.fixedWidthFont = getVar("--vscode-editor-font-family", "Consolas, monospace");
  theme.proportionalFont = fontFamily || defaultPrefs().fontFamily;

  return theme;
}