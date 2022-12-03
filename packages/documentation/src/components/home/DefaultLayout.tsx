import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {Redirect} from '@docusaurus/router';
import {INITIAL_PAGE_PATH} from '@site/src/constants';

/**
 * Component which is rendered in case, current environment is usual browser.
 * @constructor
 */
export function DefaultLayout() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout noFooter={true} description={siteConfig.tagline}>
      <Redirect to={INITIAL_PAGE_PATH}/>
    </Layout>
  );
}