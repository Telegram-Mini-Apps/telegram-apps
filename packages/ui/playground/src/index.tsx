import React from 'react';
import {Switch} from '../../src/components/Switch';
import ReactDOM from 'react-dom';

ReactDOM.render(
  (
    <>
      <Switch platform={'android'} activeColor={'#56ACE9'} size="sm"/>
      <Switch platform={'android'} activeColor={'#56ACE9'} size="m"/>
      <Switch platform={'android'} activeColor={'#56ACE9'} size="l"/>
      <Switch platform={'android'} activeColor={'#56ACE9'} size="xl"/>

      <Switch platform={'ios'} activeColor={'#56ACE9'} size="sm"/>
      <Switch platform={'ios'} activeColor={'#56ACE9'} size="m"/>
      <Switch platform={'ios'} activeColor={'#56ACE9'} size="l"/>
      <Switch platform={'ios'} activeColor={'#56ACE9'} size="xl"/>

      <Switch platform={'desktop'} activeColor={'#56ACE9'} size="sm"/>
      <Switch platform={'desktop'} activeColor={'#56ACE9'} size="m"/>
      <Switch platform={'desktop'} activeColor={'#56ACE9'} size="l"/>
      <Switch platform={'desktop'} activeColor={'#56ACE9'} size="xl"/>

      <Switch platform={'web'} activeColor={'#56ACE9'} size="sm"/>
      <Switch platform={'web'} activeColor={'#56ACE9'} size="m"/>
      <Switch platform={'web'} activeColor={'#56ACE9'} size="l"/>
      <Switch platform={'web'} activeColor={'#56ACE9'} size="xl"/>
    </>
  ),
  document.getElementById('root')!,
);