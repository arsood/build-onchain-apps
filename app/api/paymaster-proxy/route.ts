import { client, paymasterClient } from '@/utils/paymasterClient';
import {
  isValidAAEntrypoint,
  isWalletACoinbaseSmartWallet,
} from '@coinbase/onchainkit/wallet';
import type {
  IsValidAAEntrypointOptions,
  IsWalletACoinbaseSmartWalletOptions,
} from '@coinbase/onchainkit/wallet';
import { type NextRequest, NextResponse } from 'next/server';
import type { UserOperation } from 'permissionless';

type PaymasterRequest = {
  method: string;
  params: [UserOperation<'v0.6'>, string, string];
};

/**
 * POST function handles incoming POST requests for sponsoring operations.
 *
 * @param {Request} r - The incoming request object.
 * @returns {Promise<Response>} - The response object containing the result or an error message.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const reqBody: PaymasterRequest = (await req.json()) as PaymasterRequest;
  const { method, params } = reqBody;
  const [userOp, entrypoint] = params;

  // Verify the entrypoint address
  if (!isValidAAEntrypoint({ entrypoint } as IsValidAAEntrypointOptions)) {
    return NextResponse.json({ error: 'invalid entrypoint' }, { status: 400 });
  }

  // Validate the User Operation by checking if the sender address is a proxy with the expected bytecode.
  if (
    !(await isWalletACoinbaseSmartWallet({
      client,
      userOp,
    } as IsWalletACoinbaseSmartWalletOptions))
  ) {
    return NextResponse.json({ error: 'invalid wallet' }, { status: 400 });
  }

  try {
    let result;
    // Initial checks and preliminary validation.
    if (method === 'pm_getPaymasterStubData') {
      result = await paymasterClient.getPaymasterStubData({
        // @ts-ignore todo fix
        userOperation: userOp,
      });
      // Full validation and actual sponsorship data.
    } else if (method === 'pm_getPaymasterData') {
      result = await paymasterClient.getPaymasterData({
        // @ts-ignore todo fix
        userOperation: userOp,
      });
    } else {
      return NextResponse.json({ error: 'Method not found' }, { status: 404 });
    }
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
