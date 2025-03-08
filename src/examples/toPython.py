import os
import re

def extract_code_snippets(source_dir, output_dir="python"):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    for root, _, files in os.walk(source_dir):
        for file in files:
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            snippets = re.findall(r'`(?:python\n)?(.*?)`', content, re.DOTALL)
            
            if snippets:
                output_file_path = os.path.join(output_dir, f"{os.path.splitext(file)[0]}.py")
                with open(output_file_path, "w", encoding="utf-8") as out_f:
                    out_f.write("\n\n".join(snippets))
                print(f"Extracted code saved to: {output_file_path}")

if __name__ == "__main__":
    source_directory = "typescript"  # Change this to your target directory
    extract_code_snippets(source_directory)
