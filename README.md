# ghcli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ghcli.svg)](https://npmjs.org/package/ghcli)
[![Downloads/week](https://img.shields.io/npm/dw/ghcli.svg)](https://npmjs.org/package/ghcli)
[![License](https://img.shields.io/npm/l/ghcli.svg)](https://github.com/makisu/ghcli/blob/master/LICENSE.txt)

<!-- toc -->

- [ghcli](#ghcli)
- [Usage](#usage)
- [Commands](#commands)
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

- [`ghcli help [COMMAND]`](#ghcli-help-command)
- [`ghcli label-merge`](#ghcli-label-merge)
- [`ghcli pr-merge [FILE]`](#ghcli-pr-merge-file)

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

## `ghcli label-merge`

finds all open PRs tagged with label {X} on a repo and merge them into branch {Y}. Will display if there are any merge conflicts.

```
USAGE
  $ ghcli label-merge

OPTIONS
  -b, --branch=branch  (required) target branch
  -h, --help           show CLI help
  -l, --label=label    (required) pr label
```

_See code: [src/commands/label-merge.ts](https://github.com/makisu/ghcli/blob/v0.0.0/src/commands/label-merge.ts)_

## `ghcli pr-merge`

🖇 Create a PR that merges branch Y into branch {Z}. Will display a confirmation prompt and merge conflicts.

```
USAGE
  $ ghcli pr-merge

OPTIONS
  -b, --branch=branch  (required) target branch
  -h, --help           show CLI help
  -t, --title=title    (required) title for pull request
```

_See code: [src/commands/pr-merge.ts](https://github.com/makisu/ghcli/blob/v0.0.0/src/commands/pr-merge.ts)_

## `ghcli remove-access-token`

Removes access token.

```
USAGE
  $ ghcli remove-access-token

OPTIONS
  -h, --help           show CLI help
```

_See code: [src/commands/remove-access-token.ts](https://github.com/makisu/ghcli/blob/v0.0.0/src/commands/remove-access-token.ts)_


<!-- commandsstop -->
