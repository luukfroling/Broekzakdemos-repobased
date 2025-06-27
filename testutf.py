def is_utf8(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            f.read()
        return True
    except UnicodeDecodeError:
        return False

# Gebruik
bestand = "reference.bib"
if is_utf8(bestand):
    print("✅ Bestand is geldig UTF-8")
else:
    print("❌ Bestand is géén geldig UTF-8")