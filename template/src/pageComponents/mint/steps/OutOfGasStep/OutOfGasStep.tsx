import { useCallback } from 'react';
import clsx from 'clsx';
import { MintSteps } from '../../ContractDemo';

type OutOfGasStepProps = {
  setMintStep: React.Dispatch<React.SetStateAction<MintSteps | null>>;
};

export default function OutOfGasStep({ setMintStep }: OutOfGasStepProps) {
  const handleGotIt = useCallback(() => {
    setMintStep(null);
  }, [setMintStep]);

  return (
    <div
      className={clsx(
        'rounded-lg border border-boat-color-palette-line',
        'mb-8 bg-boat-footer-dark-gray p-8',
      )}
    >
      <h2 className="mb-5 w-full text-center text-2xl font-semibold text-white">
        You&apos;re out of gas
      </h2>

      <div className="text-center text-6xl">⛽</div>

      <div className="my-4 text-center text-sm text-gray-400">
        Please fund your wallet and try minting the NFT again.
      </div>

      <button
        type="button"
        className="block w-full rounded-full bg-white py-4 text-center text-sm text-black"
        onClick={handleGotIt}
      >
        Got it
      </button>
    </div>
  );
}
