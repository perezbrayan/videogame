/**
 * Formatea un número como precio en formato colombiano (COP)
 * @param {number} amount - Cantidad a formatear
 * @returns {string} - Precio formateado (ej: $ 123.456)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
