/**
 * WARNING: Before modifying this file, run the following command:
 * 
 * $ npx keycloakify own --path "account/components/datalist/EmptyRow.tsx"
 * 
 * This file is provided by @keycloakify/keycloak-account-ui version 260502.0.2.
 * It was copied into your repository by the postinstall script: `keycloakify sync-extensions`.
 */

/* eslint-disable */

// @ts-nocheck

import {
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
} from "../../../shared/@patternfly/react-core";

type EmptyRowProps = {
  message: string;
};

export const EmptyRow = ({ message, ...props }: EmptyRowProps) => {
  return (
    <DataListItem className="pf-v5-u-align-items-center pf-p-b-0">
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="0" {...props}>
              {message}
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );
};
