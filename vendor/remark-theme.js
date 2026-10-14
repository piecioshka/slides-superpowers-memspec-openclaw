/*!
 * remarkjs-theme v0.1.0
 * Light and dark theme for remark.js slides: follows the system, toggles
 * with a key, remembers the choice.
 * https://github.com/piecioshka/remarkjs-theme
 * MIT License (https://piecioshka.mit-license.org)
 */
(function (root) {
  "use strict";

  const DEFAULTS = {
    key: "d",
    attribute: "data-theme",
    storageKey: "remark-theme",
    helpText: "Toggle light / dark theme",
  };

  const THEMES = ["light", "dark"];
  const EVENT = "remark-theme-change";

  function insertHelpRow(table, key, text) {
    const row = document.createElement("tr");
    const keyCell = document.createElement("td");
    const keyLabel = document.createElement("span");
    const textCell = document.createElement("td");
    row.className = "remark-theme-help";
    keyLabel.className = "key";
    keyLabel.textContent = key;
    keyCell.append(keyLabel);
    textCell.textContent = text;
    row.append(keyCell, textCell);
    // The last row is "Toggle this help", keep it at the bottom.
    const rows = table.querySelectorAll("tr");
    const lastRow = rows[rows.length - 1];
    lastRow.parentNode.insertBefore(row, lastRow);
  }

  /**
   * Adds the shortcut to remark's help screen (`?` or `h`). With `sourceUrl`
   * remark loads the slides asynchronously and builds the help screen later,
   * so we wait for it.
   */
  function addHelpRow(key, text) {
    function tryInsert() {
      const table = document.querySelector(".remark-help-content table");
      if (!table) return false;
      if (!table.querySelector(".remark-theme-help")) {
        insertHelpRow(table, key, text);
      }
      return true;
    }
    if (tryInsert()) return;
    const observer = new MutationObserver(() => {
      if (tryInsert()) observer.disconnect();
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function remarkTheme(userOptions) {
    const options = Object.assign({}, DEFAULTS, userOptions);
    const html = document.documentElement;
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    /** Theme picked by the user, or null when they never picked one. */
    function stored() {
      try {
        const value = localStorage.getItem(options.storageKey);
        return THEMES.includes(value) ? value : null;
      } catch {
        return null;
      }
    }

    function store(theme) {
      try {
        if (theme === null) localStorage.removeItem(options.storageKey);
        else localStorage.setItem(options.storageKey, theme);
      } catch {
        // Private mode or storage disabled: the theme lasts until reload.
      }
    }

    function system() {
      return darkQuery.matches ? "dark" : "light";
    }

    function get() {
      return html.getAttribute(options.attribute) || stored() || system();
    }

    function apply(theme) {
      html.setAttribute(options.attribute, theme);
      html.dispatchEvent(new CustomEvent(EVENT, { detail: { theme } }));
    }

    /** Picks a theme and remembers it; the system setting stops mattering. */
    function set(theme) {
      if (!THEMES.includes(theme)) {
        throw new Error(`remarkTheme: unknown theme "${theme}"`);
      }
      store(theme);
      apply(theme);
    }

    function toggle() {
      set(get() === "dark" ? "light" : "dark");
    }

    /** Forgets the choice and follows the system again. */
    function reset() {
      store(null);
      apply(system());
    }

    function onKeydown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() !== options.key.toLowerCase()) return;
      event.stopPropagation();
      toggle();
    }

    // Apply right away, before remark renders, so the first paint is right.
    apply(stored() || system());
    addHelpRow(options.key, options.helpText);

    // Capture on `document` runs before remark's listeners on `window`.
    document.addEventListener("keydown", onKeydown, true);
    darkQuery.addEventListener("change", () => {
      if (!stored()) apply(system());
    });

    return { get, set, toggle, reset };
  }

  root.remarkTheme = remarkTheme;
})(window);
