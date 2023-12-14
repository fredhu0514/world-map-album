import os

def is_text_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            f.read()
        return True
    except UnicodeDecodeError:
        return False

def list_files(directory, output_file):
    ignored_dirs = {".next", "node_modules"}
    ignored_files = {".env", ".eslintrc.json", ".gitignore", "README.md", "package-lock.json", "WORLD-MAP-ALBUM File Structure.txt", "GPT.py"}

    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(directory):
            # Skip specific directories
            dirs[:] = [d for d in dirs if d not in ignored_dirs]

            for file in files:
                if any(file.endswith(ext) for ext in ignored_files):
                    continue  # Skip specific files

                file_path = os.path.join(root, file)
                if is_text_file(file_path):
                    outfile.write("<<<<<<<<<<FILE START>>>>>>>>>>\n")
                    outfile.write(f"File Path: {file_path}\n\n")
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        outfile.write(infile.read())
                    outfile.write("\n<<<<<<<<<<FILE END>>>>>>>>>>\n\n\n")

list_files('.', 'WORLD-MAP-ALBUM File Structure.txt')
