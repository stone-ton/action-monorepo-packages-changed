import * as core from '@actions/core'
import * as github from '@actions/github'

import groupPackagesChanged from './group-package-changed'

async function run () {
  try {
    const token = core.getInput('token', { required: true })
    const base_ref = core.getInput('base_ref', { required: false })
    const octokit = github.getOctokit(token)
    const client = octokit.rest

    const { context } = github
    const { eventName } = context

    let base
    let head

    switch (eventName) {
      case 'pull_request':
        base = context.payload.pull_request?.base?.sha
        head = context.payload.pull_request?.head?.sha
        break
      case 'push':
        base = context.payload.before
        head = context.payload.after
        break
      default:
        core.setFailed(
          `This action only supports pull requests and pushes, ${context.eventName} events are not supported. `,
        )
    }

    if (base_ref) {
      const base_commit = await client.repos.getCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: base_ref,
      })

      base = base_commit.data.sha
    }

    core.info(`Base commit: ${base}`)
    core.info(`Head commit: ${head}`)

    if (!base || !head) {
      core.setFailed(
        `The base and head commits are missing from the payload for this ${context.eventName} event. `,
      )
    }

    const response = await client.repos.compareCommits({
      base,
      head,
      owner: context.repo.owner,
      repo: context.repo.repo,
    })

    if (response.status !== 200) {
      core.setFailed(
        `The GitHub API for comparing the base and head commits for this ${context.eventName} event returned ${response.status}, expected 200. `,
      )
    }

    if (response.data.status !== 'ahead') {
      core.setFailed(
        `The head commit for this ${context.eventName} event is not ahead of the base commit. `,
      )
    }

    const files = response.data.files ?? []

    const packages = groupPackagesChanged(
      files.map(({ filename }) => filename),
    )
    core.setOutput('packages_changed', Object.keys(packages))

    core.info(`Changed: ${JSON.stringify(packages, null, 2)}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
