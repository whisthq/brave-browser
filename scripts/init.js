// Copyright (c) 2019 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.
//
// Coypright (c) 2022 Whist Technologies, Inc. All rights reserved.

const fs = require('fs')
const Log = require('../lib/logging')
const path = require('path')
const util = require('../lib/util')

Log.progress('Performing initial checkout of brave-core')

const braveCoreDir = path.resolve(__dirname, '..', 'src', 'brave')
const braveCoreRef = util.getProjectVersion('brave-core')

if (!fs.existsSync(path.join(braveCoreDir, '.git'))) {
  Log.status(`Cloning brave-core [${braveCoreRef}] into ${braveCoreDir}...`)
  fs.mkdirSync(braveCoreDir)
  util.runGit(braveCoreDir, ['clone', util.getNPMConfig(['projects', 'brave-core', 'repository', 'url']), '.'])
  util.runGit(braveCoreDir, ['checkout', braveCoreRef])
}

const braveCoreSha = util.runGit(braveCoreDir, ['rev-parse', 'HEAD'])
Log.progress(`Resetting brave-core to "${braveCoreSha}"...`)
util.runGit(braveCoreDir, ['reset', '--hard', 'HEAD'], true)

let checkoutResult = util.runGit(braveCoreDir, ['checkout', braveCoreSha], true)
if (checkoutResult === null) {
  Log.error('Could not checkout: ' + braveCoreSha)
}

// Checkout was successful
Log.progress(`...brave-core is now at commit ID ${braveCoreSha}`)

/***************************************************************
 * Added by Whist 
 ***************************************************************/ 

Log.progress('Performing initial checkout of whist')

const whistCoreDir = path.resolve(__dirname, '..', 'src', 'whist')
const whistCoreRef = util.getProjectVersion('whist')

if (!fs.existsSync(whistCoreDir) || !fs.existsSync(path.join(whistCoreDir, '.git'))) {
  Log.status(`Cloning whist [${whistCoreRef}] into ${whistCoreDir}...`)
  fs.mkdirSync(whistCoreDir)
  util.runGit(whistCoreDir, ['clone', util.getNPMConfig(['projects', 'whist', 'repository', 'url']), '.'])
  util.runGit(whistCoreDir, ['checkout', whistCoreRef])
}

const whistCoreSha = util.runGit(whistCoreDir, ['rev-parse', 'HEAD'])
Log.progress(`Resetting whist to "${whistCoreSha}"...`)
util.runGit(whistCoreDir, ['reset', '--hard', 'HEAD'], true)

let whistCheckoutResult = util.runGit(whistCoreDir, ['checkout', whistCoreSha], true)
if (whistCheckoutResult === null) {
  Log.error('Could not checkout: ' + whistCoreSha)
}

// Checkout was successful
Log.progress(`...whist is now at commit ID ${whistCoreSha}`)

/***************************************************************
 ***************************************************************/ 

let npmCommand = 'npm'
if (process.platform === 'win32') {
  npmCommand += '.cmd'
}

util.run(npmCommand, ['install'], { cwd: braveCoreDir })

util.run(npmCommand, ['run', 'sync' ,'--', '--init'].concat(process.argv.slice(2)), {
  cwd: braveCoreDir,
  env: process.env,
  stdio: 'inherit',
  shell: true,
  git_cwd: '.', })
