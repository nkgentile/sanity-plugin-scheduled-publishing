# Scheduled Publishing plugin for Sanity.io

> This is a **Sanity Studio v3** plugin.
> For the v2 version, please refer to the [v2-branch](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/tree/studio-v2).

## What is it?

Schedule your content for future publication and organise upcoming releases – no custom tasks or serverless functions required!

> This plugin uses Sanity's [Scheduling API][scheduling-api] which is available to customers on Team or higher plans. Please visit our [Scheduled Publishing][scheduled-publishing] blog post for more information.

![Scheduled Publishing tool view](https://user-images.githubusercontent.com/209129/159557062-6d3ea6d7-941e-472a-a7d4-7e229bf81780.png)

![Scheduled Publishing document view](https://user-images.githubusercontent.com/209129/159463180-703d557a-cfe6-4ff0-970f-b33eea048e87.png)

## Table of contents

- [Features](#features)
- [Getting started](#getting-started)
  - [Install](#install)
  - [Usage](#usage)
    - [Manually configuring the Schedule document action](#manually-configuring-the-schedule-document-action)
    - [Manually configuring the Schedule document badge](#manually-configuring-the-scheduled-document-badge)
- [FAQ](#faq)
- [Changes from Sanity Studio v2 version](#changes-from-sanity-studio-v2-version)

## Features

### Create and edit schedules directly from the document editor

- Create and edit schedules for the document you're working on
- See current schedule status and potential validation issues

### View all your schedules with our dedicated tool

- Filter all schedules by status or use the calendar to browse by date
- Edit, delete, and immediately publish schedules
- Automatically validate upcoming schedules, and identify issues before they're published
- Easily identify who created a schedule

### View schedule dates in any remote time zone

<img src="https://user-images.githubusercontent.com/209129/159458620-ce6b8112-c19a-4c24-a2d5-f79798d1e6f7.png" width="600" />

- Change the time zone you want to preview schedules in by clicking the 🌎 **Time Zone** button when visible. Great when you need to co-ordinate with a global team or want to time publication to specific regions.
- Easily select time zones by city, time zone abbreviation or name search.
- Selected time zones are automatically stored in your local storage for future use.

# Getting started

## Installation

```
npm install --save @sanity/scheduled-publishing
```

or

```
yarn add @sanity/scheduled-publishing
```

## Usage

Add it as a plugin in sanity.config.ts (or .js):

```js
import { scheduledPublishing } from "@sanity/scheduled-publishing";

export default defineConfig({
  // ...
  plugins: [
    scheduledPublishing(),
  ] 
})
```

This will automatically:

- Add a Schedule [document action][document-actions] to _all document types_
- Display a Scheduled [document badge][document-badges] to _all document types_
- Add the dedicated Schedules _tool_ in your navigation bar

Please see [Custom setup](#custom-setup) for more fine grained control on limiting schedule buttons to specific document types and working with existing custom document actions or badges.

### Custom setup

This plugin also exports both the **Schedule document action** and **Scheduled badge** which you can import and compose as you see fit.

#### Manually configuring the Schedule document action

This example assumes [you've customised your own document actions][document-actions] and would like to only show the Schedule button on `movie` documents only.

The Schedule document action allows users to both create and edit existing schedules directly from the form editor. It is added to all document types by the plugin,
so you should remove it from types that should NOT have it.

```js
import {scheduledPublishing, ScheduleAction} from '@sanity/scheduled-publishing'

export default defineConfig({
  // ...
  plugins: [
    scheduledPublishing(),
  ],
  document: {
    actions: (previousActions, {schemaType}) => {
      /*
      * Please note that this will only alter the visibility of the button in the studio.
      * Users with document publish permissions will be able to create schedules directly
      * via the Scheduled Publishing API.
      */
      if (schemaType.name !== 'movie') {
        // Remove the schedule action from any documents that is not 'movie'.
        return previousActions.filter(action => action !== ScheduleAction)
      }
      return previousActions
    },
  },
})
```

#### Manually configuring the Scheduled document badge

This example assumes [you've customised your own document badges][document-badges] and would like to only show the Scheduled badge on `movie` documents only.

The Scheduled document badge displays whether the current document is scheduled and when it will be published if so. It is added to all document types by the plugin,
so you should remove it from types that should NOT have it.

```js
import {scheduledPublishing, ScheduledBadge} from '@sanity/scheduled-publishing'

export default defineConfig({
  // ...
  plugins: [
    scheduledPublishing(),
  ],
  document: {
    actions: (previousBadges, {schemaType}) => {
      if (schemaType.name !== 'movie') {
        // Remove the schedule badge from any documents that is not 'movie'.
        return previousBadges.filter(badge => badge !== ScheduledBadge)
      }
      return previousBadges
    },
  },
})
```

## FAQ

<details>
<summary>What's the relationship between Schedules and my dataset?</summary>

Schedules sit adjacent to your dataset and can be managed using the [Scheduling API][scheduling-api] (which this plugin does for you).

Schedules are a unique resource and are linked to, but do not exist within your Sanity project and dataset. It's important to understand the following behavior:

- As schedules are not contained within a project’s dataset, you cannot query them via GROQ or GraphQL.
- Deleting a dataset will immediately delete all schedules.
- Deleting a project will immediately delete all schedules.
- `sanity dataset export` will not include schedules and `sanity dataset import` does not support importing schedules.
- Server-side copying of datasets does not include schedules.
- When a project is disabled or blocked, all scheduled publishes will invariably fail as mutations will not be allowed on the dataset.

More information can be found on the [Scheduling API][scheduling-api] page.

</details>

<details>
<summary>Where is time zone data pulled from?</summary>

- Time zones and their corresponding cities, regions and daylight savings offsets are directly sourced from the [@vvo/dztb][@vvo/dztb] library, which is automatically updated with data from [geonames.org](https://www.geonames.org/).
- Latest time zone + region data from [@vvo/dztb][@vvo/dztb] is pulled in when first installing this plugin.
- In the event you need to bring in upstream time zone and region data, run:

  ```sh
  # Yarn
  yarn upgrade @sanity/scheduled-publishing

  # NPM
  npm update @vvo/tzdb --legacy-peer-deps
  ```

</details>

<details>
<summary>Will scheduled documents with validation errors publish?</summary>

- **Yes.** Documents scheduled to publish in future will do so, even if they contain validation errors. This also applies to scheduled documents that you manually opt to publish immediately via the tool.

</details>

### Changes from Sanity Studio v2 version

The Studio V3 version differs from the v2 versions in a few ways:

- Actions and badges now auto-compose with other document actions by default. This is the _opposite_ of how the v2 version behaves:
  It is no longer necessary to compose actions and badges manually when there are other plugins that add those to studio.
- This means that you now have to _remove_ the Schedule Action from types that *should not* have it, as opposed to _add_ it for those that should like in v2.

## License

This repository is published under the [MIT](LICENSE) license.

[document-actions]: https://www.sanity.io/docs/document-actions
[document-badges]: https://www.sanity.io/docs/custom-document-badges
[scheduled-publishing]: https://www.sanity.io/blog/publishing-scheduled
[scheduling-api]: https://www.sanity.io/docs/scheduling-api
[@vvo/dztb]: https://github.com/vvo/tzdb

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.


## License

MIT-licensed. See LICENSE.

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

### Release new version

Run ["CI & Release" workflow](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/actions/workflows/main.yml).
Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.
