import { Component } from 'solid-js';

import { TextField, Switch, TableView, TableViewCell } from './ui-kit/ios';
import { TextFieldDark } from './dark/ios';

import styles from './styles.module.scss';
import './index.scss';

import { AirplaneMode, WiFi, Cellular } from './ui-kit/ios';

function SoundIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
    >
      <rect width="30" height="30" rx="7" fill="#007AFF"/>
      <path
        d="M14.9482 22.6426C15.4961 22.6426 15.8862 22.2524 15.8862 21.7129V8.97949C15.8862 8.43994 15.4961 8 14.9316 8C14.5415 8 14.2842 8.17432 13.8608 8.57275L10.3164 11.8931C10.2666 11.9429 10.1919 11.9678 10.1089 11.9678H7.73486C6.60596 11.9678 6 12.5903 6 13.7856V16.8735C6 18.0771 6.60596 18.6914 7.73486 18.6914H10.1089C10.1919 18.6914 10.2666 18.7163 10.3164 18.7661L13.8608 22.1196C14.2344 22.4849 14.5581 22.6426 14.9482 22.6426ZM21.9292 21.0156C22.2363 21.2231 22.6182 21.1484 22.8423 20.833C23.9048 19.3721 24.5273 17.3633 24.5273 15.313C24.5273 13.2627 23.9131 11.2373 22.8423 9.79297C22.6182 9.47754 22.2363 9.40283 21.9292 9.61035C21.6221 9.81787 21.5723 10.208 21.813 10.5483C22.7178 11.8267 23.2407 13.5449 23.2407 15.313C23.2407 17.0811 22.7012 18.7827 21.813 20.0776C21.5806 20.418 21.6221 20.8081 21.9292 21.0156ZM18.8579 18.8491C19.1318 19.04 19.522 18.9819 19.7461 18.6582C20.3853 17.8198 20.7671 16.583 20.7671 15.313C20.7671 14.043 20.3853 12.8145 19.7461 11.9678C19.522 11.644 19.1318 11.5776 18.8579 11.7769C18.5176 12.0093 18.4678 12.4243 18.7251 12.7646C19.2065 13.4287 19.4805 14.3501 19.4805 15.313C19.4805 16.2759 19.1982 17.189 18.7251 17.8613C18.4761 18.21 18.5176 18.6084 18.8579 18.8491Z"
        fill="white"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
      <path
        d="M6.10986 15.093C6.4668 15.093 6.74902 14.9353 6.94824 14.6282L14.7925 2.27661C14.9419 2.03589 15 1.85327 15 1.66235C15 1.20581 14.7012 0.906982 14.2446 0.906982C13.9126 0.906982 13.73 1.01489 13.5308 1.33032L6.07666 13.2087L2.2085 8.14526C2.00098 7.85474 1.79346 7.73853 1.49463 7.73853C1.02148 7.73853 0.697754 8.06226 0.697754 8.5188C0.697754 8.70972 0.780762 8.92554 0.938477 9.12476L5.24658 14.6116C5.49561 14.9353 5.75293 15.093 6.10986 15.093Z"
        fill="#007AFF"
      />
    </svg>
  );
}

export const Root: Component = () => {
  return (
    <TableView>
      <TableViewCell icon={<AirplaneMode/>} title="Airplane Mode" first>
        <Switch/>
      </TableViewCell>
      <TableViewCell icon={<WiFi/>} title="Wi-Fi" label="Guest" chevron clickableLevel={1}/>
      <TableViewCell
        icon={<Cellular/>}
        title="Mobile Data"
        label="Off"
        chevron
        clickableLevel={2}
        last
      />
    </TableView>
  );


  // return (
  //   <>
  //     <TextField class={styles.element} placeholder={'Application name'}/>
  //     <TextField class={styles.element} value={'Wallet'} placeholder={'Application name'} clear/>
  //     <TextFieldDark class={styles.element} placeholder={'Application name'}/>
  //     <TextFieldDark
  //       class={styles.element}
  //       value={'Wallet'}
  //       placeholder={'Application name'}
  //       clear
  //     />
  //     <Switch class={styles.element} checked={true}/>
  //     <TableView class={styles.element} title={'TITLE'} description={'Text description here'}>
  //       <TableViewCell title={'Title'} icon={<SoundIcon/>}/>
  //       <TableViewCell title={'Title'} icon={<SoundIcon/>}>
  //         <Switch/>
  //       </TableViewCell>
  //       <TableViewCell title={'Title'} label={'Label'} icon={<SoundIcon/>}/>
  //       <TableViewCell title={'Title'} label={'Label'} icon={<SoundIcon/>} chevron/>
  //       <TableViewCell title={'Title'} label={'Label'} icon={<SoundIcon/>}>
  //         <CheckIcon/>
  //       </TableViewCell>
  //       <TableViewCell title={'Title'}/>
  //       <TableViewCell title={'Title'}>
  //         <CheckIcon/>
  //       </TableViewCell>
  //     </TableView>
  //   </>
  // );
};