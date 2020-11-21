# Contributing Guidelines

Firstly, Thank You for taking time to contribute! 🎉 🚸

The following is a set of guidelines for contributing to this series, and the companion
demo-website we will be using to show off firebase. 🔥🔥
These are mostly guidelines, not rules. Use your best judgment, and feel free to 
propose changes to this document in a pull request. 👥


#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
* [Front End Stuff 🎨](#Front-End-Stuff-🎨)
* [Backend Stuff 🔥](#Backend-Stuff-🔥)

[How Can I Contribute?](#how-can-i-contribute)
* [Reporting Bugs 🐛](#reporting-bugs-🐛)
* [Suggesting Enhancements](#suggesting-enhancements)
* [Your First Commit](#Your-First-Commit)
* [Pull Requests](#pull-requests)

[Style Guidelines](#Style-Guidelines)
* [Git Commit Messages](#git-commit-messages)
* [JavaScript Styleguide](#javascript-styleguide)
* [Documentation Styleguide](#documentation-styleguide)



## Code of Conduct 

This project and everyone participating in it is governed by the
[Google Developers Community Guidelines](https://developers.google.com/community-guidelines). By participating,
you are expected to uphold this code. Let's just keep this fun for everyone!

## What should I know before I get started?

### Front End Stuff 🎨

This is a vanilla web dev project which means all you need to know is basic HTML, CSS and Javascript!

We are using a CSS framework called [Bulma](https://bulma.io) to maintain a unanimous *look and feel* across the site.
With that being said however- we want to encourage creative freedom and therefore give you discretion to write your own 
CSS files, add to ours or import commonly used frameworks.<br>
Please see the [Contributing](#Your-First-Commit) section for more information.

### Backend Stuff 🔥

Of course being a Firebase series we will be using the BAAS (Backend as a Service), Firebase which is currently being
maintained by Google. There are no requisites other than an understanding of Firebase and how to implement its 
services in Javascript.<BR>
Please see the resources linked below to familiarize yourself with Firebase.

* [Official Firebase Documentation](https://firebase.google.com/docs)
* [Official Firebase Github](https://firebase.google.com/docs)


We encourage suggestions and modification but, in order to keep the repository and series events in sync,
we won't be accepting modifications to Firebase-related code *on branches designated for individual events*.<br>
Please see the [Contributing](#Pull-Requests) section for more information.

## How Can I Contribute?

### Reporting Bugs 🐛

You can submit any nasty bugs you find for inspection under the GitHub
[Issues](https://github.com/RafaelZasas/intro-to-firebase/issues)

Please be thoughtful when submitting issues:
* Check to see if a similar issue hasn't already been posted
* Include as much information as possible
* Add a suggestion to fix the issue if you know of one

### Suggesting Enhancements

You can request the community and us to add features or updates which you think might be necessary or just plain cool
under Github [Enhancements](https://github.com/RafaelZasas/intro-to-firebase/labels/enhancement)

### Pull Requests

If you would like to directly contribute to the code we would be very appreciative! We just have a few rules to keep 
things fairly organised.

First off, we won't be accepting pull requests to any branches that have been designated as "follow along" code for the
events within the series. We just want to keep it the way it was during the event to be in sync with the recordings.

We would love to have updates to the User Interface. Please submit styling related Pull Requests to the
[feature/UI](https://github.com/RafaelZasas/intro-to-firebase/tree/feature/UI-Styles) branch.

If you would like to make changes to the User Experience and functionality of the site BTS please submit your changes 
to the [feature/UX](https://github.com/RafaelZasas/intro-to-firebase/tree/feature/UX) branch.

Please make sure to review the [Style Guidelines](#Style-Guidelines) section before making your Pull Requests


## Style Guidelines

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* When only changing documentation, include `[ci skip]` in the commit title
* Consider starting the commit message with an applicable [gitmoji](https://gitmoji.carloscuesta.me/).
  We've listed a few examples below:
    * 🎨 `:art:` when improving the format/structure of the code
    * 💄 `:lipstick:` when updating the User Interface and styling
    * ⚡️`:zap:` when improving performance
    * 📝`:memo:` when updating or writing new documentation
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * 💚 `:green_heart:` when fixing the CI build


### JavaScript Styleguide

All JS code should follow [Google's Javascript Styleguide](https://google.github.io/styleguide/jsguide.html).

