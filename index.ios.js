'use strict';

const ReactNative = require('react-native');
const RNPermissions = ReactNative.NativeModules.ReactNativePermissions;

const RNPTypes = [
  'location',
  'camera',
  'microphone',
  'photo',
  'contacts',
  'event',
  'reminder',
  'bluetooth',
  'notification',
  'backgroundRefresh',
  'speechRecognition',
]

const DEFAULTS = {
  'location' : 'whenInUse',
  'notification': ['alert', 'badge', 'sound'],
}

class ReactNativePermissions {
  canOpenSettings() {
    return RNPermissions.canOpenSettings()
  }

  openSettings() {
    return RNPermissions.openSettings()
  }

  getTypes() {
    return RNPTypes;
  }

  check(permission, type) {
    if (!RNPTypes.includes(permission)) {
      return Promise.reject(`ReactNativePermissions: ${permission} is not a valid permission type on iOS`);
    }

    return RNPermissions.getPermissionStatus(permission, type);
  }

  request(permission, type) {
    if (!RNPTypes.includes(permission)) {
      return Promise.reject(`ReactNativePermissions: ${permission} is not a valid permission type on iOS`);
    }

    if (permission == 'backgroundRefresh') {
      return Promise.reject('ReactNativePermissions: You cannot request backgroundRefresh')
    }

    type = type || DEFAULTS[permission]

    return RNPermissions.requestPermission(permission, type)
  }

  checkMultiple(permissions) {
    let perm_promises = []
    let perm_names = Object.keys(permissions)
    perm_names.forEach( perm_name => {
      perm_promises.push(this.check(perm_name, permissions[perm_name]))
  }, this)

    return Promise.all(perm_promises)
    .then(res =>
    res.reduce((acc, cur, i) => {
      acc[perm_names[i]] = cur
      return acc
    }, {})
  )
  }
}

module.exports = new ReactNativePermissions()
