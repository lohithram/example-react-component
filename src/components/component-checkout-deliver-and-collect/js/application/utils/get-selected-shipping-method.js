/**
 * Look through the given array of HomeDeliveryShippingMethodData objects and
 * return the first one where .selected is truthy, or the first one if none are
 * selected.
 *
 * @param {HomeDeliveryShippingMethodData[]} shippingMethods
 * @return {HomeDeliveryShippingMethodData}
 */
export default function getSelectedShippingMethod(shippingMethods) {
  if (shippingMethods.length === 0) {
    return;
  }

  const selected = shippingMethods.find(x => x.selected);

  return selected || shippingMethods[0];
}
