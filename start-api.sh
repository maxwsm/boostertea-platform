#!/bin/bash
# Wrapper script to execute Bun natively under PM2
# PM2 has a bug where it tries to parse binaries as JS (ELF error).
/root/.bun/bin/bun src/api/index.ts
