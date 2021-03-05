import {GoogleSignin} from '@react-native-google-signin/google-signin';
import GDrive from 'react-native-google-drive-api-wrapper';
import RNFS from 'react-native-fs';
import {FileList, File} from './common';

async function getParents(parts, scope, parentId) {
  if (parts.length) {
    const req = {
      spaces: scope === 'hidden' ? 'appDataFolder' : 'drive',
      fields: 'nextPageToken, files(id, name)',
      q: "mimeType='application/vnd.google-apps.folder' name='" + parts[0] + "'",
    };
    if (parentId) req.q += " '" + parentId + "' in parents";
    else if (scope === 'hidden') req.q += " 'appDataFolder' in parents";
    const res = await (await GDrive.files.list(req)).json();
    if (!res.files.length) {
      //TODO create it not found
      throw new Error('path not found');
    }
    if (parts.length > 1) {
      return getParents(parts.slice(1), scope, res.files[0].id);
    } else {
      return [res.files[0].id];
    }
  } else {
    return scope === 'hidden' ? ['appDataFolder'] : [];
  }
}

export default class RNCloudFs {
  static _initialized = false;
  static _initializing = null;

  static async fileExists() {
    await RNCloudFs._ensureInitialized();
    throw new Error('not implemented');
  }

  static async copyToCloud({sourcePath, targetPath, mimeType, scope}) {
    await RNCloudFs._ensureInitialized();
    if (!sourcePath.path) {
      throw new Error('only path is supported for now');
    }
    const parts = targetPath.split('/');
    const metadata = {
      name: parts[parts.length - 1],
      parents: await getParents(parts.slice(0, parts.length - 1), scope)
    }

    const data = await RNFS.readFile(sourcePath.path);
    const res = await (await GDrive.files.createFileMultipart(data, mimeType, metadata, false)).json();
    return res.webContentLink;
  }

  static async listFiles({targetPath, scope}) {
    await RNCloudFs._ensureInitialized();
    const req = {
      spaces: scope === 'hidden' ? 'appDataFolder' : 'drive',
      fields: 'nextPageToken, files(id, name, size, modifiedTime, mimeType, webContentLink)'
    };
    //TODO handle pagination
    const result = await (await GDrive.files.list(req)).json();
    const files = result.files.map(({name, size, modifiedTime, mimeType, webContentLink}) => {
      const isDirectory = mimeType === 'application/vnd.google-apps.folder';
      const isFile = !isDirectory;
      return new File(name, null, webContentLink, modifiedTime, size, isFile, isDirectory);
    });
    return new FileList(targetPath, files);
  }

  static _ensureInitialized() {
    if (RNCloudFs._initialized || RNCloudFs._initializing) {
      return this._initializing;
    }
    RNCloudFs._initializing = RNCloudFs._initialize();
    return RNCloudFs._initializing;
  }

  static async _initialize() {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.appdata']
    });
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();
    const { accessToken } = await GoogleSignin.getTokens();
    GDrive.init();
    GDrive.setAccessToken(accessToken);
    this._initialized = true;
  }
}
