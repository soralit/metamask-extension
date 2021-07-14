import { useSelector } from 'react-redux';
import { txDataSelector, getSelectedAccount } from '../selectors';
import { addHexes } from '../helpers/utils/conversions.util';
import { conversionGreaterThan } from '../../shared/modules/conversion.utils';
import { useGasFeeInputs } from './useGasFeeInputs';

/**
 * Uses gasFeeInputs, balance from state and txData of the current transaction
 * to determine if the users balance is sufficient for the current transaction,
 * given value of the transaction and gas fees.
 * @param {EstimateLevel} defaultEstimateToUse - which estimate
 *  level to pass to useGasFeeInputs, so it has a default estimate level to use
 * @returns {boolean} - whether or not the users balance is sufficient for the
 * current transaction
 */
export function useBalanceSufficientForTx(defaultEstimateToUse) {
  const { minimumCostInHexWei } = useGasFeeInputs(defaultEstimateToUse);
  const { balance: ethBalance } = useSelector(getSelectedAccount);
  const txData = useSelector(txDataSelector);
  const minimumTxCostInHexWei = addHexes(
    minimumCostInHexWei,
    txData?.txParams?.value,
  );
  const balanceIsSufficient = conversionGreaterThan(
    { value: ethBalance, fromNumericBase: 'hex' },
    { value: minimumTxCostInHexWei, fromNumericBase: 'hex' },
  );
  return balanceIsSufficient;
}
