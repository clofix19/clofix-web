#!/bin/bash

BASE_URL="https://clofix.com"
SITEMAP_DIR="xml"

mkdir -p "$SITEMAP_DIR"

MASTER_SITEMAP="./sitemap.xml"

echo '<?xml version="1.0" encoding="UTF-8"?>' > "$MASTER_SITEMAP"
echo '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> "$MASTER_SITEMAP"

CURRENT_DATE=$(date -u +"%Y-%m-%d")

generate_sitemap () {
    FILE_PATH=$1
    URL_PATH=$2
    NAME=$3

    SITEMAP_NAME="$NAME-sitemap.xml"
    SITEMAP_FILE="$SITEMAP_DIR/$SITEMAP_NAME"

    echo '<?xml version="1.0" encoding="UTF-8"?>' > "$SITEMAP_FILE"
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> "$SITEMAP_FILE"

    echo "  <url>" >> "$SITEMAP_FILE"
    echo "    <loc>$BASE_URL/$URL_PATH</loc>" >> "$SITEMAP_FILE"
    echo "    <lastmod>$CURRENT_DATE</lastmod>" >> "$SITEMAP_FILE"
    echo "  </url>" >> "$SITEMAP_FILE"

    echo '</urlset>' >> "$SITEMAP_FILE"

    echo "  <sitemap>" >> "$MASTER_SITEMAP"
    echo "    <loc>$BASE_URL/$SITEMAP_DIR/$SITEMAP_NAME</loc>" >> "$MASTER_SITEMAP"
    echo "    <lastmod>$CURRENT_DATE</lastmod>" >> "$MASTER_SITEMAP"
    echo "  </sitemap>" >> "$MASTER_SITEMAP"
}

# =========================
# ROOT HTML FILES
# =========================
for file in *.html; do
    [ "$file" = "index.html" ] && continue

    name="${file%.html}"
    generate_sitemap "$file" "$name" "$name"
done

# =========================
# CASE STUDY HTML FILES
# =========================
if [ -d "case-study" ]; then
    for file in case-study/*.html; do
        [ -f "$file" ] || continue

        filename=$(basename "$file")
        name="${filename%.html}"

        generate_sitemap "$file" "case-study/$filename" "case-study-$name"
    done
fi

# =========================
# HOME PAGE
# =========================
if [ -f "index.html" ]; then
    SITEMAP_NAME="home-sitemap.xml"
    SITEMAP_FILE="$SITEMAP_DIR/$SITEMAP_NAME"

    echo '<?xml version="1.0" encoding="UTF-8"?>' > "$SITEMAP_FILE"
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> "$SITEMAP_FILE"

    echo "  <url>" >> "$SITEMAP_FILE"
    echo "    <loc>$BASE_URL</loc>" >> "$SITEMAP_FILE"
    echo "    <lastmod>$CURRENT_DATE</lastmod>" >> "$SITEMAP_FILE"
    echo "  </url>" >> "$SITEMAP_FILE"

    echo '</urlset>' >> "$SITEMAP_FILE"

    echo "  <sitemap>" >> "$MASTER_SITEMAP"
    echo "    <loc>$BASE_URL/$SITEMAP_DIR/$SITEMAP_NAME</loc>" >> "$MASTER_SITEMAP"
    echo "    <lastmod>$CURRENT_DATE</lastmod>" >> "$MASTER_SITEMAP"
    echo "  </sitemap>" >> "$MASTER_SITEMAP"
fi

echo '</sitemapindex>' >> "$MASTER_SITEMAP"

echo "✅ Sitemap generated with root + case-study HTML support"