#!/bin/bash
# Fix all URLs: remove .html extension, index.html → /
# Run from your website root directory

# Create a backup directory for all .bak files
BACKUP_DIR="./sed_backups_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "Backups will be saved to: $BACKUP_DIR"

find . -name "*.html" -not -path "*/node_modules/*" | while read file; do
  filename=$(basename "$file")
  pagename="${filename%.html}"
  
  echo "Processing: $file"
  
  # Create timestamped backup in backup directory
  backup_filename="${BACKUP_DIR}/$(echo "$file" | sed 's/^\///' | tr '/' '_').bak"
  cp "$file" "$backup_filename"
  
  # Also create local .bak for convenience (optional - remove if not needed)
  cp "$file" "$file.bak"
  
  # Fix ALL href links regardless of filename pattern
  # This catches: href="about.html", href="./about.html", href="../about.html"
  # Also fixes: href="index.html", href="./index.html"
  
  sed -i \
    -e 's|href="index\.html"|href="/"|g' \
    -e "s|href='index\.html'|href='/'|g" \
    -e 's|href="\./index\.html"|href="/"|g' \
    -e "s|href='\./index\.html'|href='/'|g" \
    -e 's|href="\.\./index\.html"|href="/"|g' \
    -e "s|href='\.\./index\.html'|href='/'|g" \
    -e 's|href="\([^"]*\)\.html"|href="/\1"|g' \
    -e "s|href='\([^']*\)\.html'|href='/\1'|g" \
    -e 's|href="\./\([^"]*\)\.html"|href="/\1"|g' \
    -e "s|href='\./\([^']*\)\.html'|href='/\1'|g" \
    -e 's|href="\.\./\([^"]*\)\.html"|href="/\1"|g' \
    -e "s|href='\.\./\([^']*\)\.html'|href='/\1'|g" \
    -e 's|href="https://clofix\.com/index\.html"|href="https://clofix.com/"|g' \
    -e 's|href="https://clofix\.com/index"|href="https://clofix.com/"|g' \
    -e 's|href="https://clofix\.com"|href="https://clofix.com/"|g' \
    -e 's|href="https://clofix\.com/\([^"]*\)\.html"|href="https://clofix.com/\1"|g' \
    "$file"
  
  # Fix any double slashes that might have been created
  sed -i \
    -e 's|href="//|href="/|g' \
    -e "s|href='//|href='/'|g" \
    "$file"
  
  echo "  ✓ Fixed ${pagename} (backup: $backup_filename)"
done

echo ""
echo "=== Verification ==="
echo "-- Remaining .html links (should be none) --"
REMAINING=$(grep -r '\.html"' --include="*.html" . | grep -v node_modules | grep -v ".bak" | head -20)
if [ -z "$REMAINING" ]; then
  echo "✓ No remaining .html links found!"
else
  echo "$REMAINING"
  echo ""
  echo "⚠️  Some .html links remain. Running second pass..."
  
  # Second pass for any remaining links
  find . -name "*.html" -not -path "*/node_modules/*" | while read file; do
    if grep -q '\.html"' "$file" 2>/dev/null; then
      echo "Re-processing: $file"
      # Create additional backup for second pass
      cp "$file" "${file}.bak2"
      sed -i \
        -e 's|href="\([^"]*\)\.html"|href="/\1|g' \
        -e "s|href='\([^']*\)\.html'|href='/\1|g" \
        -e 's|href="index\.html"|href="/"|g' \
        -e 's|href="\./index\.html"|href="/"|g' \
        "$file"
    fi
  done
  
  echo ""
  echo "Final verification:"
  FINAL_COUNT=$(grep -r '\.html"' --include="*.html" . | grep -v node_modules | grep -v "\.bak" | wc -l | xargs)
  echo "Remaining .html links count: $FINAL_COUNT"
  
  if [ "$FINAL_COUNT" -eq 0 ]; then
    echo "✓ All fixed!"
  else
    echo "⚠️  Still have $FINAL_COUNT links. Check files manually."
    echo ""
    echo "Files with remaining .html links:"
    grep -l '\.html"' --include="*.html" . | grep -v "\.bak" | grep -v node_modules
  fi
fi

echo ""
echo "=== Cleanup ==="
echo "Backup files saved to: $BACKUP_DIR"
echo "Local .bak files also created in each directory"
echo ""
echo "To restore all backups, run:"
echo "  find . -name '*.bak' -exec sh -c 'cp \"\$1\" \"\${1%.bak}\"' _ {} \;"
echo ""
echo "Or to remove all .bak files:"
echo "  find . -name '*.bak' -type f -delete"