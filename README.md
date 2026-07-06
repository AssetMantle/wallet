# MantleWallet

Official web wallet for the AssetMantle blockchain (`mantle-1`), live at
[wallet.assetmantle.one](https://wallet.assetmantle.one).

Send, receive, stake, vote, trade, and bridge $MNTL: Cosmos-side via
cosmos-kit-connected wallets (Keplr, Leap, Cosmostation, Vectis), IBC to
Osmosis, and ERC-20 MNTL on Ethereum/Polygon via Gravity Bridge and the
Polygon POS bridge (web3modal/wagmi).

## Development

```bash
yarn                # install (yarn 1.x - do not use npm, the lockfile is yarn.lock)
yarn dev            # local dev server on http://localhost:3000
yarn build          # production build (Next.js 12)
yarn lint           # next lint
```

Pre-commit runs eslint + prettier on staged files via lint-staged.

## Structure

- `pages/` - Next.js routes (transact, stake, vote, trade, earn, farm, bridge, ibc)
- `views/`, `components/` - UI
- `data/` - chain query/tx layers (`queryApi.js`, `txApi.js`, `ethApi.js`, swr hooks)
- `config/` - chain config, theme, styles

## Deployment

Merges to `main` deploy to production via Vercel.
