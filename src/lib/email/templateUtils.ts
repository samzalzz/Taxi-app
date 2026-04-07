export type TemplateVars = Record<string, string>;

/**
 * Remplace {{varName}} par les valeurs correspondantes du dictionnaire vars.
 * Les variables non trouvées restent inchangées.
 */
export function interpolateTemplate(template: string, vars: TemplateVars): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : match
  );
}
