"use client";

import { useEffect } from "react";
import { translate } from "@/lib/i18n/dictionary";
import { initLang, useLang } from "@/lib/i18n/store";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE"]);
const ATTRS = ["aria-label", "placeholder", "alt", "title"];

// Texto original (español) y última traducción escrita por nosotros, para poder restaurar y no entrar en bucles.
const original = new WeakMap<Text, string>();
const written = new WeakMap<Text, string>();
const attrOriginal = new WeakMap<Element, Map<string, string>>();
const attrWritten = new WeakMap<Element, Map<string, string>>();

function skipped(el: Element | null): boolean {
  for (let node = el; node; node = node.parentElement) {
    if (SKIP_TAGS.has(node.tagName) || node.hasAttribute("data-no-translate")) return true;
  }
  return false;
}

function translateText(node: Text) {
  const value = node.nodeValue ?? "";
  if (written.get(node) === value) return;
  if (skipped(node.parentElement)) return;
  const next = translate(value);
  original.set(node, value);
  if (next !== value) {
    written.set(node, next);
    node.nodeValue = next;
  } else {
    written.delete(node);
  }
}

function translateAttrs(el: Element) {
  if (skipped(el)) return;
  for (const attr of ATTRS) {
    const value = el.getAttribute(attr);
    if (value === null) continue;
    const mine = attrWritten.get(el)?.get(attr);
    if (mine === value) continue;
    const next = translate(value);
    if (!attrOriginal.has(el)) attrOriginal.set(el, new Map());
    attrOriginal.get(el)!.set(attr, value);
    if (next !== value) {
      if (!attrWritten.has(el)) attrWritten.set(el, new Map());
      attrWritten.get(el)!.set(attr, next);
      el.setAttribute(attr, next);
    }
  }
}

function walk(root: Node, visit: (node: Text) => void, visitEl: (el: Element) => void) {
  if (root.nodeType === Node.TEXT_NODE) return visit(root as Text);
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as Element;
  if (SKIP_TAGS.has(el.tagName)) return;
  visitEl(el);
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeType === Node.TEXT_NODE) visit(n as Text);
    else visitEl(n as Element);
  }
}

function restore(root: Node) {
  walk(
    root,
    (node) => {
      const mine = written.get(node);
      const orig = original.get(node);
      if (mine !== undefined && orig !== undefined && node.nodeValue === mine) node.nodeValue = orig;
      written.delete(node);
    },
    (el) => {
      const mine = attrWritten.get(el);
      const orig = attrOriginal.get(el);
      if (!mine || !orig) return;
      for (const [attr, text] of mine) {
        if (el.getAttribute(attr) === text && orig.has(attr)) el.setAttribute(attr, orig.get(attr)!);
      }
      attrWritten.delete(el);
    },
  );
}

/** Traduce el sitio público al inglés recorriendo el DOM y observando los cambios (navegación, formularios, etc.). */
export function Translator() {
  const lang = useLang();

  useEffect(() => {
    initLang();
  }, []);

  useEffect(() => {
    const root = document.body;
    if (lang !== "en") {
      restore(root);
      return;
    }

    walk(root, translateText, translateAttrs);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") translateText(record.target as Text);
        else if (record.type === "attributes") translateAttrs(record.target as Element);
        else record.addedNodes.forEach((added) => walk(added, translateText, translateAttrs));
      }
    });
    observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    return () => observer.disconnect();
  }, [lang]);

  return null;
}
