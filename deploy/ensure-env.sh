#!/bin/bash
# Met à jour BETTER_AUTH_URL et NEXT_PUBLIC_APP_URL dans .env.local ou .env sur le serveur
# Usage: bash deploy/ensure-env.sh [.env.local|.env]

ENV_FILE="${1:-.env.local}"
APP_URL="https://aigile.lu"

if [ ! -f "$ENV_FILE" ]; then
  exit 0
fi

# Mettre à jour BETTER_AUTH_URL si absent ou incorrect
if ! grep -q "BETTER_AUTH_URL=$APP_URL" "$ENV_FILE" 2>/dev/null; then
  if grep -q "BETTER_AUTH_URL=" "$ENV_FILE"; then
    sed -i.bak "s|BETTER_AUTH_URL=.*|BETTER_AUTH_URL=$APP_URL|" "$ENV_FILE"
  else
    echo "BETTER_AUTH_URL=$APP_URL" >> "$ENV_FILE"
  fi
fi
# Mettre à jour NEXT_PUBLIC_APP_URL si absent ou incorrect
if ! grep -q "NEXT_PUBLIC_APP_URL=$APP_URL" "$ENV_FILE" 2>/dev/null; then
  if grep -q "NEXT_PUBLIC_APP_URL=" "$ENV_FILE"; then
    sed -i.bak "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=$APP_URL|" "$ENV_FILE"
  else
    echo "NEXT_PUBLIC_APP_URL=$APP_URL" >> "$ENV_FILE"
  fi
fi
