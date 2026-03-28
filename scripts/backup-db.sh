#!/usr/bin/env bash
# /scripts/backup-db.sh
# Cron automated backup script for TAIDRINK OS databases

BACKUP_DIR="/var/backups/taidrink"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
DB_CONTAINER_NAME="wsm-postgres"
BACKUP_FILE="$BACKUP_DIR/db-backup-$TIMESTAMP.sql.gz"
LOCK_FILE="/tmp/backup-db.lock"

# Execute inside file lock to avoid concurrent cron collisions
(
  flock -n 9 || { echo "[$(date)] ERROR: Backup is already running."; exit 1; }

  mkdir -p "$BACKUP_DIR"

  if [ -x "$(command -v docker)" ]; then
    # Ensure postgres container is healthy
    if [ "$(docker inspect -f '{{.State.Health.Status}}' $DB_CONTAINER_NAME)" != "healthy" ]; then
      echo "[$(date)] ERROR: Container $DB_CONTAINER_NAME is not healthy! Aborting backup."
      exit 1
    fi

    echo "[$(date)] Starting Database Backup to $BACKUP_FILE"
    docker exec $DB_CONTAINER_NAME pg_dumpall -U postgres | gzip > "$BACKUP_FILE"
    
    # Delete backups older than 7 days
    find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -exec rm {} \;
    
    echo "[$(date)] Backup Completed Successfully"
  else
    echo "[$(date)] Docker not found. Defaulting to local app.db (SQLite) backup."
    cp "packages/wsm-db/prisma/dev.db" "$BACKUP_DIR/app.db_$TIMESTAMP.backup"
    find "$BACKUP_DIR" -type f -name "*.backup" -mtime +7 -exec rm {} \;
  fi
) 9>"$LOCK_FILE"
