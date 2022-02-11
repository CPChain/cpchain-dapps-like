# cpchain-dapps-like

## Product Vision
This contract is used to support the community to like the news on the CPChain website and mobile wallet. Among them, mobile users directly like it, and after website users click the like button, a QR code image and download wallet guide will pop up, allowing users to download the wallet and then scan the code to like.

## Contract Function
- Link registration: User (any user) register a link, the link needs to be unique and cannot be registered repeatedly.
- Unlink registration: Only the person who registered this link can unregister.
- Like: The user likes the link, and the contract records the number of likes, the same user cannot like repeatedly.
- Donation: Users can donate to the author of the link, and the donation will be transferred directly to the author.
- Unlike: User cancels their like.
- Disabled contract: The contract owner can disable the contract.
