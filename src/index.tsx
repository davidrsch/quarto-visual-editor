/*
 * index.ts
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

console.error("[VE] index.tsx MODULE EVALUATING");
import React from "react";
import { createRoot } from 'react-dom/client';

import * as uuid from "uuid";


// @ts-ignore
import { addEditor, initEditorTranslations, initializeStore, setEditorTheme } from 'editor-ui';

import { App } from "./App";
import { visualEditorHostClient, visualEditorJsonRpcRequestTransport } from './sync';
import { editorThemeFromStore } from "./theme";

import "editor-ui/styles.ts";
import "./styles.scss"

async function runEditor() {
  try {
    console.log("[VE] Starting runEditor...");
    // init localization
    await initEditorTranslations();
    console.log("[VE] Translations initialized");

    // connection to host
    const hostTarget = {
      postMessage: (data: any) => {
        if (window.parent !== window) {
          window.parent.postMessage(data, "*");
        } else {
          window.postMessage(data, "*");
        }
      },
      onMessage: (handler: (data: unknown) => void) => {
        const listener = (event: MessageEvent) => handler(event.data);
        window.addEventListener('message', listener);
        return () => window.removeEventListener('message', listener);
      }
    };
    const request = visualEditorJsonRpcRequestTransport(hostTarget)
    const host = visualEditorHostClient(hostTarget, request);

    console.log("[VE] Requesting host context...");
    // get host context
    let context = await host.getHostContext();
    console.log("[VE] Host context received", context);

    // Guard: when running standalone (no Quartostone parent), the host context
    // may never arrive and `getHostContext` resolves with `undefined`. Provide a
    // safe default so React can still mount and the editor functions as-is.
    if (!context) {
      context = {
        documentPath: null,
        resourceDir: '/',
        projectDir: undefined,
        isWindowsDesktop: navigator.platform.toLowerCase().includes('win'),
        executableLanguages: [],
      } as any;

      // Also inject a default VS Code theme into the standalone HTML element 
      // so `theme.ts` doesn't crash on `editorFontSize.match()`
      const htmlStyle = document.documentElement.style;
      htmlStyle.setProperty('--vscode-editor-font-size', '13px');
      htmlStyle.setProperty('--vscode-editor-font-family', 'Consolas, monospace');
      htmlStyle.setProperty('--vscode-editor-background', '#ffffff');
      htmlStyle.setProperty('--vscode-editor-foreground', '#000000');
    }

    console.log("[VE] Initializing store...");
    // initialize store and read initial prefs
    const store = await initializeStore(request);
    console.log("[VE] Store initialized");

    // create editor id
    const editorId = uuid.v4();
    store.dispatch(addEditor(editorId));

    console.log("[VE] Mounting React app...");
    // render
    const root = createRoot(document.getElementById('root')!);
    // @ts-ignore: context.darkMode is added via our extended HostContext
    setEditorTheme(editorThemeFromStore(store, (context as any).darkMode));
    root.render(<App store={store} editorId={editorId} host={host} context={context} request={request} />);
  } catch (error) {
    console.error(error);
  }
}

runEditor();


