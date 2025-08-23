import chardet

# Read raw file
with open("features.html", "rb") as f:
    raw_data = f.read()

# Detect encoding
encoding_info = chardet.detect(raw_data)
file_encoding = encoding_info['encoding'] if encoding_info['encoding'] else 'utf-8'
print(f"Detected encoding: {file_encoding}")

# Read file line by line with detected encoding
with open("features.html", "r", encoding=file_encoding, errors='replace') as f:
    lines = f.readlines()

# Find lines containing non-ASCII characters (likely MacRoman specific)
issue_lines = []
for idx, line in enumerate(lines, start=1):
    if any(ord(char) > 127 for char in line):
        issue_lines.append((idx, line.strip()))

if issue_lines:
    print("Lines containing non-ASCII / MacRoman characters:")
    for line_num, content in issue_lines:
        print(f"Line {line_num}: {content}")
else:
    print("No lines with non-ASCII / MacRoman characters found.")

