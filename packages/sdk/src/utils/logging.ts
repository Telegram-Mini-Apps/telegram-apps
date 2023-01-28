import {log as utilsLog} from '@twa.js/utils';
import {InitOptions} from "../init";

let isDebug = false;

const setupLogger = (options: InitOptions) => {
    if (options.debug) {
        isDebug = options.debug
    }
};

const debugLog: typeof utilsLog = (level, ...args) => {
    if (isDebug) {
        utilsLog(level, '[SDK]', ...args);
    }
}

export {debugLog, setupLogger}