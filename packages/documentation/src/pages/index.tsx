import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {Redirect} from '@docusaurus/router';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      noFooter={true}
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <Redirect to={'docs/from-author'}/>
    </Layout>
  );
}
