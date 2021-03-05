'use strict';

/**
 * @class
 * @property {string} name
 * @property {string} path
 * @property {string} uri
 * @property {string} lastModified
 * @property {number} size
 * @property {boolean} isFile
 * @property {boolean} isDirectory
 */
export class File {
  constructor (name, path, uri, lastModified, size, isFile, isDirectory) {
    this.name = name;
    this.path = path;
    this.uri = uri;
    this.lastModified = lastModified;
    this.size = size;
    this.isFile = isFile;
    this.isDirectory = isDirectory;
  }
}

/**
 * @class
 * @property {string} path
 * @property {File[]} files
 */
export class FileList {
  constructor (path, files) {
    this.path = path;
    this.files = files;
  }
}

/**
 * @interface
 * @name SourcePath
 * @property {string} [uri]
 * @property {string} [path]
 */
