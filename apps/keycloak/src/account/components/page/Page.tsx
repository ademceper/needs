/**
 * WARNING: Before modifying this file, run the following command:
 * 
 * $ npx keycloakify own --path "account/components/page/Page.tsx"
 * 
 * This file is provided by @keycloakify/keycloak-account-ui version 260502.0.2.
 * It was copied into your repository by the postinstall script: `keycloakify sync-extensions`.
 */

/* eslint-disable */

// @ts-nocheck

import { PageSection, Text, TextContent, Title } from "../../../shared/@patternfly/react-core";
import { PropsWithChildren } from "react";

type PageProps = {
  title: string;
  description: string;
};

export const Page = ({
  title,
  description,
  children,
}: PropsWithChildren<PageProps>) => {
  return (
    <>
      <PageSection variant="light">
        <TextContent>
          <Title headingLevel="h1" data-testid="page-heading">
            {title}
          </Title>
          <Text component="p">{description}</Text>
        </TextContent>
      </PageSection>
      <PageSection variant="light">{children}</PageSection>
    </>
  );
};
