import os
import json

app_dirs = ['apps/boostertea-web', 'apps/funnydrops-web', 'apps/dinoslush-web', 'apps/tlab-web', 'apps/wsm-dashboard']

for d in app_dirs:
    ts_path = os.path.join(d, 'tsconfig.json')
    if os.path.exists(ts_path):
        with open(ts_path, 'r') as f:
            content = json.load(f)
        
        if 'compilerOptions' not in content:
            content['compilerOptions'] = {}
        
        content['compilerOptions']['strict'] = True
        
        with open(ts_path, 'w') as f:
            json.dump(content, f, indent=2)
        print(f"Enforced strict mode in {ts_path}")
