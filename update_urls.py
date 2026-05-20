import os
import re

reqs = """fastapi
uvicorn
sqlalchemy
psycopg2-binary
passlib
bcrypt
cloudinary
python-multipart
python-dotenv
httpx"""
with open('backend/requirements.txt', 'w') as f:
    f.write(reqs)
print('Generated backend/requirements.txt')

frontend_dir = 'frontend/src'
for root, dirs, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith('.jsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'AppContext.jsx' in path:
                if 'API_BASE_URL' not in content:
                    content = content.replace(
                        "axios.defaults.baseURL = 'http://127.0.0.1:8000';",
                        "export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';\naxios.defaults.baseURL = API_BASE_URL;"
                    )
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                continue

            orig_content = content
            
            content = re.sub(r"axios\.([a-z]+)\(([\"'`])http://127\.0\.0\.1:8000/", r"axios.\1(\2/", content)
            
            content = re.sub(r"([\"'`])http://127\.0\.0\.1:8000/([^\s\"'`{}<>]+)([\"'`])", r"{`${API_BASE_URL}/\2`}", content)
            
            if content != orig_content:
                if 'API_BASE_URL' in content and 'API_BASE_URL' not in orig_content:
                    depth = path.count(os.sep) - frontend_dir.count(os.sep)
                    rel_path = '../' * (depth - 1) + 'context/AppContext' if depth > 1 else './context/AppContext'
                    import_statement = f"import {{ API_BASE_URL }} from '{rel_path}';\n"
                    
                    import_idx = content.rfind('import ')
                    if import_idx != -1:
                        end_of_line = content.find('\n', import_idx)
                        content = content[:end_of_line+1] + import_statement + content[end_of_line+1:]
                    else:
                        content = import_statement + content

                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print('Updated', path)
