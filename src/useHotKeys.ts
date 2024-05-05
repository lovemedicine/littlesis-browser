// copied from https://gist.github.com/sarahdayan/47cb88b6a8163500967ffe4c85ad1622

import hotkeys, { HotkeysEvent } from 'hotkeys-js';
import { useEffect, useCallback } from 'preact/hooks';

/**
 * A Preact hook for triggering side-effects when pressing hotkeys.
 *
 * @param keys A comma-separated list of hotkeys to trigger the callback on.
 * @param callback A callback function to execute when keys are pressed.
 * @param dependencies A list of dependencies.
 */
function useHotkeys<Dependencies>(
  keys: string,
  callback: (event: KeyboardEvent, handler: HotkeysEvent) => void,
  dependencies: Dependencies[] = []
) {
  const memoizedCallback = useCallback(callback, dependencies);

  useEffect(() => {
    hotkeys.filter = () => true;
    hotkeys(keys, memoizedCallback);

    return () => hotkeys.unbind(keys);
  }, [keys, memoizedCallback]);
}

export default useHotkeys;
