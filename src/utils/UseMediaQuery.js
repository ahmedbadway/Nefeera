import { useEffect, useState } from "react";

/**
 * Subscribe to a CSS media query from React.
 * Used to pick the portrait hero video on phones and the landscape one above
 * 768px, and to gate hover-only behaviour on touch devices.
 *
 * @param {string} query e.g. "(max-width: 767px)"
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const list = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);

    setMatches(list.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export default useMediaQuery;
