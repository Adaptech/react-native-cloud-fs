'use strict';

import RNCloudFs from './RNCloudFs';

// Wrapper so we have identical implementation
/**
 * @class
 */
class RNCloudFsWrapper {
  /**
   * List files on cloud drive
   * @param {string} targetPath   Relative path on cloud drive
   * @param {string} scope        Scope: visible or hidden
   * @returns {Promise<boolean>}
   */
  static fileExists({targetPath, scope}) {
    return RNCloudFs.fileExists({targetPath, scope});
  }

  /**
   * Copy file to cloud drive
   * @param {SourcePath} sourcePath   Local source path (uri or path)
   * @param {string}     targetPath   Relative destination path on the cloud drive
   * @param {string}     mimeType     Mime type the file is stored under
   * @param {string}     scope        File scope (visible or hidden)
   * @returns {Promise<string>} Actual cloud path where the file was stored (in case file already existed)
   */
  static copyToCloud({sourcePath, targetPath, mimeType, scope}) {
    return RNCloudFs.copyToCloud({sourcePath, targetPath, mimeType, scope});
  }

  /**
   * List files on cloud drive
   * @param {string} targetPath   Relative path on cloud drive
   * @param {string} scope        Scope: visible or hidden
   * @returns {Promise<FileList>}
   */
  static listFiles({targetPath, scope}) {
    return RNCloudFs.listFiles({targetPath, scope});
  }

  static get accessToken() {
    return RNCloudFs.accessToken;
  }
}

export default RNCloudFsWrapper;
