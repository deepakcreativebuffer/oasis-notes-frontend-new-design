/** @format */

import { store } from "./store";
import { selectPrimarySignatureDraft } from "./signatureDraftSlice";

/** Read primary signature draft outside React (e.g. large form hooks). */
export function getPrimarySignatureDraft() {
  return selectPrimarySignatureDraft(store.getState());
}
