// copied from https://gist.github.com/sarahdayan/47cb88b6a8163500967ffe4c85ad1622

import hotkeys, { HotkeysEvent } from 'hotkeys-js';
import { useEffect, useCallback } from 'preact/hooks';

/**
 * A Preact hook for triggering side-effects when pressing hotkeys.
 *
 * @param keys A comma-separated list of hotkeys to trigger the callback on.
 * @param callback A callback function to execute when keys are pressed.
 * @param memoize Optional flag to memoize callback.
 * @param dependencies A list of dependencies.
 */
function useHotkeys<Dependencies>(
  keys: string,
  callback: (event: KeyboardEvent, handler: HotkeysEvent) => void,
  memoize: boolean = false,
  dependencies: Dependencies[] = []
) {
  const callbackToExecute = memoize
    ? useCallback(callback, dependencies)
    : callback;

  useEffect(() => {
    hotkeys.filter = () => true;
    hotkeys(keys, callbackToExecute);

    return () => hotkeys.unbind(keys);
  }, [keys, callbackToExecute]);
}

export default useHotkeys;
