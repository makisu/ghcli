ghcli
=====



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ghcli.svg)](https://npmjs.org/package/ghcli)
[![Downloads/week](https://img.shields.io/npm/dw/ghcli.svg)](https://npmjs.org/package/ghcli)
[![License](https://img.shields.io/npm/l/ghcli.svg)](https://github.com/makisu/ghcli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ghcli
$ ghcli COMMAND
running command...
$ ghcli (-v|--version|version)
ghcli/0.0.0 linux-x64 node-v12.16.3
$ ghcli --help [COMMAND]
USAGE
  $ ghcli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ghcli hello [FILE]`](#ghcli-hello-file)
* [`ghcli help [COMMAND]`](#ghcli-help-command)

## `ghcli hello [FILE]`

describe the command here

```
USAGE
  $ ghcli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ ghcli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/makisu/ghcli/blob/v0.0.0/src/commands/hello.ts)_

## `ghcli help [COMMAND]`

display help for ghcli

```
USAGE
  $ ghcli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_
<!-- commandsstop -->
