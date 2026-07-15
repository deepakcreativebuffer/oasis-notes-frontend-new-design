/** @format */

import { useCallback, useMemo, useState } from "react";

function parseRegistryDefault(raw) {
  if (raw === '""') return "";
  if (raw === "false") return false;
  if (raw === "true") return true;
  if (raw === "null") return null;
  if (raw === "undefined") return undefined;
  return false;
}

export function createInitialValuesFromRegistry(registry) {
  return registry.reduce((acc, field) => {
    acc[field.key] = parseRegistryDefault(field.defaultValue);
    return acc;
  }, {});
}

/**
 * Consolidates many useState hooks into one object while exposing legacy flat
 * getters/setters so existing JSX keeps working during incremental migration.
 */
export function useLegacyObjectForm(registry, { mapFromApi } = {}) {
  const initialValues = useMemo(
    () => createInitialValuesFromRegistry(registry),
    [registry],
  );
  const [values, setValues] = useState(initialValues);

  const setField = useCallback((key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: typeof value === "function" ? value(prev[key]) : value,
    }));
  }, []);

  const legacy = useMemo(() => {
    const bindings = {};
    registry.forEach(({ key, setter }) => {
      bindings[key] = values[key];
      bindings[setter] = (value) => setField(key, value);
    });
    return bindings;
  }, [registry, values, setField]);

  const loadFromApi = useCallback(
    (apiData) => {
      if (mapFromApi) {
        setValues(mapFromApi(apiData));
      }
    },
    [mapFromApi],
  );

  const toSubmitSnapshot = useCallback(() => ({ ...values }), [values]);

  return {
    values,
    setValues,
    setField,
    legacy,
    loadFromApi,
    toSubmitSnapshot,
  };
}
