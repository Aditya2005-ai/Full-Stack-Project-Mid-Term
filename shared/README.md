# Shared Contracts & Constants

This directory contains genuinely shared contracts, constants, and schemas shared between client, server, and generator packages.

## Guidelines
1. **Never** import client/React code here.
2. **Never** import server or database logic here.
3. **Never** import generator implementation files here.
4. Keep definitions immutable (`Object.freeze`) and pure.
5. All 5 developers must agree before modifying any file in `shared/`.
