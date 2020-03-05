- You're looking for either git reset HEAD^ --soft or git reset HEAD^ --mixed.

- There are 3 modes to the reset command as stated in the docs:

`git reset HEAD^ --soft`

- undo the git commit. Changes still exist in the working tree(the project folder) + the index (--cached)

`git reset HEAD^ --mixed`

- undo git commit + git add. Changes still exist in the working tree

`git reset HEAD^ --hard`

- Like you never made these changes to the codebase. Changes are gone from the working tree.

- Edit commit message
`git commit --amend`

- Push force
`git push -f`
