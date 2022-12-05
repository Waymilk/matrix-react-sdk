/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { IdentityProof, ChainId, APIError } from "@amax/anchor-link";

import { initLink, network } from "./index";
export const blockchains = [
    {
        chainId: network.chainId,
        name: network.blockchain,
        rpcEndpoints: [
            {
                protocol: network.protocol,
                host: network.host,
                port: 0,
            },
        ],
    },
];

export async function verifyProof(link, identity) {
    // Generate an array of valid chain IDs from the demo configuration
    const chains = blockchains.map((chain) => chain.chainId);

    // Create a proof helper based on the identity results from anchor-link
    const proof = IdentityProof.from(identity.proof);

    // Check to see if the chainId from the proof is valid for this demo
    const chain = chains.find((id) => ChainId.from(id).equals(proof.chainId));
    if (!chain) {
        throw new Error("Unsupported chain supplied in identity proof");
    }

    // Load the account data from a blockchain API
    // let account: API.v1.AccountObject;
    let account = null;
    try {
        account = await link.client.v1.chain.get_account(proof.signer.actor);
    } catch (error) {
        if (error instanceof APIError && error.code === 0) {
            throw new Error("No such account");
        } else {
            throw error;
        }
    }

    // Retrieve the auth from the permission specified in the proof
    const auth = account.getPermission(proof.signer.permission).required_auth;

    // Determine if the auth is valid with the given proof
    const valid = proof.verify(auth, account.head_block_time);

    // If not valid, throw error
    if (!valid) {
        throw new Error("Proof invalid or expired");
    }

    // Recover the key from this proof
    const proofKey = proof.recover();

    // Return the values expected by this demo application
    return {
        account,
        proof,
        proofKey,
        proofValid: valid,
    };
}

export const handleConnect = async () => {
    const link = initLink();
    console.log(link, "linklink");

    const identity = await link.login("anchor-link-demo");
    const { account, proof, proofKey, proofValid } = await verifyProof(
        link,
        identity,
    );
    console.log(account, proof, proofKey, proofValid, "ssss");
};
