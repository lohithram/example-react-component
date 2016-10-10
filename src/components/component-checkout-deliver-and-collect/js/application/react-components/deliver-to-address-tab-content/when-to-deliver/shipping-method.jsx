import React from 'react';
import {
  ClassNameUtil,
  Price,
  RadioOption,
  Text
} from '../../../class-library';

/**
 * When rendering, this function is only used for the Collapsible.Header and
 * won't contain any of the children - they have been moved to the
 * Collapsible.Body
 */
export default function ShippingMethod(props) {
  const { type, label, deliveryInfoDate, deliveryInfoCost, isActive } = props;

  return (
    <div className={ ClassNameUtil.getClassNames(['fbra_shippingMethod__header', 'fbra_test_shippingMethod__header']) }>
      <div className={ ClassNameUtil.getClassNames(['fbra_shippingMethod__type', 'fbra_test_shippingMethod__type']) }>
        {/* Wrap in a form to prevent radio button name conflicts */}
        <form className={ ClassNameUtil.getClassNames(['fbra_shippingMethod__form', 'fbra_test_shippingMethod__form'])}>
          <RadioOption
            name={`shippingMethod${type}`}
            className={ClassNameUtil.getClassNames(['fbra_shippingMethod__radio', 'fbra_test_shippingMethod__radio'])}
            checked={ isActive }
          >
            { label }
          </RadioOption>
        </form>
      </div>

      { deliveryInfoDate && (
        <Text className={ClassNameUtil.getClassNames(['fbra_shippingMethod__deliveryInfoDate', 'fbra_test_shippingMethod__deliveryInfoDate'])}>{ deliveryInfoDate }</Text>
      ) }
      <Text className={ClassNameUtil.getClassNames(['fbra_shippingMethod__deliveryInfoCost', 'fbra_test_shippingMethod__deliveryInfoCost'])}><Price { ...deliveryInfoCost } /></Text>
    </div>
  );
}

ShippingMethod.propTypes = {
  type: React.PropTypes.any,
  label: React.PropTypes.string.isRequired,
  deliveryInfoDate: React.PropTypes.string,
  deliveryInfoCost: Price.PropTypes.priceDataShape.isRequired
};

ShippingMethod.defaultProps = {
  defaultClassName: 'fbra_shippingMethod',
  className: '',
  classNames: []
};
