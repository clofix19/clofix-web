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

# Loop through all HTML files in current directory
for file in *.html; do
    # Remove .html extension
    name="${file%.html}"

    # Determine changefreq and priority
    case "$name" in
        index)
            CHANGEFREQ="daily"
            PRIORITY="1.0"
            ;;
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

    # Get last modified timestamp in ISO 8601 format
    LASTMOD=$(date -u -r "$file" +"%Y-%m-%dT%H:%M:%S+00:00")

    # Generate individual sitemap XML in SITEMAP_DIR
    SITEMAP_FILE="$SITEMAP_DIR/$name-sitemap.xml"
    echo '<?xml version="1.0" encoding="UTF-8"?>' > "$SITEMAP_FILE"
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> "$SITEMAP_FILE"
    echo "  <url>" >> "$SITEMAP_FILE"
    echo "    <loc>$BASE_URL/$file</loc>" >> "$SITEMAP_FILE"
    echo "    <lastmod>$LASTMOD</lastmod>" >> "$SITEMAP_FILE"
    echo "    <changefreq>$CHANGEFREQ</changefreq>" >> "$SITEMAP_FILE"
    echo "    <priority>$PRIORITY</priority>" >> "$SITEMAP_FILE"
    echo "  </url>" >> "$SITEMAP_FILE"
    echo '</urlset>' >> "$SITEMAP_FILE"

    # Add entry to master sitemap.xml
    echo "  <sitemap>" >> "$MASTER_SITEMAP"
    echo "    <loc>$BASE_URL/$SITEMAP_DIR/$name-sitemap.xml</loc>" >> "$MASTER_SITEMAP"
    echo "    <lastmod>$LASTMOD</lastmod>" >> "$MASTER_SITEMAP"
    echo "  </sitemap>" >> "$MASTER_SITEMAP"

done

# Close master sitemap.xml
echo '</sitemapindex>' >> "$MASTER_SITEMAP"

echo "✅ Master sitemap.xml created in root, individual sitemaps in $SITEMAP_DIR"
