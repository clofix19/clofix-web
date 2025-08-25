#!/bin/bash

# Base URL
BASE_URL="https://clofix.com"
SITEMAP_DIR="xml"

# Create sitemap directory if it doesn't exist
mkdir -p "$SITEMAP_DIR"

# Initialize master sitemap.xml in root
MASTER_SITEMAP="./sitemap.xml"
echo '<?xml version="1.0" encoding="UTF-8"?>' > "$MASTER_SITEMAP"
echo '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> "$MASTER_SITEMAP"

# Current timestamp in ISO 8601 format
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S+00:00")

# --- Process index.html first as home-sitemap.xml ---
# --- Process index.html first as home-sitemap.xml ---
if [ -f "index.html" ]; then
    SITEMAP_NAME="home-sitemap.xml"
    CHANGEFREQ="daily"
    PRIORITY="1.0"

    # Generate home sitemap pointing to root URL
    SITEMAP_FILE="$SITEMAP_DIR/$SITEMAP_NAME"
    echo '<?xml version="1.0" encoding="UTF-8"?>' > "$SITEMAP_FILE"
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> "$SITEMAP_FILE"
    echo "  <url>" >> "$SITEMAP_FILE"
    echo "    <loc>$BASE_URL</loc>" >> "$SITEMAP_FILE"   # <-- no /index.html
    echo "    <lastmod>$CURRENT_DATE</lastmod>" >> "$SITEMAP_FILE"
    echo "    <changefreq>$CHANGEFREQ</changefreq>" >> "$SITEMAP_FILE"
    echo "    <priority>$PRIORITY</priority>" >> "$SITEMAP_FILE"
    echo "  </url>" >> "$SITEMAP_FILE"
    echo '</urlset>' >> "$SITEMAP_FILE"

    # Add entry to master sitemap first
    echo "  <sitemap>" >> "$MASTER_SITEMAP"
    echo "    <loc>$BASE_URL/$SITEMAP_DIR/$SITEMAP_NAME</loc>" >> "$MASTER_SITEMAP"
    echo "    <lastmod>$CURRENT_DATE</lastmod>" >> "$MASTER_SITEMAP"
    echo "  </sitemap>" >> "$MASTER_SITEMAP"
fi


# --- Loop through all other HTML files ---
for file in *.html; do
    [ "$file" = "index.html" ] && continue  # skip index.html

    name="${file%.html}"
    SITEMAP_NAME="$name-sitemap.xml"

    # Determine changefreq and priority
    case "$name" in
        blog*|blogs)
            CHANGEFREQ="weekly"
            PRIORITY="0.9"
            ;;
        terms)
            CHANGEFREQ="yearly"
            PRIORITY="0.6"
            ;;
        *)
            CHANGEFREQ="monthly"
            PRIORITY="0.7"
            ;;
    esac

    # Generate individual sitemap XML
    SITEMAP_FILE="$SITEMAP_DIR/$SITEMAP_NAME"
    echo '<?xml version="1.0" encoding="UTF-8"?>' > "$SITEMAP_FILE"
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> "$SITEMAP_FILE"
    echo "  <url>" >> "$SITEMAP_FILE"
    echo "    <loc>$BASE_URL/$file</loc>" >> "$SITEMAP_FILE"
    echo "    <lastmod>$CURRENT_DATE</lastmod>" >> "$SITEMAP_FILE"
    echo "    <changefreq>$CHANGEFREQ</changefreq>" >> "$SITEMAP_FILE"
    echo "    <priority>$PRIORITY</priority>" >> "$SITEMAP_FILE"
    echo "  </url>" >> "$SITEMAP_FILE"
    echo '</urlset>' >> "$SITEMAP_FILE"

    # Add entry to master sitemap
    echo "  <sitemap>" >> "$MASTER_SITEMAP"
    echo "    <loc>$BASE_URL/$SITEMAP_DIR/$SITEMAP_NAME</loc>" >> "$MASTER_SITEMAP"
    echo "    <lastmod>$CURRENT_DATE</lastmod>" >> "$MASTER_SITEMAP"
    echo "  </sitemap>" >> "$MASTER_SITEMAP"
done

# Close master sitemap.xml
echo '</sitemapindex>' >> "$MASTER_SITEMAP"

echo "✅ Master sitemap.xml created with home-sitemap.xml first, individual sitemaps in $SITEMAP_DIR"
