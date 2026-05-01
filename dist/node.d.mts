import * as nodeFs from "node:fs/promises";
import * as fs0 from "fs";
import * as stream93 from "stream";
import * as events97 from "events";

//#region src/node.d.ts
declare function imageToBase64DataUrl(filePath: string, mimeType: string): Promise<string>;
declare function exists(path: string): Promise<boolean>;
declare const fs: {
  imageToBase64DataUrl: typeof imageToBase64DataUrl;
  exists: typeof exists;
  access(path: fs0.PathLike, mode?: number): Promise<void>;
  copyFile(src: fs0.PathLike, dest: fs0.PathLike, mode?: number): Promise<void>;
  open(path: fs0.PathLike, flags?: string | number, mode?: fs0.Mode): Promise<nodeFs.FileHandle>;
  rename(oldPath: fs0.PathLike, newPath: fs0.PathLike): Promise<void>;
  truncate(path: fs0.PathLike, len?: number): Promise<void>;
  rmdir(path: fs0.PathLike, options?: fs0.RmDirOptions): Promise<void>;
  rm(path: fs0.PathLike, options?: fs0.RmOptions): Promise<void>;
  mkdir(path: fs0.PathLike, options: fs0.MakeDirectoryOptions & {
    recursive: true;
  }): Promise<string | undefined>;
  mkdir(path: fs0.PathLike, options?: fs0.Mode | (fs0.MakeDirectoryOptions & {
    recursive?: false | undefined;
  }) | null): Promise<void>;
  mkdir(path: fs0.PathLike, options?: fs0.Mode | fs0.MakeDirectoryOptions | null): Promise<string | undefined>;
  readdir(path: fs0.PathLike, options?: (fs0.ObjectEncodingOptions & {
    withFileTypes?: false | undefined;
    recursive?: boolean | undefined;
  }) | BufferEncoding | null): Promise<string[]>;
  readdir(path: fs0.PathLike, options: {
    encoding: "buffer";
    withFileTypes?: false | undefined;
    recursive?: boolean | undefined;
  } | "buffer"): Promise<Buffer[]>;
  readdir(path: fs0.PathLike, options?: (fs0.ObjectEncodingOptions & {
    withFileTypes?: false | undefined;
    recursive?: boolean | undefined;
  }) | BufferEncoding | null): Promise<string[] | Buffer[]>;
  readdir(path: fs0.PathLike, options: fs0.ObjectEncodingOptions & {
    withFileTypes: true;
    recursive?: boolean | undefined;
  }): Promise<fs0.Dirent[]>;
  readdir(path: fs0.PathLike, options: {
    encoding: "buffer";
    withFileTypes: true;
    recursive?: boolean | undefined;
  }): Promise<fs0.Dirent<Buffer>[]>;
  readlink(path: fs0.PathLike, options?: fs0.ObjectEncodingOptions | BufferEncoding | null): Promise<string>;
  readlink(path: fs0.PathLike, options: fs0.BufferEncodingOption): Promise<Buffer>;
  readlink(path: fs0.PathLike, options?: fs0.ObjectEncodingOptions | string | null): Promise<string | Buffer>;
  symlink(target: fs0.PathLike, path: fs0.PathLike, type?: string | null): Promise<void>;
  lstat(path: fs0.PathLike, opts?: fs0.StatOptions & {
    bigint?: false | undefined;
  }): Promise<fs0.Stats>;
  lstat(path: fs0.PathLike, opts: fs0.StatOptions & {
    bigint: true;
  }): Promise<fs0.BigIntStats>;
  lstat(path: fs0.PathLike, opts?: fs0.StatOptions): Promise<fs0.Stats | fs0.BigIntStats>;
  stat(path: fs0.PathLike, opts?: fs0.StatOptions & {
    bigint?: false | undefined;
  }): Promise<fs0.Stats>;
  stat(path: fs0.PathLike, opts: fs0.StatOptions & {
    bigint: true;
  }): Promise<fs0.BigIntStats>;
  stat(path: fs0.PathLike, opts?: fs0.StatOptions): Promise<fs0.Stats | fs0.BigIntStats>;
  statfs(path: fs0.PathLike, opts?: fs0.StatFsOptions & {
    bigint?: false | undefined;
  }): Promise<fs0.StatsFs>;
  statfs(path: fs0.PathLike, opts: fs0.StatFsOptions & {
    bigint: true;
  }): Promise<fs0.BigIntStatsFs>;
  statfs(path: fs0.PathLike, opts?: fs0.StatFsOptions): Promise<fs0.StatsFs | fs0.BigIntStatsFs>;
  link(existingPath: fs0.PathLike, newPath: fs0.PathLike): Promise<void>;
  unlink(path: fs0.PathLike): Promise<void>;
  chmod(path: fs0.PathLike, mode: fs0.Mode): Promise<void>;
  lchmod(path: fs0.PathLike, mode: fs0.Mode): Promise<void>;
  lchown(path: fs0.PathLike, uid: number, gid: number): Promise<void>;
  lutimes(path: fs0.PathLike, atime: fs0.TimeLike, mtime: fs0.TimeLike): Promise<void>;
  chown(path: fs0.PathLike, uid: number, gid: number): Promise<void>;
  utimes(path: fs0.PathLike, atime: fs0.TimeLike, mtime: fs0.TimeLike): Promise<void>;
  realpath(path: fs0.PathLike, options?: fs0.ObjectEncodingOptions | BufferEncoding | null): Promise<string>;
  realpath(path: fs0.PathLike, options: fs0.BufferEncodingOption): Promise<Buffer>;
  realpath(path: fs0.PathLike, options?: fs0.ObjectEncodingOptions | BufferEncoding | null): Promise<string | Buffer>;
  mkdtemp(prefix: string, options?: fs0.ObjectEncodingOptions | BufferEncoding | null): Promise<string>;
  mkdtemp(prefix: string, options: fs0.BufferEncodingOption): Promise<Buffer>;
  mkdtemp(prefix: string, options?: fs0.ObjectEncodingOptions | BufferEncoding | null): Promise<string | Buffer>;
  writeFile(file: fs0.PathLike | nodeFs.FileHandle, data: string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | stream93, options?: (fs0.ObjectEncodingOptions & {
    mode?: fs0.Mode | undefined;
    flag?: fs0.OpenMode | undefined;
    flush?: boolean | undefined;
  } & events97.Abortable) | BufferEncoding | null): Promise<void>;
  appendFile(path: fs0.PathLike | nodeFs.FileHandle, data: string | Uint8Array, options?: (fs0.ObjectEncodingOptions & nodeFs.FlagAndOpenMode & {
    flush?: boolean | undefined;
  }) | BufferEncoding | null): Promise<void>;
  readFile(path: fs0.PathLike | nodeFs.FileHandle, options?: ({
    encoding?: null | undefined;
    flag?: fs0.OpenMode | undefined;
  } & events97.Abortable) | null): Promise<Buffer>;
  readFile(path: fs0.PathLike | nodeFs.FileHandle, options: ({
    encoding: BufferEncoding;
    flag?: fs0.OpenMode | undefined;
  } & events97.Abortable) | BufferEncoding): Promise<string>;
  readFile(path: fs0.PathLike | nodeFs.FileHandle, options?: (fs0.ObjectEncodingOptions & events97.Abortable & {
    flag?: fs0.OpenMode | undefined;
  }) | BufferEncoding | null): Promise<string | Buffer>;
  opendir(path: fs0.PathLike, options?: fs0.OpenDirOptions): Promise<fs0.Dir>;
  watch(filename: fs0.PathLike, options: (fs0.WatchOptions & {
    encoding: "buffer";
  }) | "buffer"): AsyncIterable<nodeFs.FileChangeInfo<Buffer>>;
  watch(filename: fs0.PathLike, options?: fs0.WatchOptions | BufferEncoding): AsyncIterable<nodeFs.FileChangeInfo<string>>;
  watch(filename: fs0.PathLike, options: fs0.WatchOptions | string): AsyncIterable<nodeFs.FileChangeInfo<string>> | AsyncIterable<nodeFs.FileChangeInfo<Buffer>>;
  cp(source: string | URL, destination: string | URL, opts?: fs0.CopyOptions): Promise<void>;
  glob(pattern: string | readonly string[]): NodeJS.AsyncIterator<string>;
  glob(pattern: string | readonly string[], options: fs0.GlobOptionsWithFileTypes): NodeJS.AsyncIterator<fs0.Dirent>;
  glob(pattern: string | readonly string[], options: fs0.GlobOptionsWithoutFileTypes): NodeJS.AsyncIterator<string>;
  glob(pattern: string | readonly string[], options: fs0.GlobOptions): NodeJS.AsyncIterator<fs0.Dirent | string>;
  constants: typeof fs0.constants;
};
//#endregion
export { fs };