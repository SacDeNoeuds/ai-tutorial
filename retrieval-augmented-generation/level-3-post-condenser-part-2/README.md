## Level 3 – Goal

Wrap up the post condenser from part 1 to load a blog post from the Internet and condense it.

## Learnings

My first approach was to let the AI call the tools, so I added 3 tools:

- A `fetchPageContent` tool – to load the blog post from the Internet.
- A `postCondenser` tool – calling another AI model to make them collaborate.
- A `writeFile` tool – to save the condensed post to the file system.

Letting the AI call itself the tools makes the whole thing completely random, therefore unreliable.

My second approach was to let the AI call one tool, so then the AI is merely receiving a prompt containing a blog post, and the one tool was performing the fetching, condensing and file write all-in-one. Which is too bad.

What I learned: tools must be super specific _and_ explicit, and you may be able to rely on the AI to call them properly if they are too small.
