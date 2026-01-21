#!/usr/bin/env bash
# exit on error
set -o errexit

bun install
bun run build
bun run db:generate
bun run db:migrate