# Contribution Guidelines
:sunglasses: Thanks! Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## How to add a tool

Please follow the next rules:
- Most of the times only [this file](../tools.json) need to be touched.
- This tool only calls the CLIs directly, to [KISS](https://en.wikipedia.org/wiki/KISS_principle).
  - If a CLI is not provided please implement it and the call it from here.
  - Since the moment we spawn, it should manage the standard input and output.
  - The only extra work allowed is to ask for parameters (`param` field) and automate things, ie: to get the GitHub token from the `git-credentials` file.

## Conventions:
We use [ESLint](http://eslint.org/) and [Airbnb](https://github.com/airbnb/javascript) style guide. Please run to be sure your code fits with it and the tests keep passing:

```sh
npm test
```

## Commit messages rules:
- It should be formed by a one-line subject, followed by one line of white space. Followed by one or more descriptive paragraphs, each separated by one￼￼￼￼ line of white space. All of them finished by a dot.
- If it fixes an issue, it should include a reference to the issue ID in the first line of the commit.
- It should provide enough information for a reviewer to understand the changes and their relation to the rest of the code.
