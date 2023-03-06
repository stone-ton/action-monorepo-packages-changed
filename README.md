# Monorepo packages changed

This GitHub Action is designed to identify changes made to specific packages in a repository. Specifically, it only detects changes made to packages located in the /packages folder.


# Usage
To use this action, you can include it in your GitHub Actions workflow. Here's an example:

```yaml
jobs:
  packages_changes:
    name: Packages Changes
    runs-on: ubuntu-latest
    timeout-minutes: 5
    outputs:
      changes: ${{ steps.packages_changed.outputs.packages_changed }}
    steps:
      - uses: stone-ton/action-monorepo-packages-changed@v1
        id: packages_changed
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

  test:
    needs: packages_changes
    name: Lint and Tests
    runs-on: ubuntu-latest
    timeout-minutes: 5
    strategy:
      matrix:
        package: ${{ fromJSON(needs.packages_changes.outputs.changes) }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: 7
          run_install: false

      - id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - run: pnpm --filter ./packages/${{ matrix.package }} install
      - run: pnpm --filter ./packages/${{ matrix.package }} run lint
      - run: pnpm --filter ./packages/${{ matrix.package }} run test:coverage
```

This workflow will trigger the package-changes job when code is pushed to the main branch. The job will use the package-changes-action to detect changes made to packages in the /packages folder.

# Scenarios

## Force base reference

```yaml
- uses: stone-ton/action-monorepo-packages-changed@v1
  with:
    base_ref: main
```

In this example, the base_ref option is set to main. This means that the action will compare the current commit with the most recent commit on the main branch. By default, the action compares the current commit with the previous commit on the current branch.

You can customize the base_ref option to suit your specific needs. For example, if you have a development branch called dev, you can set the base_ref option to dev to compare the current commit with the most recent commit on the dev branch to prevent "event is not ahead of the base commit" error.


# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
