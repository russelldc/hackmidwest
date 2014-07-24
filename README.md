Presentation Analysis using Clarify API
=======================================

This is a node.js web app for helping people become better at presenting. The user first uploads an audio file of their speech practice, then chooses "problem words" they want to look out for.

After a few minutes of processing via the Clarify API, an audio player will appear with colored lines along the progress bar indicating where the user's problem words were mentioned.

Below that is a column graph showing the number of times each problem word was spoken along with the percentage of total speaking time wasted.

**Note**: Either words or phrases can be searched for. Separate each one with |. Ex: like|so yeah|lorem ipsum


**Disclaimer**:
As this was indeed from a hackathon, please don't judge this as a record of my coding style, haha.
This code was the result of switching 5 times between different languages over the 24 hour period, but hey it works!

Unfortunately at the moment, 'um' and 'uhh' are not in Clarify's dictionary, which were the obvious words this project stemmed from. They have informed me that these will be added soon, though!
