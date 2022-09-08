# Spacecraft - code, create and hop together.

## Inspiration
Cloud developer environments are the new cool. Services like Gitpod & Github Codespaces have helped save countless number of hours required to configure developer environments. We are absolute fan of their products but they lack the social element. Imagine Codespaces with Figma-like multiplayer, That's exactly what spacecraft is all about!

## What it does
We have built the editor from ground up, while keeping our main focus on the real-time multiplayer aspect. We have successfully built a multiplayer terminal & editor(kinda). We even offer managed databases & one-click deploy to [hop](https://hop.io)!

## How we built it
We are using the [t3 stack](https://create.t3.gg/) for our frontend & simple websocket server with a pseudo-terminal for our backend.

## Challenges we ran into
For our editor, we were dependent on [firepad](https://firepad.io) but it turns out it is frozen and doesn't work with latest versions of monaco & firebase. We tried looking into alternatives like - yjs, automerge & supabase realtime. None of them really fit our use-case. 

## Accomplishments that we're proud of
We think we have built a pretty cool project in the limited time we had. We are very proud about our one-click hop deploy button!

## What's next for spacecraft
We've already started building a collaborative-editor based on [CRDT](https://wikipedia.org/wiki/Conflict-free_replicated_data_type) & hopefully we'll offer multiplayer editors soon!
