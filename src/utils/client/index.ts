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

import AnchorLink from '@amax/anchor-link';
import AnchorLinkBrowserTransport from '@amax/anchor-link-browser-transport';

console.log('chainId---', process.env.REACT_APP_NETWORK_chainId);

export const network = {
    blockchain: 'amax',
    expireInSeconds: 600,
    host: 'test-chain.ambt.art', // ( or null if endorsed chainId )
    port: '', // ( or null if defaulting to 80 )
    chainId: '208dacab3cd2e181c86841613cf05d9c60786c677e4ce86b266d0a58884968f7', // Or null to fetch automatically ( takes longer )
    protocol: 'https',
};

export const isAPLink = window.navigator.userAgent
    .toLowerCase()
    .includes('aplink');

export function getScatter() {
    return (window as any).scatter;
}

export function initLink() {
    if (!(window as any).AnchorLink) {
        const transport = new AnchorLinkBrowserTransport();
        const link = new AnchorLink({
            transport,
            service: "https://fwd.aplink.app", // 'ws://192.168.80.152:7001', // 'http://fwd.aplink.app', //
            chains: [
                {
                    chainId: network.chainId,
                    nodeUrl: `${network.protocol}://${network.host}`,
                },
            ],
        });
        (window as any).AnchorLink = link;
    }
    return (window as any).AnchorLink;
}

export async function getContract(abiName: any) {
    const client = await getClient();
    const contract = await client.contract(abiName);
    return contract;
}
