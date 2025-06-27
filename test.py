with open("reference.bib", "rb") as f:
    data = f.read()
    print(f"Byte at position 5341: {data[5340:5345]}")


data[5340:5345].decode('utf-8', errors='replace')