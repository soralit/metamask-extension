import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import { txDataSelector, getSelectedAccount } from '../selectors';
import { useGasFeeInputs } from './useGasFeeInputs';
import { useBalanceSufficientForTx } from './useBalanceSufficientForTx';

jest.mock('./useGasFeeInputs', () => ({
  useGasFeeInputs: jest.fn(),
}));

jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');

  return {
    ...actual,
    useSelector: jest.fn(),
  };
});

const generateUseSelectorRouter = () => (selector) => {
  if (selector === txDataSelector) {
    return {
      txParams: {
        value: '0x5555',
      },
    };
  }
  if (selector === getSelectedAccount) {
    return {
      balance: '0xffff',
    };
  }
  return undefined;
};

describe('useBalanceSufficientForTx', () => {
  beforeEach(() => {
    useSelector.mockImplementation(generateUseSelectorRouter());
  });

  describe('when balance is sufficient for minimum transaction cost', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useGasFeeInputs.mockImplementation(() => ({
        minimumCostInHexWei: '0xaaa9',
      }));
    });

    it('should return true', () => {
      const { result } = renderHook(() => useBalanceSufficientForTx());
      expect(result.current).toBe(true);
    });
  });

  describe('when balance is insufficient for minimum transaction cost', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useGasFeeInputs.mockImplementation(() => ({
        minimumCostInHexWei: '0xaaab',
      }));
    });

    it('should return false', () => {
      const { result } = renderHook(() => useBalanceSufficientForTx());
      expect(result.current).toBe(false);
    });
  });
});
