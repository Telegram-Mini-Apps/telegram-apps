import {SwitchBase} from '../base';

import styles from './styles.scss';
import withStyles from '../../../styles/customStyles';

/**
 * Switch used on Android platform.
 * @param props
 * @constructor
 */

export const CustomSwitch = withStyles(styles, SwitchBase);