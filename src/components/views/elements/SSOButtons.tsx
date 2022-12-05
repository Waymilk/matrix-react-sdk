/*
Copyright 2020 The Matrix.org Foundation C.I.C.

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

import React from "react";
import { chunk } from "lodash";
import classNames from "classnames";
import { MatrixClient } from "matrix-js-sdk/src/client";


import { Signup } from "@matrix-org/analytics-events/types/typescript/Signup";
import { IdentityProviderBrand, IIdentityProvider, ISSOFlow } from "matrix-js-sdk/src/@types/auth";

import { handleConnect } from '../../../utils/client/login'
import PlatformPeg from "../../../PlatformPeg";
import AccessibleButton from "./AccessibleButton";
import { _t } from "../../../languageHandler";
import AccessibleTooltipButton from "./AccessibleTooltipButton";
import { mediaFromMxc } from "../../../customisations/Media";
import { PosthogAnalytics } from "../../../PosthogAnalytics";

interface ISSOButtonProps extends Omit<IProps, "flow"> {
    idp?: IIdentityProvider;
    mini?: boolean;
}

const getIcon = (brand: IdentityProviderBrand | string) => {
    switch (brand) {
        case IdentityProviderBrand.Apple:
            return require(`../../../../res/img/element-icons/brands/apple.svg`).default;
        case IdentityProviderBrand.Facebook:
            return require(`../../../../res/img/element-icons/brands/facebook.svg`).default;
        case IdentityProviderBrand.Github:
            return require(`../../../../res/img/element-icons/brands/github.svg`).default;
        case IdentityProviderBrand.Gitlab:
            return require(`../../../../res/img/element-icons/brands/gitlab.svg`).default;
        case IdentityProviderBrand.Google:
            return require(`../../../../res/img/element-icons/brands/google.svg`).default;
        case IdentityProviderBrand.Twitter:
            return require(`../../../../res/img/element-icons/brands/twitter.svg`).default;
        default:
            return null;
    }
};

const getAuthenticationType = (brand: IdentityProviderBrand | string): Signup["authenticationType"] => {
    switch (brand) {
        case IdentityProviderBrand.Apple:
            return "Apple";
        case IdentityProviderBrand.Facebook:
            return "Facebook";
        case IdentityProviderBrand.Github:
            return "GitHub";
        case IdentityProviderBrand.Gitlab:
            return "GitLab";
        case IdentityProviderBrand.Google:
            return "Google";
        // Not supported on the analytics SDK at the moment.
        // case IdentityProviderBrand.Twitter:
        //     return "Twitter";
        default:
            return "SSO";
    }
};

const SSOButton: React.FC<ISSOButtonProps> = ({
    matrixClient,
    loginType,
    fragmentAfterLogin,
    idp,
    primary,
    mini,
    ...props
}) => {
    const label = idp ? _t("Continue with %(provider)s", { provider: idp.name }) : _t("Sign in with single sign-on");

    const onClick = () => {
        console.log(matrixClient, loginType, fragmentAfterLogin);
        handleConnect();
        // const authenticationType = getAuthenticationType(idp?.brand ?? "");
        // PosthogAnalytics.instance.setAuthenticationType(authenticationType);
        // PlatformPeg.get().startSingleSignOn(matrixClient, loginType, fragmentAfterLogin, idp?.id);
    };
    return (
        <button className="qr-code" onClick={onClick}>Connect Wallet</button>
    );
};

interface IProps {
    matrixClient: MatrixClient;
    flow: ISSOFlow;
    loginType?: "sso" | "cas";
    fragmentAfterLogin?: string;
    primary?: boolean;
}


const SSOButtons: React.FC<IProps> = ({ matrixClient, flow, loginType, fragmentAfterLogin, primary }) => {
    const providers = flow.identity_providers || [];
    if (providers.length < 2) {
        return <div className="mx_SSOButtons">
            <SSOButton
                matrixClient={matrixClient}
                loginType={loginType}
                fragmentAfterLogin={fragmentAfterLogin}
                idp={providers[0]}
                primary={primary}
            />
        </div>;
    }

    // const rows = Math.ceil(providers.length / MAX_PER_ROW);

    return <div className="mx_SSOButtons">
        <SSOButton
            matrixClient={matrixClient}
            loginType={loginType}
            fragmentAfterLogin={fragmentAfterLogin}
            mini={true}
            primary={primary}
        />
    </div>;
};

export default SSOButtons;
