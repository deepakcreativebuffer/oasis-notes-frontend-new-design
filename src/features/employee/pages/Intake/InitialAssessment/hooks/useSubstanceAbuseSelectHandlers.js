/** @format */

import { useMemo } from "react";
import { SUBSTANCE_ABUSE_FIXED_ROWS } from "../config/substanceAbuseConfig";
import {
  getSubstanceSelectPropNames,
  SUBSTANCE_SELECT_FIELD_TYPES,
} from "../config/substanceAbuseSelectPropNames";
import {
  SUBSTANCE_FIELD_OPTIONS,
  SUBSTANCE_FREQUENCY_OPTIONS,
  SUBSTANCE_LAST_USE_OPTIONS,
  SUBSTANCE_LENGTH_OF_SOBRIETY_OPTIONS,
} from "../config/substanceAbuseSelectOptions";
import { createSingleSelectCreatableHandlers } from "../utils/creatableSelectHandlers";

export function useSubstanceAbuseSelectHandlers(legacy) {
  return useMemo(() => {
    const handlers = {};

    const bindOther = (optionsKey, handleKey, handlerKey, options, setter) => {
      if (typeof setter !== "function") return;
      const { handleKey: onKey, handler } = createSingleSelectCreatableHandlers(
        options,
        setter,
      );
      handlers[optionsKey] = options;
      handlers[handleKey] = onKey;
      handlers[handlerKey] = handler;
    };

    bindOther(
      "optionotherLastUse",
      "handleKeyotherLastUse",
      "handleotherLastUse",
      SUBSTANCE_LAST_USE_OPTIONS,
      legacy.setOtherLastUse,
    );
    bindOther(
      "optionotherFrequancy",
      "handleKeyotherFrequancy",
      "handleotherFrequancy",
      SUBSTANCE_FREQUENCY_OPTIONS,
      legacy.setOtherFrequancy,
    );
    bindOther(
      "optionOtherlengthOfSobrifty",
      "handleKeyOtherlengthOfSobrifty",
      "handleOtherlengthOfSobrifty",
      SUBSTANCE_LENGTH_OF_SOBRIETY_OPTIONS,
      legacy.setOtherLengthOfSobirty,
    );

    SUBSTANCE_ABUSE_FIXED_ROWS.forEach((config, index) => {
      for (const field of SUBSTANCE_SELECT_FIELD_TYPES) {
        const names = getSubstanceSelectPropNames(config.substanceKey, field);
        const setter = legacy[names.setter];
        if (typeof setter !== "function") continue;

        const optionList = SUBSTANCE_FIELD_OPTIONS[field];
        const { handleKey, handler } = createSingleSelectCreatableHandlers(
          optionList,
          setter,
        );
        handlers[names.options] = optionList;
        handlers[names.handleKey] = handleKey;
        handlers[names.handler] = handler;
      }
    });

    return handlers;
  }, [legacy]);
}
